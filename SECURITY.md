# LexAxiom Security Implementation Guide

## Overview

LexAxiom implements enterprise-grade security with SSL/TLS certificates, Identity & Access Management (IAM), end-to-end encryption, and comprehensive audit logging.

## Table of Contents

1. [SSL/TLS Certificates](#ssltls-certificates)
2. [Identity & Access Management](#identity--access-management)
3. [Data Encryption](#data-encryption)
4. [Authentication & Authorization](#authentication--authorization)
5. [Multi-Factor Authentication](#multi-factor-authentication)
6. [Audit Logging](#audit-logging)
7. [Deployment](#deployment)

---

## SSL/TLS Certificates

### Automatic HTTPS (Vercel)

LexAxiom on Vercel automatically enforces HTTPS with managed SSL/TLS certificates:

- **TLS 1.3 Primary**, TLS 1.2 Fallback
- **Automatic Certificate Renewal**
- **No Additional Configuration Required**

### Self-Hosted Deployment

For self-hosted deployments, use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Identity & Access Management

### User Roles

LexAxiom implements four-tier role-based access control:

| Role | Permissions |
|------|-------------|
| **Super Admin** | Full system access, user management, audit logs |
| **Admin** | User management, document deletion, audit access |
| **Uploader** | Document upload, own document management, verification |
| **Viewer** | Read-only access to assigned documents |

### User Management API

#### Create User
```bash
curl -X POST http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe",
    "role": "uploader"
  }'
```

#### List Users
```bash
curl http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer {token}"
```

#### Update User
```bash
curl -X PUT http://localhost:3000/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "userId": "user-123",
    "role": "admin",
    "isActive": true
  }'
```

---

## Data Encryption

### Encryption in Transit

All data in transit uses TLS 1.3 with AEAD cipher suites:

```typescript
// Middleware automatically enforces
- Strict-Transport-Security (HSTS)
- Content-Security-Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
```

### Encryption at Rest

Sensitive data is encrypted using AES-256-GCM:

```typescript
import { encryptData, decryptData } from '@/lib/encryption'

// Encrypt sensitive information
const encrypted = encryptData('sensitive@email.com')
// Result: { ciphertext, iv, authTag }

// Decrypt when needed
const decrypted = decryptData(encrypted)
// Result: 'sensitive@email.com'
```

**Encrypted Fields:**
- User emails
- Phone numbers
- Password hashes (additional layer)

### Database Encryption

For PostgreSQL, enable column-level encryption:

```sql
-- Install pgcrypto extension
CREATE EXTENSION pgcrypto;

-- Encrypt sensitive columns
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    encrypted_email BYTEA,
    phone TEXT,
    encrypted_phone BYTEA
);

-- Insert with encryption
INSERT INTO users (id, email, encrypted_email)
VALUES (
    gen_random_uuid(),
    'user@example.com',
    pgp_sym_encrypt('user@example.com', 'encryption_key')
);

-- Select with decryption
SELECT id, pgp_sym_decrypt(encrypted_email, 'encryption_key')
FROM users;
```

---

## Authentication & Authorization

### Login Flow

```
1. User submits email/password
2. System verifies password with bcrypt
3. If MFA enabled, prompts for code
4. System generates JWT and refresh tokens
5. Tokens stored in HttpOnly cookies
6. User redirected to dashboard
```

### API Authentication

All protected endpoints require valid JWT:

```bash
curl http://localhost:3000/api/users/profile \
  -H "Cookie: auth-token=eyJhbGciOiJIUzI1NiIs..."
```

### Session Management

- **Access Token**: 1 hour expiration
- **Refresh Token**: 7 days expiration
- **HttpOnly Cookies**: Prevents XSS attacks
- **Secure Flag**: HTTPS only

---

## Multi-Factor Authentication

### TOTP (Time-Based One-Time Password)

Users can enable TOTP using authenticator apps:

```typescript
// Setup MFA
POST /api/auth/mfa/setup

// Response includes:
// - QR code for authenticator app
// - Secret for manual entry
// - Backup codes for account recovery

// Verify MFA
POST /api/auth/mfa/verify
{
  "token": "123456",
  "secret": "base32_secret"
}
```

### Backup Codes

10 unique backup codes generated during MFA setup:
- Can be used instead of TOTP code
- Each code is single-use
- Stored encrypted in database

### SMS OTP (Optional)

Extend MFA with SMS OTP:

```typescript
const otp = await generateSMSOTP(6) // Returns 6-digit code
// Send via Twilio/AWS SNS
```

---

## Audit Logging

### Log Events

All security-relevant events are logged:

```typescript
- User registration/login
- Password changes
- MFA setup/disable
- Document upload/deletion
- User role changes
- Failed login attempts
- API access
```

### Access Logs

```bash
curl http://localhost:3000/api/audit-logs \
  -H "Authorization: Bearer {token}" \
  -H "Cookie: auth-token=..."
```

### Log Retention

- Default: 90 days
- Configurable: `clearOldLogs(daysOld)`

---

## Deployment

### Environment Variables

```env
# JWT Secrets
JWT_SECRET=your_secure_jwt_secret_here
REFRESH_SECRET=your_secure_refresh_secret_here

# Encryption
ENCRYPTION_KEY=your_secure_encryption_key_here

# Database
DATABASE_URL=postgresql://user:pass@host/dbname

# Email (Optional)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

### Vercel Deployment

1. **Connect Repository**
   ```bash
   vercel
   ```

2. **Add Environment Variables**
   - Visit Vercel Dashboard
   - Project Settings → Environment Variables
   - Add all required variables

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Verify HTTPS**
   - Automatic SSL certificate
   - HSTS and security headers enabled by default

### Self-Hosted Deployment (Docker)

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .

RUN npm ci --only=production
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t lexaxiom .
docker run -p 3000:443 \
  -e JWT_SECRET=your_secret \
  -e ENCRYPTION_KEY=your_key \
  -v /etc/letsencrypt:/etc/letsencrypt:ro \
  lexaxiom
```

---

## Security Best Practices

1. **Password Policy**
   - Minimum 8 characters
   - Hashed with bcrypt (10 rounds)
   - Never stored in plaintext

2. **Token Management**
   - Short-lived access tokens (1 hour)
   - Secure refresh tokens (7 days)
   - Tokens revoked on logout

3. **Input Validation**
   - All inputs validated with Zod
   - SQL injection prevention (parameterized queries)
   - XSS prevention (content escaping)

4. **CORS**
   - Restricted to trusted origins
   - Credentials required for cross-origin requests

5. **Rate Limiting**
   - Implement for login attempts
   - API endpoint throttling
   - DDoS protection

6. **Regular Updates**
   - Keep dependencies updated
   - Security patches applied immediately
   - Vulnerability scanning

---

## Compliance

LexAxiom implements features for various compliance requirements:

- **GDPR**: Data encryption, audit logs, right to deletion
- **HIPAA**: End-to-end encryption, access controls, audit trails
- **SOC 2**: MFA, encryption, logging, access management
- **ISO 27001**: Information security management system

---

## Support

For security issues or vulnerabilities, please contact:
- Email: security@lexaxiom.com
- Report: Use responsible disclosure process

Do not disclose security vulnerabilities publicly.

---

**Last Updated**: January 2025
**Version**: 1.0.0
