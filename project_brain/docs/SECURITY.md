# Security Policy

## Reporting a vulnerability
**Please do NOT open a public issue.**

Email **security@nama.local** with:
- Description and impact
- Steps to reproduce (PoC)
- Affected component(s) and version
- Your contact info for follow-up

We acknowledge within **48 hours** and provide a remediation timeline within **7 days**.

## Scope
- NamaMedical platform (all services).
- Customer-deployed instances are out of scope unless coordinated.

## Safe harbor
Researchers acting in good faith — no PHI exfiltration, no service disruption, no
social engineering — are not pursued legally. Coordinated disclosure required.

## Severity & SLA
| Severity | Patch SLA |
|----------|-----------|
| Critical | 7 days |
| High | 30 days |
| Medium | 90 days |
| Low | next release |

## Crypto & data
- TLS 1.3 only; HSTS.
- AES-256/TDE at rest; envelope encryption for blobs.
- KSA data residency by default.

## Audit
- Hash-chained audit log for tamper-evidence.
- 7+ years retention for security logs.

## Public PGP / contact
- Email: security@nama.local
- DPO (privacy): dpo@nama.local
- Saudi CERT: cert@cert.gov.sa
