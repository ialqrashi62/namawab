# NamaMedical — Security Baseline

> Defense-in-depth across application, data, network, identity, and operations.
> Mandatory baseline; per-department add-ons in `groups/{NN}_*.md` §14.

## 1) Identity & Access (IAM)
- **Auth**: OAuth 2.1 + OIDC; primary IdP = Keycloak/Azure AD/Okta.
- **MFA**: TOTP or WebAuthn for all clinical + admin users; SMS fallback only for break-glass.
- **JWT**: RS256, exp ≤ 60 min, refresh ≤ 8 h, audience-scoped per service.
- **RBAC**: roles per dept (e.g., `cardio_doctor`, `ed_nurse`, `lab_tech`); least-privilege.
- **ABAC overlay**: facility_id, ward_id, on-call status, break-glass flag.
- **SCIM** for HR-driven provisioning; deactivation ≤ 4 h after termination.
- **Break-glass**: out-of-band token with full audit + 24 h forced review.

## 2) Data protection
| Layer | Control |
|-------|---------|
| At rest | TDE on MSSQL; LUKS on disks; envelope encryption for blobs (MinIO + KMS) |
| In transit | TLS 1.3 only; HSTS; mTLS service-to-service inside cluster |
| Field-level | nationalId, phone, IBAN, device serial — AES-256-GCM with per-tenant DEK |
| Backups | Encrypted offsite snapshots ×2 regions; ransomware-resistant immutability ≥ 30 d |
| Key mgmt | HashiCorp Vault / Azure KeyVault; rotation 90 d; HSM for root keys |

## 3) Network
- Public surface: only ingress (NGINX + WAF) on 443.
- Zero-trust segmentation: Cilium NetworkPolicy default-deny.
- Egress allow-list (LLM endpoint, ZATCA, Wasfaty, MoH portals).
- DDoS protection at edge (Cloudflare/Fastly).
- VPN for admin access; jump host with session recording.

## 4) Application security
- OWASP ASVS L2 baseline; L3 for clinical APIs.
- Input validation: pydantic / class-validator at boundary; reject unknown fields.
- Output encoding everywhere; CSP strict; no `unsafe-inline`/`unsafe-eval`.
- Dep scanning: Snyk + Dependabot; SBOM (CycloneDX) per build.
- Secret scanning: gitleaks + TruffleHog; rotated immediately on leak.
- Container: distroless base; non-root user; read-only FS; drop CAPs.

## 5) AI / LLM specific
- **PII redaction** before sending to LLM: regex + NER pass + DLP gateway.
- **Prompt-injection defense**: system prompt anchoring + delimiters + content classifiers.
- **Output safety**: medical-claim filter; refusal patterns; "advisory only" banner.
- **Inference residency**: KSA-region endpoints preferred; fallback explicit + logged.
- **Caching**: prompt-cache TTL ≤ 24 h; never cache PHI.
- **Audit**: every AI call logged (who, when, prompt-hash, response-hash, confidence).

## 6) Logging, monitoring & detection
- Structured logs (JSON) → Loki; PHI scrubbed before shipping.
- Metrics → Prometheus; SLOs: API p95 ≤ 400 ms, AI p95 ≤ 5 s.
- Tracing → OpenTelemetry → Tempo.
- SIEM: Wazuh / Sentinel; rules: brute force, impossible travel, mass export, off-hour PHI access.
- Tamper-evident audit trail: hash-chained `it_audit_logs` table.
- **Alerting tiers**:
  - Sev1 (patient safety): PagerDuty < 1 min
  - Sev2 (data leak): PagerDuty < 5 min
  - Sev3 (degraded): Slack < 15 min

## 7) Vulnerability management
- Patch SLA: critical 7 d, high 30 d, medium 90 d.
- Quarterly internal pen-test; annual third-party.
- Bug bounty: scoped, with safe-harbor.
- DAST: OWASP ZAP weekly against staging.

## 8) Incident response
- Playbooks: ransomware, PHI breach, insider threat, AI model misuse.
- IR team on-call; tabletop exercises quarterly.
- Forensics retention 1 y; chain-of-custody for legal cases.
- KSA: SAUDI CERT notification per regulation; PDPL breach within 72 h.

## 9) Privacy & PDPL
- Data inventory + DPIA per processing activity.
- Consent registry; granular per purpose.
- Subject rights workflow (access, correction, deletion-where-allowed).
- DPO appointed; DPO email reachable from app footer.

## 10) Third-party risk
- Vendor assessment before integration.
- DPA signed; sub-processor list maintained.
- SBOM exchange; SOC2 Type II preferred for SaaS.

## 11) Compliance mapping (summary; full map in `compliance/`)
- KSA PDPL ✓
- KSA NCA ECC controls ✓
- CBAHI Information Management chapter ✓
- ISO 27001/27799 ✓
- HIPAA equivalent (when serving non-KSA) ✓
- IAEA radiation safety (G21/G28) ✓
- IHR-2005 reporting (G08) ✓

## 12) STRIDE template (reusable per asset)
| Threat | Description | Mitigation | Owner |
|--------|-------------|-----------|-------|
| **S** Spoofing | Identity impersonation | OIDC + MFA + WebAuthn | IAM |
| **T** Tampering | Data/audit tampering | Hash-chained audits + WORM backups | Data |
| **R** Repudiation | "I didn't do it" | Signed audit trail; non-repudiation logging | Sec |
| **I** Info disclosure | PHI leak | Field encryption + DLP + redaction | Sec |
| **D** DoS | Service unavailable | Rate limit + autoscale + WAF | Platform |
| **E** Elevation | Priv escalation | RBAC/ABAC + least priv + reviews | IAM |

## 13) Backups & DR
- RPO ≤ 15 min for OLTP; RTO ≤ 30 min for tier-1 services.
- DR runbook tested quarterly.
- Cold-storage 7 y for clinical, 25 y for pediatric records.

## 14) Secure SDLC
- Threat model per new feature; security review for high-risk PRs.
- Required: secrets scan, SAST, DAST, dep scan, container scan.
- Signed commits; protected branches; release tagging signed.

## 15) Compliance evidence repo
- `evidence/` directory under git LFS with: policies, training records, scan reports,
  pen-test reports, audit findings, CAPA. Indexed for CBAHI/JCI surveys.
