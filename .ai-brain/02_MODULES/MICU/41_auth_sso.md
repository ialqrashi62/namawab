# Authentication & SSO — Micu (MICU)
**Last updated:** 2026-08-10

## Auth flow for Micu

### Login

```
POST /api/auth/login
  Body: { email, password }
  → bcrypt.compare(password, user.password_hash)
  → if user.mfa_required: respond { mfa_required: true, mfa_token }
  → else: create session, set cookie

POST /api/auth/mfa
  Body: { mfa_token, totp_code }
  → speakeasy.totp.verify({ secret: user.mfa_secret, token: totp_code })
  → if valid: create session, set cookie
```

### Session policy

- Cookie: `nama.sid` · httpOnly · secure · sameSite=strict
- Idle timeout: 30 minutes
- Absolute timeout: 8 hours

### SSO providers

| Provider | Saudi | Use case |
|---|---|---|
| Nafath (national SSO) | ✅ | Government employees + citizens |
| Apple ID | ✅ | iOS users |
| Google Workspace | ✅ | Hospital staff |
| Microsoft 365 | ✅ | Hospital staff |
| Okta / Auth0 | ✅ | Enterprise |

### MFA enforcement

- Mandatory: doctor · admin · finance · accounts · quality · infection
- Optional: nurse · pharmacist · lab tech · radiologist · cashier
- Disabled: patient portal (use SMS OTP instead)

### Password policy

- Min 12 chars
- Upper + lower + digit + special
- bcrypt cost factor 12+
- No forced rotation

### Account lockout

- 5 failed → 15 min lockout
- 10 failed → 1 hour
- 20 failed → admin notification + IP block

### Micu-specific

- Micu workflow requires role: `micu_user` (e.g., `cardiologist`)
- Cross-specialty access denied by default (Golden Access Rule)
- Emergency override: emergency button logs override + notifies CMO
