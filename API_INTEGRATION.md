# API Integration Guide

## Overview

LexAxiom provides a comprehensive REST API for document verification, user management, and security operations. All endpoints require authentication via JWT tokens.

## Authentication

### Login
**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "mfaEnabled": false
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Register
**Endpoint:** `POST /api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

### Logout
**Endpoint:** `POST /api/auth/logout`

Requires authentication header.

## User Management

### Get Profile
**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "mfaEnabled": false,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Update Profile
**Endpoint:** `PUT /api/users/profile`

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

### Change Password
**Endpoint:** `PUT /api/users/password`

```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## MFA (Multi-Factor Authentication)

### Setup MFA
**Endpoint:** `POST /api/auth/mfa/setup`

**Response:**
```json
{
  "success": true,
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "qrCode": "data:image/png;base64,..."
}
```

### Verify MFA Code
**Endpoint:** `POST /api/auth/mfa/verify`

```json
{
  "code": "123456"
}
```

## Audit Logs

### Get Audit Logs
**Endpoint:** `GET /api/audit-logs?limit=50&offset=0`

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": "log-123",
      "userId": "user-123",
      "action": "LOGIN",
      "resource": "auth",
      "details": "User logged in successfully",
      "ipAddress": "192.168.1.1",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1000
}
```

## Admin Operations

### Get All Users (Admin Only)
**Endpoint:** `GET /api/admin/users?role=user&limit=50`

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "mfaEnabled": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "lastLogin": "2024-01-20T14:22:00Z"
    }
  ],
  "total": 150
}
```

### Update User Role (Admin Only)
**Endpoint:** `PUT /api/admin/users/{userId}`

```json
{
  "role": "admin",
  "status": "active"
}
```

### Delete User (Admin Only)
**Endpoint:** `DELETE /api/admin/users/{userId}`

### Suspend User (Admin Only)
**Endpoint:** `POST /api/admin/users/{userId}/suspend`

```json
{
  "reason": "Suspicious activity detected"
}
```

## Error Handling

All endpoints return standard error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email address",
    "details": {
      "field": "email",
      "reason": "Invalid format"
    }
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401): Missing or invalid authentication token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input data
- `SERVER_ERROR` (500): Internal server error
- `MFA_REQUIRED` (403): MFA verification required

## Rate Limiting

All endpoints are rate-limited to prevent abuse:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated endpoints
- Rate limit headers included in all responses

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642270800
```

## Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: default-src 'self'`

## Encryption

All sensitive data is encrypted in transit using TLS 1.3 and at rest using AES-256. Encryption keys are stored securely and rotated regularly.

## Compliance

The API implements:
- GDPR compliance for data handling
- HIPAA compliance for healthcare data
- SOC 2 Type II controls
- Regular security audits and penetration testing
