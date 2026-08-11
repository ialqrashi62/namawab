# {{DEPT_NAME_AR}} — Security Threat Model (STRIDE)
## NamaMedical Department

> **القسم:** `{{DEPT_SLUG}}`
> **التاريخ:** {{DATE}}
> **المالك:** {{OWNER}}
> **المراجِع:** Security Team
> **الإطار:** STRIDE + OWASP Top 10 + HIPAA + PDPL

---

## 1. الأصول (Assets)

| # | Asset | Criticality | Storage | Encryption |
|---|---|---|---|---|
| 1 | بيانات المرضى (PHI) | **Critical** | PostgreSQL | AES-256 at rest |
| 2 | نتائج التقييمات | **Critical** | PostgreSQL | AES-256 at rest |
| 3 | التقارير الطبية | High | S3 | AES-256 + TLS |
| 4 | بيانات المستخدم | High | PostgreSQL | bcrypt + AES-256 |
| 5 | tokens (JWT) | High | Redis | TLS in transit |
| 6 | LLM API keys | **Critical** | Vault / .env | secret manager |
| 7 | Audit log | **Critical** | PostgreSQL (hash-chained) | AES-256 |
| 8 | ملفات DICOM | High | S3 | AES-256 + TLS |
| 9 | فواتير ZATCA | **Critical** | PostgreSQL | AES-256 + signed |

---

## 2. الجهات الفاعلة (Actors)

| Actor | Trust Level | Authentication |
|---|---|---|
| Owner (مالك) | Absolute | MFA + hardware key |
| Admin | High | MFA + role |
| Doctor | High | MFA + role |
| Nurse | Medium | MFA + role |
| Receptionist | Medium | MFA + role |
| Patient | Low (own data only) | OTP/SSO |
| External API (NPHIES, ZATCA) | Medium | mTLS + API key |
| LLM provider (OpenAI, Anthropic) | Low | API key + IP allowlist |
| Attacker | None | N/A |

---

## 3. مصفوفة STRIDE

### 3.1 Spoofing (انتحال الشخصية)

| Threat | Scenario | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **S-1** JWT forgery | مهاجم يصدر JWT مزيف | Low | Critical | RS256 + short expiry + refresh rotation |
| **S-2** MFA bypass | تجاوز TOTP | Low | Critical | Rate limit + device fingerprint + WebAuthn |
| **S-3** Session hijacking | سرقة session cookie | Medium | High | Secure/HttpOnly/SameSite cookies + IP bind |
| **S-4** API key theft | تسرب API key لـ LLM provider | Medium | Critical | Vault + IP allowlist + short-lived + rotation |
| **S-5** Tenant impersonation | user من tenant A يدّعي tenant B | Low | Critical | X-Tenant-Id verified against JWT claim |

**Mitigations applied:**
- ✅ JWT RS256 with 15min access + 7d refresh
- ✅ TOTP MFA required for all clinical roles
- ✅ Sessions bound to IP + User-Agent
- ✅ Vault-issued API keys (auto-rotation 30d)
- ✅ X-Tenant-Id must match JWT claim (fail-closed)

---

### 3.2 Tampering (العبث)

| Threat | Scenario | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **T-1** SQL injection | إدخال SQL في حقل | Medium | Critical | Parameterized queries + ORM + WAF |
| **T-2** XSS (stored) | حقن script في حقل | Medium | High | CSP + DOMPurify + input validation |
| **T-3** XSS (reflected) | script في URL | Medium | High | CSP + escape output |
| **T-4** Path traversal | `../../../etc/passwd` | Low | High | Path validation + chroot |
| **T-5** Mass assignment | تحديث حقول حساسة | Medium | High | Zod schema + explicit allowlist |
| **T-6** Audit log tampering | تعديل audit log | Low | **Critical** | Hash-chained + WORM + external backup |
| **T-7** Migration tampering | تعديل migration script | Low | High | Signed migrations + git review |

**Mitigations applied:**
- ✅ All queries parameterized (no string concat)
- ✅ CSP `default-src 'self'; script-src 'self' 'nonce-...';`
- ✅ DOMPurify on all user HTML
- ✅ Zod schema validation on all input
- ✅ Audit log hash-chained (each row = hash of prev + current)
- ✅ Migrations signed with GPG

---

### 3.3 Repudiation (الإنكار)

| Threat | Scenario | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **R-1** "I didn't do that" | مستخدم ينكر إجراء | Medium | High | Audit log (immutable) + digital signature |
| **R-2** "Logs were deleted" | حذف logs بعد حادثة | Low | **Critical** | WORM + external backup + 7+ year retention |
| **R-3** "That wasn't me" | user يتنصل من توقيع إلكتروني | Medium | High | Digital signature on every write |

**Mitigations applied:**
- ✅ Every action logged with user_id + IP + timestamp + action + target
- ✅ Audit log hash-chained, WORM, 7+ year retention
- ✅ Critical actions require digital signature

---

### 3.4 Information Disclosure (كشف المعلومات)

| Threat | Scenario | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **I-1** PHI in logs | طباعة بيانات حساسة في logs | Medium | **Critical** | Redaction middleware + audit |
| **I-2** PHI in commits | `git log` يكشف بيانات | Low | **Critical** | Pre-commit hook + secret scan |
| **I-3** PHI in error messages | رسالة خطأ تكشف بيانات | Medium | High | Generic error messages + correlation ID |
| **I-4** LLM data leak | prompt يكشف PHI لـ LLM | Medium | **Critical** | PHI redaction before LLM + audit |
| **I-5** Backup leak | backup مكشوف | Low | **Critical** | Backup encrypted + S3 private + lifecycle |
| **I-6** Cross-tenant leak | قراءة بيانات tenant آخر | Low | **Critical** | RLS FORCE + middleware + tests |
| **I-7** IDOR | الوصول لـ record بـ ID | Medium | High | Authorization on every row |

**Mitigations applied:**
- ✅ Logger middleware redacts known PHI fields (name, national_id, phone, dob, mrn)
- ✅ Pre-commit hook blocks commits with PHI patterns
- ✅ All errors generic, only correlation_id returned to user
- ✅ LLM prompt builder redacts PHI before sending
- ✅ RLS FORCE on every table + policy + tests
- ✅ Authorization on every row (no "trust the ID")

---

### 3.5 Denial of Service (الحرمان من الخدمة)

| Threat | Scenario | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **D-1** API flood | ملايين الطلبات | Medium | High | Cloudflare + rate limit (per-IP, per-user) |
| **D-2** DB connection exhaustion | استنزاف pool | Low | High | Pool limits + circuit breaker |
| **D-3** LLM cost explosion | استخدام ضخم | Medium | High | Per-tenant budget cap + alerts |
| **D-4** Large file upload | ملف ضخم | Medium | Medium | Max size limit + streaming |
| **D-5** Slow query DoS | query بطيء | Low | Medium | Query timeout + index monitoring |

**Mitigations applied:**
- ✅ Cloudflare WAF + rate limit
- ✅ Per-tenant, per-user rate limit (Redis-backed)
- ✅ Per-tenant LLM budget cap with daily reset
- ✅ Max upload 50MB
- ✅ Query timeout 5s, p95 alert

---

### 3.6 Elevation of Privilege (الترقية)

| Threat | Scenario | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **E-1** RBAC bypass | تجاوز صلاحيات | Medium | **Critical** | RBAC on every endpoint + tests |
| **E-2** Admin token theft | سرقة admin token | Low | **Critical** | Short-lived + WebAuthn + step-up |
| **E-3** SQL injection → RCE | تصعيد عبر SQL | Low | **Critical** | Parameterized + no superuser + WAF |
| **E-4** SSRF | الوصول لـ internal services | Medium | High | URL allowlist + IMDSv2 |

**Mitigations applied:**
- ✅ Every route has rbacMiddleware + tests
- ✅ Admin actions require fresh MFA + hardware key
- ✅ DB user is NOT superuser
- ✅ SSRF allowlist for outbound HTTP

---

## 4. OWASP Top 10 (2021) — تغطية

| # | Risk | Coverage |
|---|---|---|
| A01 | Broken Access Control | ✅ RLS + RBAC + tests |
| A02 | Cryptographic Failures | ✅ TLS 1.3 + AES-256 + bcrypt |
| A03 | Injection | ✅ Parameterized + ORM + WAF |
| A04 | Insecure Design | ✅ STRIDE + threat model per dept |
| A05 | Security Misconfiguration | ✅ Hardened image + CIS benchmark |
| A06 | Vulnerable Components | ✅ Dependabot + npm audit + Snyk |
| A07 | Auth Failures | ✅ JWT + MFA + rate limit |
| A08 | Software & Data Integrity | ✅ Signed migrations + signed releases |
| A09 | Logging Failures | ✅ Structured logs + SIEM + alerts |
| A10 | SSRF | ✅ URL allowlist + IMDSv2 |

---

## 5. PDPL (Personal Data Protection Law - KSA)

| Requirement | Coverage |
|---|---|
| موافقة المستخدم | ✅ consent flow |
| الحق في الوصول | ✅ `GET /api/me/data-export` |
| الحق في النسيان | ✅ `POST /api/me/delete` (anonymizes) |
| نقل البيانات | ✅ Cross-border blocked by default |
| سجل المعالجة | ✅ `processing_log` table |
| DPO | ✅ appointed |

---

## 6. CBAHI

| Chapter | Status |
|---|---|
| 1. Leadership | ✅ |
| 2. Patient Safety | ✅ |
| 3. Quality Improvement | ✅ |
| 4. Information Management | ✅ |
| 5. Patient-Centered Care | ✅ |
| 6. Workforce | ✅ |

---

## 7. اختبار الاختراق (Penetration Test)

- **التكرار:** كل 3 أشهر + بعد أي تغيير كبير
- **النطاق:** كل API + كل UI + كل infrastructure
- **أداة داخلية:** OWASP ZAP + Burp + Nuclei
- **مورد خارجي:** HackerOne + bug bounty
- **التقرير:** [22_PENETRATION_TEST_AR.md](22_PENETRATION_TEST_AR.md)

---

## 8. خطة الاستجابة للحوادث (Incident Response)

1. **كشف:** SIEM alert → on-call paged (PagerDuty)
2. **احتواء:** Circuit breaker + revoke tokens
3. **تحقيق:** Audit log + forensics
4. **استرداد:** Restore from backup
5. **إبلاغ:** DPO + MoH (PDPL) + NPHIES
6. **مراجعة:** Postmortem + action items

---

## 9. الـ Acceptance Criteria

- [ ] جميع التهديدات الـ High/Critical لها mitigation
- [ ] اختبار اختراق فصلي ناجح
- [ ] لا توجد ثغرات High/Critical مفتوحة
- [ ] Audit log immutable
- [ ] RLS على كل الجداول
- [ ] MFA مفروض على كل clinical role
- [ ] لا PHI في logs (verified by automated test)
- [ ] لا secrets في الكود (verified by secret scan)
- [ ] Pre-commit hooks تعمل

---

## 10. مخاطر مقبولة (Accepted Risks)

| Risk | Why Accepted | Compensating Control |
|---|---|---|
| LLM provider data breach | لا يمكن تجنب | PHI redaction + NDA + cyber insurance |
| Zero-day in Node.js | لا يمكن تجنب | Auto-update + WAF + sandbox |
| Insider threat | سيبقى دائماً | Audit log + least privilege + background check |

---

> **Next:** [20_COMPLIANCE_MATRIX_TEMPLATE_AR.md](20_COMPLIANCE_MATRIX_TEMPLATE_AR.md) — تفصيل PDPL/NPHIES/CBAHI/ZATCA.
