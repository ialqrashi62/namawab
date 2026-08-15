# CARD-301_STROKE — Security Threat Model (STRIDE)

## STRIDE Analysis

### S — Spoofing
| Threat | Mitigation |
|---|---|
| Fake clinician login | bcrypt + MFA + session timeout |
| Spoofed Code Stroke page | Auth required + audit log |
| Forged consent | Witness required + timestamp |
| Fake patient ID | National ID + Yaqeen verification |

### T — Tampering
| Threat | Mitigation |
|---|---|
| Tamper with NIHSS score | Audit log hash-chained |
| Modify thrombolysis record | Append-only audit, immutable |
| Change ts_kn well time | Cross-validated with EMS |
| Modify mRS outcome | Independent scoring by 2nd clinician |

### R — Repudiation
| Threat | Mitigation |
|---|---|
| Clinician denies treatment decision | All actions logged with user_id + IP + timestamp |
| Patient denies consent | Witness signature + timestamp |
| Score disputed | Audit chain with hash |

### I — Information Disclosure
| Threat | Mitigation |
|---|---|
| PHI in logs | Rails #12 — no PHI in console.log |
| Cross-tenant data leak | RLS + tenant_id in every query |
| Unauthorized vector access | Tenant-scoped vector store |
| Snapshot leak | At-rest encryption (DPAPI KEK) |

### D — Denial of Service
| Threat | Mitigation |
|---|---|
| Mass Code Stroke activations | Rate limit + verification |
| Slow CT imaging | CDN + caching |
| Vector DB DoS | Connection limit + read replica |
| API flooding | express-rate-limit |

### E — Elevation of Privilege
| Threat | Mitigation |
|---|---|
| Nurse prescribes Tenecteplase | RBAC: only doctor role |
| Patient edits own record | No write access from patient portal |
| Admin views PHI | Audit log + access review |
| Tenant A accesses Tenant B | RLS + tenant_id everywhere |

## Compliance Matrix

| Standard | Status | Notes |
|---|---|---|
| **PDPL** (Saudi) | ✅ | Consent, encryption, audit |
| **CBAHI** | ✅ | Stroke center standards |
| **NPHIES** | ✅ | Coding bundles |
| **SFDA** | ✅ | Tenecteplase approval |
| **MoH Stroke Program** | ✅ | SLA tracking |
| **AHA/ASA GWTG-S** | ✅ | Data upload |
| **HIPAA** (US bench) | N/A | Not required (KSA-only) |
| **GDPR** (EU bench) | N/A | Not required (KSA-only) |

## Penetration Test Checklist

- [ ] Auth bypass attempts (no cookie, expired session)
- [ ] Tenant isolation (modified tenant_id in body)
- [ ] SQL injection (parametrized only)
- [ ] XSS (escapeHTML, no raw innerHTML)
- [ ] CSRF (CSP nonces + token)
- [ ] Mass assignment (JSON whitelist)
- [ ] Privilege escalation (RBAC)
- [ ] PHI in URL params (use POST body)
- [ ] Rate limiting (10 req/sec per session)
- [ ] Logging safety (no PHI)

## Incident Response

1. **Detection**: PagerDuty alert
2. **Triage**: On-call security within 30 min
3. **Containment**: Disable affected endpoint
4. **Investigation**: Audit log review
5. **Recovery**: Deploy patch
6. **Post-mortem**: Within 72 hours
