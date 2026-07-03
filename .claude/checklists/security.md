# Security Checklist

**Cross-cutting coverage gate — the single source for security across UI, API,
mobile, and IoT.** The domain checklists reference this file; they do not repeat it.

## Authentication
- Valid login
- Invalid login
- Locked account
- Password reset
- MFA
- Session timeout
- Token expiration
- Logout invalidation
- Brute force protection

## Authorization
- Role-based access
- Direct URL access
- Cross-user access
- Cross-tenant access
- Admin-only functions
- Guest access
- Revoked permissions
- Object-level authorization

## Input Security
- XSS
- SQL injection
- Command injection
- Path traversal
- Malformed input
- Oversized input
- Special characters
- HTML/script injection

## API Security
- Missing token
- Invalid token
- Expired token
- Wrong role
- Rate limiting
- Mass assignment
- Sensitive response data
- Error message leakage
- CORS behavior

## Data Protection
- Password masking
- PII masking
- Sensitive logs
- Secure storage
- Encryption in transit
- Encryption at rest
- No secrets in source code

## Session Security
- Session timeout
- Forced logout
- Refresh token behavior
- Multiple sessions
- Remember me behavior
- Cookie flags
- Secure and HttpOnly cookies
