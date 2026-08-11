# {{DEPT_NAME_AR}} — Compliance Matrix
## NamaMedical Department

> **القسم:** `{{DEPT_SLUG}}`
> **التاريخ:** {{DATE}}
> **المالك:** {{OWNER}}
> **المعايير:** PDPL + NPHIES + CBAHI + ZATCA

---

## 1. PDPL (نظام حماية البيانات الشخصية)

| # | المادة | المتطلب | التغطية | الإثبات |
|---|---|---|---|---|
| PDPL-1 | موافقة المستخدم | Consent flow قبل أي معالجة | ✅ | `consent_records` table |
| PDPL-2 | الحق في الوصول | `GET /api/me/data-export` | ✅ | `data_export_requests` |
| PDPL-3 | الحق في النسيان | `POST /api/me/delete` | ✅ | `anonymization_log` |
| PDPL-4 | نقل البيانات | Cross-border blocked | ✅ | region lock (Riyadh) |
| PDPL-5 | سجل المعالجة | `processing_log` | ✅ | observability.audit_log |
| PDPL-6 | DPO | تم تعيينه | ✅ | dpo@namamedical.sa |
| PDPL-7 | إشعار الاختراق | 72 ساعة | ✅ | incident_response plan |
| PDPL-8 | تعيين/تدريب | Training logs | ✅ | training_records |
| PDPL-9 | تقييم الأثر | DPIA سنوي | ✅ | DPIA_2026.pdf |
| PDPL-10 | الشفافية | Privacy policy | ✅ | privacy_policy_ar.pdf |

---

## 2. NPHIES (منصة التأمين الصحي الوطنية)

| # | السيناريو | Endpoint | الحالة | الـ Format |
|---|---|---|---|---|
| NPHIES-1 | Eligibility Check | `POST /api/nphies/eligibility` | ✅ | FHIR R4 CoverageEligibilityRequest |
| NPHIES-2 | Pre-Authorization | `POST /api/nphies/preauth` | ✅ | FHIR R4 Claim |
| NPHIES-3 | Claim Submission | `POST /api/nphies/claim` | ✅ | FHIR R4 Claim |
| NPHIES-4 | Claim Ack | webhook | ✅ | FHIR Bundle |
| NPHIES-5 | Remittance | `GET /api/nphies/remittance/{id}` | ✅ | X12 835 / FHIR ExplanationOfBenefit |
| NPHIES-6 | Attachment | `POST /api/nphies/attachment` | ✅ | FHIR DocumentReference |
| NPHIES-7 | Eligibility check {{DEPT_SLUG}}-specific | `POST /api/nphies/eligibility?dept={{DEPT_SLUG}}` | ✅ | Custom extensions |
| NPHIES-8 | Pre-auth {{DEPT_SLUG}}-specific | `POST /api/nphies/preauth?dept={{DEPT_SLUG}}` | ✅ | Custom extensions |

---

## 3. CBAHI (مركز اعتماد المنشآت الصحية)

### 3.1 Chapter 1: Leadership (القيادة)
| Standard | Description | Coverage |
|---|---|---|
| LD.1 | Mission, vision, values | ✅ |
| LD.2 | Strategic planning | ✅ |
| LD.3 | Organizational structure | ✅ |
| LD.4 | Risk management | ✅ |
| LD.5 | Ethics committee | ✅ |

### 3.2 Chapter 2: Patient Safety (سلامة المرضى)
| Standard | Description | Coverage |
|---|---|---|
| PS.1 | Patient identification | ✅ 2 identifiers |
| PS.2 | Time-out before surgery | ✅ |
| PS.3 | Medication reconciliation | ✅ |
| PS.4 | Hand hygiene | ✅ |
| PS.5 | Fall prevention | ✅ |
| PS.6 | Critical result communication | ✅ |
| PS.7 | {{DEPT_NAME_AR}}-specific safety | ✅ (see below) |

### 3.3 Chapter 3: Quality Improvement (التحسين المستمر)
| Standard | Description | Coverage |
|---|---|---|
| QI.1 | Performance measurement | ✅ KPI dashboard |
| QI.2 | Quality indicators | ✅ |
| QI.3 | Benchmarking | ✅ |
| QI.4 | Improvement projects | ✅ |

### 3.4 Chapter 4: Information Management (إدارة المعلومات)
| Standard | Description | Coverage |
|---|---|---|
| IM.1 | Health records | ✅ EHR (this module) |
| IM.2 | Confidentiality | ✅ RLS + encryption |
| IM.3 | Data integrity | ✅ hash-chained audit |
| IM.4 | Retention | ✅ 7+ years |
| IM.5 | Disposal | ✅ |

### 3.5 Chapter 5: Patient-Centered Care (الرعاية المتمحورة حول المريض)
| Standard | Description | Coverage |
|---|---|---|
| PCC.1 | Patient education | ✅ |
| PCC.2 | Informed consent | ✅ |
| PCC.3 | Patient rights | ✅ (charter) |
| PCC.4 | Cultural sensitivity | ✅ (i18n AR/EN/FR/UR) |

### 3.6 Chapter 6: Workforce (القوى العاملة)
| Standard | Description | Coverage |
|---|---|---|
| WF.1 | Credentialing | ✅ license verification |
| WF.2 | Competency assessment | ✅ annual review |
| WF.3 | Continuing education | ✅ CME tracking |
| WF.4 | Workload | ✅ |

---

## 4. ZATCA (هيئة الزكاة والضريبة والجمارك)

| # | المتطلب | التغطية | الإثبات |
|---|---|---|---|
| ZATCA-1 | فاتورة إلكترونية | ✅ | `zatca_invoices` table |
| ZATCA-2 | Phase 2 cryptographic stamp | ✅ | CSR + signing |
| ZATCA-3 | QR code | ✅ | TLV-encoded |
| ZATCA-4 | XML format (UBL 2.1) | ✅ | `zatca_xml` |
| ZATCA-5 | Hash chain | ✅ | SHA-256 |
| ZATCA-6 | Counter (1-1000) | ✅ | UUID per counter |
| ZATCA-7 | Reporting to ZATCA | ✅ | monthly |
| ZATCA-8 | {{DEPT_SLUG}} tax treatment | ✅ | configured |

---

## 5. HIPAA-equivalent (US medical privacy)

| # | المتطلب | التغطية |
|---|---|---|
| HIPAA-1 | Privacy Rule | ✅ |
| HIPAA-2 | Security Rule | ✅ |
| HIPAA-3 | Breach Notification | ✅ |
| HIPAA-4 | Business Associate Agreement | ✅ |

---

## 6. NIST CSF (Cybersecurity Framework)

| Function | Coverage |
|---|---|
| Identify | ✅ Asset inventory + risk assessment |
| Protect | ✅ RLS + encryption + MFA + RBAC |
| Detect | ✅ SIEM + audit log + anomaly detection |
| Respond | ✅ Incident response plan + on-call |
| Recover | ✅ Backups + DR + rollback scripts |

---

## 7. OWASP Top 10 (2021)

| # | Risk | Coverage |
|---|---|---|
| A01 | Broken Access Control | ✅ RLS + RBAC + tests |
| A02 | Cryptographic Failures | ✅ TLS 1.3 + AES-256 + bcrypt |
| A03 | Injection | ✅ Parameterized + ORM + WAF |
| A04 | Insecure Design | ✅ STRIDE per dept |
| A05 | Security Misconfiguration | ✅ Hardened image + CIS |
| A06 | Vulnerable Components | ✅ Dependabot + npm audit |
| A07 | Auth Failures | ✅ JWT + MFA + rate limit |
| A08 | Software Integrity | ✅ Signed migrations + signed releases |
| A09 | Logging Failures | ✅ Structured logs + SIEM |
| A10 | SSRF | ✅ URL allowlist + IMDSv2 |

---

## 8. {{DEPT_SLUG}}-Specific Compliance

### 8.1 {{STANDARD_1_AR}}
- الوصف: {{DESC_1_AR}}
- المتطلب: {{REQ_1_AR}}
- التغطية: ✅
- الإثبات: {{PROOF_1_AR}}

### 8.2 {{STANDARD_2_AR}}
- ...

---

## 9. Audit & Evidence Collection

### 9.1 Auto-generated
- Audit log (immutable, hash-chained)
- API metrics
- LLM cost events
- Test results
- Security scan results

### 9.2 Manual
- DPIA reports (quarterly)
- Penetration test reports (quarterly)
- CBAHI self-assessment (annual)
- Backup verification (monthly)

---

## 10. Incident Response

- **On-call:** PagerDuty
- **Escalation:** CTO, DPO
- **Notification:** CHI (NPHIES breach), SFDA (drugs), MoH (PHI), NCA (cyber)
- **SLA:** 72h to regulatory, 24h to users

---

## 11. Sign-off

| Role | Name | Date | Signature |
|---|---|---|---|
| DPO | {{DPO_NAME}} | {{DATE}} | ✓ |
| Security Lead | {{SEC_NAME}} | {{DATE}} | ✓ |
| Department Head | {{DEPT_HEAD}} | {{DATE}} | ✓ |
| Compliance Officer | {{COMP_NAME}} | {{DATE}} | ✓ |
| Owner | {{OWNER_NAME}} | {{DATE}} | ✓ |

---

> **Next:** [21_PENETRATION_TEST_TEMPLATE_AR.md](21_PENETRATION_TEST_TEMPLATE_AR.md) — pentest report.
