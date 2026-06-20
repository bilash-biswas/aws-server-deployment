# Clean AWS EC2 Deployment & CI/CD Guide

This guide provides a step-by-step walkthrough to deploy the full-stack Task CRUD application to an AWS EC2 instance, configure a secure Nginx reverse proxy, and connect GitHub Actions for automated continuous deployment.

---

## Prerequisites
- An active **AWS Account**.
- A **GitHub Repository** containing your code.
- A domain name (optional, if you want to set up SSL/HTTPS).

---

## Step 1: Launch an AWS EC2 Instance

1. Log in to your **AWS Management Console** and navigate to the **EC2 Dashboard**.
2. Click **Launch Instance**.
3. Configure the following settings:
   - **Name**: `task-crud-server` (or any preferred name).
   - **OS (Amazon Machine Image)**: Select **Ubuntu Server 22.04 LTS** (eligible for Free Tier).
   - **Instance Type**: Select `t2.micro` or `t3.micro` (Free Tier eligible).
   - **Key Pair**: Select or create a key pair (`.pem`) to securely connect via SSH. Keep this file safe.
4. **Network Settings (Security Group)**:
   Create a new Security Group and add the following **Inbound Rules**:
   
   | Service Type | Protocol | Port | Source | Description |
   | :--- | :--- | :--- | :--- | :--- |
   | **SSH** | TCP | `22` | `My IP` | Secure login for yourself |
   | **HTTP** | TCP | `80` | `Anywhere (0.0.0.0/0)` | Public access to frontend |
   | **HTTPS** | TCP | `443` | `Anywhere (0.0.0.0/0)` | Secure public access (SSL) |

5. Click **Launch Instance**.

---

## Step 2: Install Docker and Docker Compose on EC2

1. Open your local terminal (Powershell or Bash) and SSH into your EC2 instance:
   ```bash
   ssh -i "/path/to/your-key.pem" ubuntu@<your-ec2-public-ip>
   ```
2. Once connected, update the system package lists:
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```
3. Install Docker:
   ```bash
   sudo apt-get install -y docker.io
   ```
4. Enable and start the Docker service:
   ```bash
   sudo systemctl enable --now docker
   ```
5. Add the `ubuntu` user to the `docker` group so you can run docker commands without `sudo`:
   ```bash
   sudo usermod -aG docker ubuntu
   ```
   > [!IMPORTANT]
   > For this change to take effect in your *current* terminal session without logging out, run `newgrp docker` in your terminal. Alternatively, you can log out of the SSH session and log back in, or simply prefix commands with `sudo`.

6. Install Docker Compose (V2):
   ```bash
   sudo apt-get install -y docker-compose-v2
   ```


---

## Step 3: Clone the Project and Run Initial Build

1. Create a directory for the application and adjust permissions:
   ```bash
   sudo mkdir -p /home/ubuntu/app
   sudo chown -R ubuntu:ubuntu /home/ubuntu/app
   ```
2. Clone your GitHub repository into the directory:
   ```bash
   git clone <your-github-repo-url> /home/ubuntu/app
   cd /home/ubuntu/app
   ```
3. Create your production environment file for the backend:
   ```bash
   nano backend/.env
   ```
   Paste the backend environment variables, making sure `DB_HOST` points to `db` (the container network name):
   ```env
   PORT=5000
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_HOST=db
   DB_PORT=5432
   DB_NAME=taskdb
   ```
   *(Press `CTRL+O` to write, `Enter` to confirm, and `CTRL+X` to exit nano)*

4. Build and start the services using Docker Compose in background daemon mode:
   ```bash
   docker compose up -d --build
   ```

---

## Step 4: Configure Nginx Reverse Proxy

Nginx will intercept public traffic on port 80/443 and forward requests to Nginx serving React (port 3000) or Express (port 5000) internally.

1. Install Nginx on the EC2 host:
   ```bash
   sudo apt-get install -y nginx
   ```
2. Create a configuration file for the app:
   ```bash
   sudo nano /etc/nginx/sites-available/tasks-app
   ```
3. Paste the following configuration, replacing `localhost` with your public EC2 IP or domain name:
   ```nginx
   server {
       listen 80;
       server_name localhost; # Replace with public EC2 IP or your-domain.com

       # Proxy requests to Frontend Container
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       # Proxy requests to Backend API Container
       location /api/ {
           proxy_pass http://localhost:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
4. Enable the config by linking it to the active folder and removing the default site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/tasks-app /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   ```
5. Test Nginx syntax and restart Nginx:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Step 5: Automate CI/CD via GitHub Actions

1. Go to your **GitHub Repository** -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following **Repository Secrets**:
   - `EC2_HOST`: The public IP or DNS name of your EC2 instance.
   - `EC2_USERNAME`: `ubuntu`
   - `EC2_SSH_KEY`: The entire content of your AWS private key `.pem` file (make sure it includes `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`).

3. Ensure the `.github/workflows/deploy.yml` workflow file is pushed to the `main` branch. 
   On every push to `main`, GitHub Actions will verify your TypeScript compilation on both frontend and backend. If compilation succeeds, it will connect to your EC2 instance via SSH, pull the latest code, spin up updated Docker containers, and prune any obsolete docker layers automatically.

---

## Step 6: (Optional) Secure with Let's Encrypt SSL/HTTPS

If you mapped a domain to your EC2 instance, secure it using Certbot:

1. Install Certbot Nginx plugin:
   ```bash
   sudo apt-get install -y certbot python3-certbot-nginx
   ```
2. Request and apply the certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```
3. Certbot will automatically edit your Nginx settings to handle SSL redirections. Verify the automatic certificate renewal:
   ```bash
   sudo certbot renew --dry-run
   ```
