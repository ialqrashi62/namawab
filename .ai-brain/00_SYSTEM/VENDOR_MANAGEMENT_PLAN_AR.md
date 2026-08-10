# خطة إدارة الموردين (Vendor Management) — NamaMedical
**التاريخ:** 2026-08-10 · **الإصدار:** v3.0

---

## 1. نظرة عامة

تدير هذه الوثيقة العلاقة مع **جميع الموردين الخارجيين** لـ NamaMedical، من اختيارهم حتى إنهاء العلاقة.

**المالك:** Procurement + Security + Legal
**المراجعة:** سنوياً

---

## 2. أنواع الموردين

| النوع | الأمثلة | المخاطر |
|---|---|---|
| **Cloud Infrastructure** | Hetzner, AWS, GCP | عالي |
| **LLM Providers** | OpenAI, Anthropic, Cohere | عالي |
| **Vector DB** | Pinecone, Weaviate, pgvector | متوسط |
| **Integration** | Mirth, HAPI FHIR, Orthanc | عالي (PHI) |
| **Payments** | Stripe, Hyperpay, Moyasar | عالي (PCI) |
| **Insurance** | NPHIES (SFDA) | عالي (PHI) |
| **Government** | ZATCA, Nafath, Absher | عالي |
| **Email/SMS** | SendGrid, Twilio | منخفض |
| **Monitoring** | Datadog, Grafana Cloud | متوسط |
| **Backup** | AWS S3, Hetzner Storage Box | عالي |
| **Consulting** | pen-test firms, lawyers | منخفض |
| **HR / Payroll** | Mudad, Qiwa | متوسط (PII) |

---

## 3. دورة حياة المورد

```
1. Need identification
2. Vendor research + shortlist
3. RFP (Request for Proposal)
4. Evaluation matrix
5. POC (Proof of Concept) [if applicable]
6. Security review (mandatory for high-risk)
7. Legal review (DPA, MSA)
8. Approval (CAB or Board)
9. Contract signature
10. Onboarding + integration
11. Quarterly review
12. Annual review
13. Renewal or termination
```

---

## 4. Security Review (مُلزَم للموردين عاليي المخاطر)

### 4.1 ما يُراجع

| المجال | السؤال |
|---|---|
| **Certifications** | ISO 27001, SOC 2, HIPAA, HITRUST |
| **Encryption** | At-rest + in-transit |
| **Access control** | RBAC, MFA, audit log |
| **Data residency** | أين تُخزّن البيانات؟ |
| **Sub-processors** | من يصل للبيانات؟ |
| **Breach notification** | SLA للإبلاغ عن اختراق |
| **Audit rights** | يحق لنا تدقيقهم؟ |
| **Insurance** | Cyber insurance policy |
| **BCP/DR** | RTO + RPO |
| **Compliance** | GDPR, PDPL, HIPAA, NPHIES |

### 4.2 ناتج المراجعة

- **Pass:** يمكن المتابعة
- **Conditional:** مع خطة mitigations
- **Fail:** ممنوع (استخدم بديل)

### 4.3 الشهادات المقبولة

- ✅ ISO 27001 (ساري)
- ✅ SOC 2 Type II (خلال 12 شهر)
- ✅ HIPAA BAA (للـPHI vendors)
- ⚠️ SOC 2 Type I (مقبول مؤقتاً)
- ❌ بدون شهادة (للـhigh-risk ممنوع)

---

## 5. DPA (Data Processing Agreement)

### البنود الإلزامية

1. **Purpose limitation:** فقط للأغراض المحددة
2. **Data minimization:** لا يحتفظ بأكثر مما يلزم
3. **Sub-processor approval:** لا يستخدم sub-processors بدون موافقة
4. **Security measures:** نفس مستوى حمايتنا
5. **Breach notification:** خلال 24 ساعة
6. **Audit rights:** يحق لنا التدقيق سنوياً
7. **Data return + deletion:** عند إنهاء العقد
8. **Cross-border transfer:** فقط لدول adequate
9. **Liability + indemnity:** واضحة
10. **Governing law:** KSA

---

## 6. LLM Providers (خاصة)

### 6.1 قائمة الموردين النشطين

| المورد | النموذج | الاستخدام | البيانات |
|---|---|---|---|
| OpenAI | gpt-4o, gpt-4o-mini | RAG, summary | لا PHI |
| Anthropic | claude-3.5-sonnet | Reasoning, planning | لا PHI |
| Cohere | embed-english-v3 | Embeddings | لا PHI |
| Local (Llama 3.1 8B) | llama-3.1-8b | PHI-safe tasks | PHI ممكن |

### 6.2 قواعد PHI

- **لا** ترسل PHI لـ OpenAI / Anthropic / Cohere / أي cloud LLM
- **Yes** استخدم local Llama للمهام التي تحتاج PHI
- أو: anonymize + de-identify قبل الإرسال
- أو: opt-out من training (OpenAI: zero-retention)

### 6.3 Cost controls

- Per-tenant monthly cap
- Per-orchestrator monthly cap
- Fallback to local when exceeded
- Auto-downgrade to gpt-4o-mini

---

## 7. PHI Vendors (خاصة)

### قائمة PHI Vendors (تحتاج DPA + HIPAA BAA)

- NPHIES gateway
- HAPI FHIR sandbox (dev only)
- Mirth Connect (dev only)
- Orthanc PACS (dev only)
- AWS S3 (لـPHI blobs)
- Azure Blob (alternative)

### قواعد

- Data residency: KSA فقط
- Encryption: AES-256 at-rest, TLS 1.3 in-transit
- Access: MFA + IP allowlist
- Audit log: كل وصول
- Breach notification: 24h SLA

---

## 8. Scorecard (ربع سنوي)

| البُعد | الوزن | مثال |
|---|---|---|
| Service quality | 30% | uptime, latency |
| Security | 25% | incidents, audits |
| Cost | 20% | $/month trend |
| Support | 15% | response time, SLA |
| Innovation | 10% | new features |

**المجموع:** < 70% → استبدال، 70-85% → تحسين، > 85% → تجديد

---

## 9. Termination Process

### عند إنهاء العقد

1. **60 days notice:** أرسل إخطار كتابي
2. **Data return:** استلم كل البيانات بصيغة قياسية
3. **Data deletion:** تأكيد خطي بالحذف
4. **Credential rotation:** غيّر كل الـAPI keys
5. **Migration:** انقل لـ vendor جديد
6. **Final audit:** تأكد من الحذف

### Offboarding checklist

- [ ] Notice sent
- [ ] Data exported
- [ ] Data deleted (with attestation)
- [ ] API keys rotated
- [ ] Sub-processors notified
- [ ] Final invoice paid
- [ ] Vendor removed from approved list

---

## 10. Vendor Risk Matrix

| المورد | المخاطر | DPA | مراجعة أمنية | Scorecard | الحالة |
|---|---|---|---|---|---|
| Hetzner | عالي | ✅ | ✅ | 88% | ✅ |
| OpenAI | عالي (LLM) | ✅ | ✅ | 90% | ✅ |
| pgvector (محلي) | منخفض | N/A | ✅ | 95% | ✅ |
| NPHIES | عالي جداً | ✅ | ✅ | 92% | ✅ |
| ZATCA | حكومي | ✅ | N/A | N/A | ✅ |
| SendGrid | منخفض | ✅ | ⚠️ | 80% | ✅ |
| Twilio | منخفض | ✅ | ⚠️ | 78% | ✅ |
| Datadog | متوسط | ✅ | ✅ | 85% | ✅ |

---

## 11. Conflict of Interest

- لا يحق لموظفينا أن يكونوا موظفين أو مستشارين عند مورد
- الإفصاح إلزامي
- Rotation كل سنتين في vendor management
- Vendor darf لا يدفع kickbacks

---

## 12. Tools

- **Vendor list:** `.ai-brain/vendors/registry.yaml`
- **Contracts:** encrypted in vendor portal
- **Scorecard:** Excel + Jira
- **Renewal reminders:** calendar + Slack
- **Risk register:** Jira + risk matrix
