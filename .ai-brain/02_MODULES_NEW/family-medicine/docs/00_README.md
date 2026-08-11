# طب الأسرة — Family Medicine
## NamaMedical Department

> **القسم:** `family-medicine`
> **الإصدار:** 1.0
> **التاريخ:** 2026-08-11
> **المالك:** engineering@namamedical.sa

---

## 1. نظرة عامة

قسم **طب الأسرة** هو خط الدفاع الأول في الرعاية الصحية. يقدم:
- **الرعاية الأولية** لجميع الفئات العمرية (من الرضّع إلى المسنين)
- **الطب الوقائي** (فحوصات دورية، لقاحات، تثقيف صحي)
- **إدارة الأمراض المزمنة** (سكري، ضغط، ربو، قلب)
- **التنسيق** بين الاختصاصات والإحالات
- **الفحوصات الشاملة السنوية**

**المستخدمون الأساسيون:** أطباء الأسرة، الممرضون، المرشدون الصحيون
**حجم العمليات:** ~80 مريض/يوم للطبيب الواحد
**زمن الاستجابة المستهدف:** p95 ≤ 200ms

---

## 2. القدرات (Capabilities)

| # | القدرة | المحرك | الـ Endpoint |
|---|---|---|---|
| 1 | تقييم خطورة ASCVD (10 سنوات) | `ascvdRisk()` | `POST /assessments/ascvd` |
| 2 | تقييم خطر السكري (FINDRISC) | `diabetesRisk()` | `POST /assessments/diabetes` |
| 3 | تقييم الإقلاع عن التدخين (5As) | `smokingCessation()` | `POST /assessments/smoking-cessation` |
| 4 | الفحوصات السنوية | `wellnessScreenings()` | `POST /assessments/wellness` |
| 5 | AI Co-pilot | `co-pilot` | `POST /ai/chat` |
| 6 | قائمة المرضى | service | `GET /patients` |

---

## 3. الـ KPIs

| KPI | الهدف | القياس |
|---|---|---|
| متوسط وقت الانتظار | < 15 min | queue analytics |
| نسبة التحويلات | < 8% | referral tracking |
| نسبة الفحوصات الشاملة السنوية | > 70% | screening rate |
| نسبة المرضى المسيطر عليهم (HBA1C < 7) | > 60% | diabetes dashboard |
| نسبة المرضى المسيطر عليهم (BP < 140/90) | > 65% | hypertension dashboard |
| رضا المرضى | > 4.5/5 | patient survey |
| تكلفة/مريض | < 800 SAR | cost dashboard |

---

## 4. المعمارية

```
┌────────────────────────────────────────────────┐
│  Browser / PWA (clinician, mobile)             │
└────────────┬───────────────────────────────────┘
             │ HTTPS
┌────────────▼───────────────────────────────────┐
│  Express Router: /api/family-medicine/*        │
│  ├─ auth (JWT + MFA)                           │
│  ├─ tenant (X-Tenant-Id)                       │
│  ├─ rbac (read/write/admin)                    │
│  ├─ audit (hash-chained)                       │
│  └─ validate (zod)                             │
└────────────┬───────────────────────────────────┘
             │
┌────────────▼───────────────────────────────────┐
│  Service Layer (DB-bound, tenant-aware)        │
└────────────┬───────────────────────────────────┘
             │
┌────────────▼───────────────────────────────────┐
│  Engine (pure functions, no DB)                │
│  ├─ ascvdRisk                                  │
│  ├─ diabetesRisk                               │
│  ├─ smokingCessation                           │
│  └─ wellnessScreenings                         │
└────────────────────────────────────────────────┘
```

---

## 5. الجداول (Database)

- `family_medicine_assessments` — كل التقييمات
- `family_medicine_patient_summaries` — ملخص دوري
- `family_medicine_referrals` — التحويلات
- `family_medicine_screenings_done` — الفحوصات المكتملة
- `family_medicine_care_plans` — خطط الرعاية

**كل الجداول فيها:**
- ✅ `tenant_id` (RLS)
- ✅ `FORCE ROW LEVEL SECURITY`
- ✅ Audit triggers

---

## 6. الـ i18n (4 لغات)

- **AR** (Arabic) — primary, RTL
- **EN** (English) — international
- **FR** (French) — Maghreb region
- **UR** (Urdu) — South Asia

5,000+ keys موجودة في `.ai-brain/00_SYSTEM/28_I18N_KEYS_TEMPLATE.json` كنموذج.

---

## 7. الـ Compliance

- **PDPL:** موافقة، حق النسيان، DPO
- **CBAHI:** 6 chapters (انظر [20_COMPLIANCE_MATRIX](20_COMPLIANCE_MATRIX_TEMPLATE_AR.md))
- **NPHIES:** eligibility, pre-auth, claim
- **ZATCA:** فواتير الخدمات
- **HIPAA-equivalent:** privacy, security, audit

---

## 8. الـ Roadmap

| Wave | الحالة |
|---|---|
| W06 | 🚧 جاري (هذا القسم) |
| W07 | (التالي) dental, ophthalmology, ENT |
| W08 | urology, plastic, vascular |
| W09 | thoracic, neurosurg, trauma |
| W10-W14 | باقي الأقسام |

---

## 9. Acceptance Gates

- [x] **G1:** Unit tests (5 ASCVD + 4 diabetes + 3 smoking + 3 wellness)
- [x] **G2:** Security (no PHI, no secrets)
- [x] **G3:** RLS (FORCE + policy)
- [x] **G4:** i18n (4 locales)
- [x] **G5:** RBAC (full middleware chain)
- [ ] **G6:** Deploy (pending)

---

> **Next:** [01_ARCHITECTURE_AR.md](01_ARCHITECTURE_AR.md) — مخطط معماري تفصيلي.
