# LexAxiom Setup & Installation Guide

## Table of Contents

1. [Local Development Setup](#local-development-setup)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [Testing Features](#testing-features)
6. [Vercel Deployment](#vercel-deployment)
7. [Self-Hosted Deployment](#self-hosted-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites

- **Node.js**: 18.17 or higher ([Download](https://nodejs.org/))
- **npm/pnpm**: Comes with Node.js
- **Git**: For version control ([Download](https://git-scm.com/))
- **VS Code** (Recommended): Code editor

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/keerthanaelangovan28/Lex_Axiom.git

# Navigate to project
cd Lex_Axiom

# Verify Node.js version
node --version  # Should be v18.17.0 or higher
```

### Step 2: Install Dependencies

```bash
# Using npm (included with Node.js)
npm install

# Or using pnpm (faster)
npm install -g pnpm
pnpm install
```

### Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env.local

# Generate secure keys
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))" >> .env.local
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))" >> .env.local
```

### Step 4: Verify Setup

```bash
# Check Node.js and npm versions
node --version
npm --version

# List installed dependencies
npm list | head -20
```

---

## Environment Configuration

### Basic Setup (.env.local)

```env
# ===== REQUIRED =====
JWT_SECRET=your_random_32_char_string_here
REFRESH_SECRET=your_random_32_char_string_here
ENCRYPTION_KEY=your_64_char_hex_string_here
NODE_ENV=development

# ===== OPTIONAL =====
NEXT_PUBLIC_API_URL=http://localhost:3000
SESSION_TIMEOUT=3600000
```

### Generate Secure Keys

```bash
# JWT Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Encryption Key (64 hex characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output and paste into .env.local
```

### Verify Configuration

```bash
# Check if env file exists
ls -la .env.local

# Verify key format
grep "JWT_SECRET\|ENCRYPTION_KEY" .env.local
```

---

## Database Setup

### Option 1: Without Database (Development)

The application uses in-memory storage by default. Perfect for development and testing.

**Limitations:**
- Data resets on server restart
- Single instance only
- No persistence

### Option 2: With PostgreSQL (Recommended)

```bash
# Option A: Using Docker
docker pull postgres:15-alpine
docker run -d \
  --name lexaxiom-postgres \
  -e POSTGRES_USER=lexaxiom \
  -e POSTGRES_PASSWORD=lexaxiom123 \
  -e POSTGRES_DB=lexaxiom \
  -p 5432:5432 \
  postgres:15-alpine

# Option B: Using Docker Compose
docker-compose up -d postgres

# Verify connection
psql -h localhost -U lexaxiom -d lexaxiom
```

### Option 3: Using Existing Database

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

---

## Running the Application

### Development Mode

```bash
# Start development server with hot reload
npm run dev

# Server will be available at:
# http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start

# Server will be available at:
# http://localhost:3000
```

### Using Docker

```bash
# Using Docker Compose (includes all services)
docker-compose up

# Wait for services to start
# Application: http://localhost:3000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

---

## Testing Features

### 1. Authentication Testing

#### Sign Up
1. Navigate to http://localhost:3000/auth/register
2. Fill in the form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "TestPassword123!"
3. Click "Create Account"
4. You'll be redirected to login

#### Sign In
1. Use default admin account:
   - Email: `admin@lexaxiom.com`
   - Password: `admin123`
2. Or use newly created account

### 2. MFA Setup Testing

1. Login to dashboard
2. Go to Settings → Security
3. Click "Enable Two-Factor Authentication"
4. Scan QR code with Google Authenticator:
   - Android: [Google Play](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)
   - iOS: [App Store](https://apps.apple.com/us/app/google-authenticator/id388497605)
5. Enter 6-digit code from app
6. Save backup codes in secure location

### 3. Document Verification Testing

1. Dashboard → "Verify Document"
2. Click "Load Sample NDA" button
3. Enter a query (e.g., "Is this an NDA?")
4. Wait for 5-layer verification
5. Review results:
   - Confidence score
   - Verification details
   - Heatmap visualization
   - Certificate

### 4. Admin Features Testing

#### User Management
1. Admin → User Management
2. Click "Add New User"
3. Fill in details:
   - Email: "newuser@example.com"
   - Password: "SecurePass123!"
   - Name: "New User"
   - Role: "uploader"
4. Click "Create User"

#### Audit Logs
1. Admin → Audit Logs
2. View all system activities
3. Try different filters:
   - By user
   - By action (login, create, etc.)
   - By resource type

### 5. Security Headers Testing

```bash
# Check security headers
curl -I http://localhost:3000

# Should include:
# Strict-Transport-Security
# Content-Security-Policy
# X-Content-Type-Options
# X-Frame-Options
```

---

## Vercel Deployment

### Step 1: Prepare Repository

```bash
# Push code to GitHub
git add .
git commit -m "feat: complete lexaxiom implementation"
git push origin main
```

### Step 2: Connect to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub account
3. Click "Import Project"
4. Select the repository
5. Click "Import"

### Step 3: Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Click "Environment Variables"
3. Add the following:
   - `JWT_SECRET`: Your secure JWT secret
   - `REFRESH_SECRET`: Your secure refresh secret
   - `ENCRYPTION_KEY`: Your secure encryption key
   - `NODE_ENV`: `production`

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Access your app at: `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps
4. Vercel automatically manages SSL certificate

---

## Self-Hosted Deployment

### Using Docker on VPS

#### Prerequisites
- VPS with Docker installed (Ubuntu 20.04+ recommended)
- SSL certificate (Let's Encrypt free option)
- Domain name

#### Step 1: Set Up Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 2: Clone and Configure

```bash
# Clone repository
cd /opt
sudo git clone https://github.com/keerthanaelangovan28/Lex_Axiom.git
cd Lex_Axiom

# Create environment file
sudo cp .env.example .env
sudo nano .env  # Edit with your values

# Set permissions
sudo chown -R $USER:$USER .
chmod 755 .
```

#### Step 3: Get SSL Certificate

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (requires DNS pointed to your IP)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificate will be at:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

#### Step 4: Set Up Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Create config file
sudo nano /etc/nginx/sites-available/lexaxiom
```

```nginx
# Nginx Configuration
upstream lexaxiom {
    server app:3000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://lexaxiom;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/lexaxiom /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

#### Step 5: Deploy with Docker

```bash
# Start containers
docker-compose -f docker-compose.yml up -d

# Check logs
docker-compose logs -f app

# Stop containers
docker-compose down
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Dependencies Installation Fails

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Verify DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Encryption Key Errors

```bash
# Generate new keys
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(32).toString('hex'))"

# Update .env.local
# Restart server
npm run dev
```

### MFA Not Working

```bash
# Check system time is correct
date

# Verify authenticator app time is synced
# Try backup code instead

# Clear browser cache
# Logout and login again
```

### Build Fails

```bash
# Check Node version
node --version  # Should be 18+

# Try next build
npm run build

# Check for errors
npm run lint
```

---

## Performance Optimization

### Enable Caching

```env
# In .env.local
NEXT_CACHE_HANDLER=true
```

### Database Indexing

```sql
-- If using PostgreSQL
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
```

### CDN Configuration (Vercel)

Automatic with Vercel - no additional setup needed.

---

## Security Checklist

- [ ] Generate new JWT_SECRET for production
- [ ] Generate new ENCRYPTION_KEY for production
- [ ] Change default admin password
- [ ] Enable MFA for admin accounts
- [ ] Configure SMTP for email notifications
- [ ] Set up database backups
- [ ] Enable SSL/TLS certificate
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerts
- [ ] Review and update security headers

---

## Next Steps

1. Review [SECURITY.md](./SECURITY.md) for security best practices
2. Read [README.md](./README.md) for full documentation
3. Set up monitoring and logging
4. Configure backups and disaster recovery
5. Plan for scaling and performance

---

**Last Updated**: January 2025
