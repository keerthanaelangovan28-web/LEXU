# LexAxiom Quick Start Guide

Get up and running with LexAxiom in 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm or pnpm
- Code editor (VS Code recommended)

## Installation (2 minutes)

```bash
# 1. Clone the repository
git clone https://github.com/keerthanaelangovan28/Lex_Axiom.git
cd Lex_Axiom

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local

# 4. Start development server
npm run dev
```

Done! App is running at **http://localhost:3000**

## Login (30 seconds)

1. Open http://localhost:3000
2. Use default credentials:
   - Email: `admin@lexaxiom.com`
   - Password: `admin123`
3. Click "Sign In"

## First Steps (2 minutes)

### 1. Explore Dashboard
- Dashboard shows statistics and recent activity
- View verification trends and document metrics

### 2. Verify a Document
1. Click "Verify Document" in sidebar
2. Click "Load Sample NDA" button
3. Enter a query (e.g., "Is this an NDA?")
4. Watch 5-layer verification in action!
5. See confidence scores and detailed results

### 3. Enable Two-Factor Authentication
1. Go to Settings → Security
2. Click "Enable Two-Factor Authentication"
3. Scan QR code with Google Authenticator
4. Enter 6-digit code to verify
5. Save backup codes safely!

### 4. Create a New User (Admin)
1. Navigate to Admin → User Management
2. Click "Add New User"
3. Fill in details:
   - Email: newuser@example.com
   - Password: SecurePass123!
   - Name: New User
   - Role: uploader
4. Click "Create User"

### 5. View Activity Logs
1. Go to Admin → Audit Logs
2. See all system activities
3. Filter by user, action, or time

## Key Features

### Verification Engine
- Upload legal documents
- 5-layer AI verification
- Get confidence scores
- Download certificates

### Security
- Military-grade encryption (AES-256)
- Two-factor authentication
- Role-based access control
- Complete audit logging

### Dashboard
- Real-time statistics
- Activity feeds
- Document management
- User administration

## Common Tasks

### Change Your Password
1. Settings → Security → "Change Password"
2. Enter new password (min 8 chars)
3. Click "Update Password"

### Upload a Document
1. Dashboard → "Verify Document"
2. Upload PDF file
3. Enter query about the document
4. Wait for results

### Manage Users
1. Admin → User Management
2. Add, edit, or delete users
3. Assign roles and permissions

### View Logs
1. Admin → Audit Logs
2. See who did what and when
3. Filter by date range

## Environment Variables

Edit `.env.local` to customize:

```env
JWT_SECRET=your_secret_here
ENCRYPTION_KEY=your_key_here
NODE_ENV=development
```

**Generate secure keys:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Deployment

### Deploy to Vercel (Free)
1. Push code to GitHub
2. Visit vercel.com
3. Import repository
4. Add environment variables
5. Deploy! ✅

See [SETUP.md](./SETUP.md) for Docker and self-hosted options.

## Troubleshooting

### "Port 3000 in use"
```bash
npm run dev -- -p 3001
```

### "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### Clear cache
```bash
# Clear npm cache
npm cache clean --force

# Clear browser cache
Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
```

## API Examples

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lexaxiom.com",
    "password": "admin123"
  }'
```

### Get Profile
```bash
curl http://localhost:3000/api/users/profile \
  -H "Cookie: auth-token=YOUR_TOKEN"
```

### List Users
```bash
curl http://localhost:3000/api/admin/users \
  -H "Cookie: auth-token=YOUR_TOKEN"
```

## Default Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Super Admin | admin@lexaxiom.com | admin123 | Everything |
| Viewer | viewer@example.com | password | Read-only |

## Roles Explained

- **Super Admin**: Full system control
- **Admin**: User management, audit logs
- **Uploader**: Upload and verify documents
- **Viewer**: View documents only

## Security Tips

✅ Change default admin password
✅ Enable MFA for all users
✅ Use strong passwords (8+ chars)
✅ Keep encryption keys safe
✅ Review audit logs regularly
✅ Update Node.js regularly

## Next Steps

1. Read [README.md](./README.md) for full documentation
2. Review [SECURITY.md](./SECURITY.md) for security details
3. Check [SETUP.md](./SETUP.md) for deployment guide
4. Join community and contribute!

## Need Help?

- 📖 Check [README.md](./README.md)
- 🔒 See [SECURITY.md](./SECURITY.md)
- 🚀 Visit [SETUP.md](./SETUP.md)
- 💬 Report issues on GitHub

---

**Happy using LexAxiom!**

For more info, visit: https://github.com/keerthanaelangovan28/Lex_Axiom
