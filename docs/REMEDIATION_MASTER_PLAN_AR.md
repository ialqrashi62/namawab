# خطة الإصلاح الشاملة — NamaMedical (Remediation Master Plan)

> **المرجعية العالمية:** OWASP ASVS v4 / Top-10، HL7 v2 / FHIR R4، IHE، ZATCA (Fatoorah Phase-2)،
> NPHIES، HIPAA Security Rule، NIST 800-53. كل مقارنة بأنظمة HIS/EMR عالمية مبنية على **best practices**
> منشورة، وليست توثيقاً رسمياً لمنتج بعينه.
> **تاريخ:** 2026-06-30 — الحالة الأساس: GLOBAL_READINESS = 70/100.
> **تحديث تنفيذي:** 2026-08-09 — بدء تنفيذ Remediation v2 (Wave A) على فرع معزول مع دمج حزمة امتثال ZATCA/NPHIES/CBAHI وإضافة بوابة CI امتثال.

## مبادئ التنفيذ (Safety Rails)
1. **المسار الأخضر** (كود قابل للتراجع، بلا DDL/نشر): يُنفَّذ تلقائياً (autopilot) + verify + commit محلي.
2. **المسار الكهرماني** (DDL / تغيير سلوك حسّاس): يُجهَّز كحزمة جاهزة + يتطلب **موافقة المالك** قبل التنفيذ.
3. **المسار الأحمر** (push / deploy / تكاملات حكومية حيّة): محظور حتى يحسم المالك (تسرّب remote + runbook نشر).
4. لا force push. لا تنفيذ DDL على الإنتاج. تشغيل الاختبارات في DB معزولة فقط.

---

## ✅ المنجز هذه الجولة (Green-Lane — مثبَّت محلياً، بلا push)
| البند | الإصلاح | التحقّق | المرجع |
|---|---|---|---|
| تبعيات ضعيفة (HIGH) | `npm audit fix` → **0 ثغرات** (كانت 5) | `npm audit`=0، load OK | ASVS V14 |
| `add_admin.sql` | حُذف (بذرة كلمة مرور نصية) | git rm | ASVS V2 |
| `database.db` | أُلغي تتبّعه | git rm --cached | — |
| الجلسة | `resave:true→false` | node --check OK | OWASP Session Mgmt |
| Rate-limit عام | middleware env-gated (default OFF) | syntax OK | ASVS V11 |
| المال REAL→NUMERIC | مسوّدات migration e22_01 (up/down/validate) — **غير منفّذة** | — | — |

**Commits:** root `de67d9d` · namaweb `61d2dce` (محلي فقط).

---

## 🟠 PHASE 1 — حرج (P0/P1) — يتطلب موافقة/بيئة
### 1.1 XSS / CSP (GATE8-1, HIGH) — أعلى أولوية
- **المعيار العالمي:** CSP مفروض بلا `unsafe-inline`، هروب مركزي لكل sink (DOMPurify/escapeHTML).
- **الفجوة:** 255 `innerHTML` + CSP Report-Only + escapeHTML في 3 ملفات فقط.
- **الخطة:** (1) helper هروب مركزي محمَّل في كل صفحة؛ (2) sweep على كل sink خطر (مخرجات وكيل الرسم الجاري)؛ (3) إزالة inline handlers تدريجياً؛ (4) تفعيل `CSP_ENFORCE=true` على staging ومراقبة `/api/csp-report`؛ (5) فرض إنتاجي.
- **القبول:** 0 sink غير مهروب على بيانات المستخدم/PHI + CSP enforce بلا كسر وظيفي.
- **المخاطر:** كسر SPA (inline). **مُقيَّد بـstaging أولاً.**

### 1.2 Validation مركزي (GATE3-H1, HIGH)
- **المعيار:** schema validation عند الحدود (Zod/Joi) لكل مدخل.
- **الخطة:** إدخال Zod تدريجياً — المالي/الطبي أولاً (invoices, payments, claims, CPOE, prescriptions)، ثم البقية. middleware `validate(schema)`.
- **القبول:** كل مسار مالي/طبي يرفض المدخل غير الصالح بـ400 موحّد.

### 1.3 Idempotency مالي (GATE10-M1, HIGH/MED)
- **المعيار:** `Idempotency-Key` على عمليات الدفع/الفوترة/القيد (Stripe-style).
- **الخطة:** جدول `idempotency_keys(tenant_id, key, response, created_at)` + middleware؛ المسارات المالية تتطلب المفتاح.
- **القبول:** إعادة إرسال نفس الطلب → نفس النتيجة، لا قيد مزدوج.

### 1.4 المال NUMERIC (GATE4-M1) — DDL جاهز
- نفّذ `e22_01` (مسوّدة جاهزة) على staging→prod بموافقة المالك + شغّل `_validate` (=0).

### 1.5 توحيد مصدر المخطط (GATE4-H1, HIGH)
- **الخطة:** اجعل `migrations/` المصدر الوحيد؛ ولّد مخطط dev/test منه؛ جرّد `initDatabase()` من تعريف الجداول (أو اجعله يشغّل migrations).

---

## 🟡 PHASE 2 — مهم (P2)
- **تقسيم monolith** (GATE2-H1): استخراج routers حسب الوحدة بعد تثبيت تغطية الاختبار (high-risk، تدريجي).
- **توحيد RBAC** (GATE6-M1): DB matrix كمصدر وحيد، أو توليد legacy منه.
- **OpenAPI + مظروف استجابة موحّد** (GATE9-M1).
- **Audit middleware شامل** (GATE3-M1): تدوين تلقائي لكل وصول/تعديل PHI (HIPAA §164.312(b)).
- **Pagination شامل** (GATE13-M1) + إكمال فهرسة tenant_id (59/147).
- **User-enumeration/timing** (GATE5-M1): توحيد ردود الدخول + dummy bcrypt.
- **تشفير أسرار التكامل at-rest** (integration_settings.api_secret عبر crypto_envelope).

---

## 🔵 PHASE 3 — تشغيل بيني عالمي (P4) — مشاريع
- **ZATCA Phase-2 حيّ:** توصيل الإرسال للهيئة (clearance/reporting) + تخزين الاستجابة + إعادة المحاولة.
- **NPHIES حيّ:** قنوات الإرسال الفعلية لدورة المطالبات.
- **FHIR R4 / HL7 v2:** واجهات تبادل (Patient, Encounter, Observation, MedicationRequest) — تكامل مختبرات/أنظمة وطنية.
- **PACS/DICOM:** ربط الأشعة بنظام صور حقيقي.

---

## ⚙️ PHASE 4 — تشغيل وجودة
- CI/CD: `npm audit` + `node --check` + تشغيل 116 اختباراً في **DB معزولة** عند كل PR.
- اختبار restore فعلي + تشفير النسخ + offsite/retention (GATE16-M1).
- مراقبة/تنبيهات + error tracking.

---

## PHASE 5 — UAT
- تشغيل المجموعة الكاملة + قبول المالك لكل وحدة + توقيع.

---

## حُزم تنتظر موافقتك الآن
1. **تنفيذ `npm audit fix` push** إلى الفرع (بعد حسم استراتيجية remote).
2. **تنفيذ migration e22_01** على staging.
3. **بدء PHASE 1.1 (XSS)** فعلياً بعد تقرير وكيل الرسم.
4. **بدء PHASE 1.2 (Validation)** على المسارات المالية.
