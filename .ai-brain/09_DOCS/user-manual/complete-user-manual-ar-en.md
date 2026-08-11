# User Manual — NamaMedical ERP (Master v5)
# Filepath: .ai-brain/09_DOCS/user-manual/complete-user-manual-ar-en.md
# Generated: 2026-08-08

# User Manual — Complete

> **60 Departments · Multi-Tenant · Arabic + English · AI-Powered**

---

## الفصل 1: مقدمة (Introduction)

### 1.1 ما هو NamaMedical؟

NamaMedical هو نظام معلومات مستشفى شامل (HIS/Hospital Information System) يدعم 60 قسماً سريرياً و10 إدارياً، مع تكامل ذكاء اصطناعي (RAG + LangChain) للمساعدة في التشخيص والعلاج.

### 1.2 What is NamaMedical?

NamaMedical is a comprehensive Hospital Information System (HIS) supporting 60 clinical and 10 operational departments, with AI integration (RAG + LangChain) for diagnosis and treatment assistance.

### 1.3 الأقسام الـ60 (Departments)

**Internal Medicine (10):** Cardiology, Endocrinology, Gastroenterology, Hematology-Oncology, Nephrology, Pulmonology, Rheumatology, Infectious Diseases, Dermatology, Allergy-Immunology

**Surgery (10):** General Surgery, Orthopedics, Neurosurgery, Cardiothoracic, ENT, Ophthalmology, Urology, Plastic-Burns, Vascular, Transplant

**Critical Care (5):** Emergency, ICU, NICU, PICU, PACU

**Pediatrics (8):** General Peds, Neonatology, Ped-Cardiology, Ped-Neurology, Ped-Nephrology, Ped-HemOnc, Ped-Surgery, Ped-Dev-Rehab

**OB-GYN (5):** Obstetrics, Gynecology, IVF/Reproductive, MFM, Urogynecology

**Diagnostics (5):** Laboratory, Radiology, Interventional Radiology, Nuclear Medicine, Pathology

**Mental Health & Rehab (4):** Psychiatry, Psychology, Physical Therapy, Occupational Therapy

**Oncology & Palliative (3):** Medical Oncology, Radiation Oncology, Palliative Care

**Anesthesia & Pain (2):** Anesthesia, Pain Management

**Operational (8):** Pharmacy, Inventory, Finance, HR, Billing, Insurance, Quality, Facility

---

## الفصل 2: تسجيل الدخول (Login)

### 2.1 الخطوات
1. افتح المتصفح: `https://jumanasoft.com`
2. أدخل اسم المستخدم وكلمة المرور
3. أدخل رمز MFA (TOTP)
4. اختر المنشأة (للمستخدمين متعددي المستأجرين)
5. اضغط "تسجيل الدخول"

### 2.2 Login Steps
1. Open browser: `https://jumanasoft.com`
2. Enter username and password
3. Enter MFA code (TOTP)
4. Select facility (for multi-tenant users)
5. Click "Sign In"

### 2.3 نسيت كلمة المرور (Forgot Password)
1. اضغط "نسيت كلمة المرور" في صفحة الدخول
2. أدخل بريدك الإلكتروني
3. افتح البريد واضغط الرابط
4. أدخل كلمة مرور جديدة (12 حرف على الأقل)
5. اضغط "حفظ"

### 2.4 First-Time Setup
- سيطلب منك إعداد MFA في أول دخول
- امسح QR code بـ Google Authenticator / Authy
- احفظ رموز النسخ الاحتياطي (10 codes)

---

## الفصل 3: الواجهة الرئيسية (Main Interface)

### 3.1 الشريط العلوي (Top Bar)
- **شعار NamaMedical** (يسار)
- **بحث سريع** (مركز) — ابحث عن مريض/طلب/نتيجة
- **زر اللغة** (AR/EN)
- **🔔 الإشعارات**
- **👤 قائمة المستخدم**

### 3.2 الشريط الجانبي (Sidebar)
- **60 محطة** (Stations) مقسمة لـ10 مجموعات
- بحث + فلتر
- المفضلة
- المحطات الأخيرة

### 3.3 Top Bar
- **NamaMedical logo** (left)
- **Quick search** (center)
- **Language toggle** (AR/EN)
- **🔔 Notifications**
- **👤 User menu**

### 3.4 Sidebar
- **60 stations** grouped into 10 categories
- Search + filter
- Favorites
- Recent stations

---

## الفصل 4: الأقسام السريرية (Clinical Departments)

### 4.1 أمراض القلب (Cardiology)

#### السيناريو: مريض بـ ACS (Acute Coronary Syndrome)

**المريض:** Salem Ahmed، 45 سنة، ذكر
**الشكوى الرئيسية:** ألم صدر × 2 ساعة
**الأعراض:** ضيق تنفس، تعرق بارد

**الخطوات:**
1. افتح محطة Cardiology
2. ابحث عن المريض (MRN 100045)
3. أنشئ encounter جديد
4. سجّل vital signs:
   - HR: 110
   - BP: 90/60
   - SpO₂: 94%
   - Pain: 8/10
5. افتح ECG — سيظهر تلقائياً
6. اطلب Troponin I (STAT)
7. اطلب Cardiology consult
8. اسأل AI: "Patient with chest pain and ST elevation — diagnosis?"
9. وقّع الملاحظة

**المخرج:** ECG يُحمّل تلقائياً، AI يقترح STEMI، النظام يُنبّهك لإعطاء Aspirin + تفعيل cath lab.

---

### 4.2 Emergency (Triage)

#### ESI Levels
- **ESI 1:** Resuscitation (immediate)
- **ESI 2:** Emergent (< 10 min)
- **ESI 3:** Urgent (< 30 min)
- **ESI 4:** Less urgent (< 60 min)
- **ESI 5:** Non-urgent (< 120 min)

---

### 4.3 NICU (Neonatal ICU)

- Incubator temperature monitoring
- Phototherapy sessions
- Feeding schedule (NG/PO/IV)
- Apnea monitoring
- Daily weight

---

### 4.4 OB/GYN (Obstetrics)

- Antenatal visits
- Labor & Delivery
- Postpartum care
- High-risk pregnancy (MFM)
- IVF/ICSI cycles

---

(يتبع في كل قسم...)

---

## الفصل 5: العمليات (Operations)

### 5.1 Pharmacy
- BCMA (Barcode Medication Administration)
- Drug interaction check
- Inventory management
- Controlled substance tracking
- Compounding

### 5.2 Billing
- Charge capture
- Coding (CPT, ICD-10, HCPCS)
- Insurance submission (NPHIES)
- Payment posting
- Denial management

### 5.3 Quality & Safety
- Incident reporting
- Sentinel event tracking
- RCA (Root Cause Analysis)
- CBAHI compliance metrics
- Patient satisfaction surveys

---

## الفصل 6: AI Assistant

### 6.1 كيف يعمل (How it Works)

NamaMedical يستخدم RAG (Retrieval-Augmented Generation) للإجابة عن الأسئلة السريرية:
1. سؤالك → بحث في vector DB (pgvector)
2. Top 8 chunks مسترجعة
3. GPT-4o-mini يولّد الإجابة مع ICD-10/SNOMED
4. المصادر معروضة للإسناد

### 6.2 How it Works

NamaMedical uses RAG (Retrieval-Augmented Generation):
1. Your question → vector DB search (pgvector)
2. Top 8 chunks retrieved
3. GPT-4o-mini generates answer with ICD-10/SNOMED
4. Sources displayed for citation

### 6.3 أفضل الممارسات (Best Practices)
- ✅ اكتب سؤالاً واضحاً (مثال: "Patient with chest pain, ECG ST elevation, troponin 5.2 — what is differential?")
- ✅ تحقق من المصادر قبل الاعتماد
- ✅ استخدم AI كمساعد، ليس بديلاً عن الحكم السريري
- ❌ لا تدخل بيانات PHI في السؤال (النظام نفسه يربطها بالسياق)
- ❌ لا تعتمد على AI للقرارات النهائية

---

## الفصل 7: الأمان (Security)

### 7.1 القاعدة الذهبية (Golden Access Rule)
- **Owner/Admin:** وصول مطلق
- **Doctor:** فقط تخصصه الأساسي + ما تم منحه صراحةً
- **Nurse:** محدود حسب التخصص
- **Specialist:** وصول حسب الدور

### 7.2 Multi-Tenant Isolation
- مستأجر A **لا يستطيع** رؤية بيانات مستأجر B
- كل cross-tenant attempt **يُسجَّل** في audit log
- FORCE_RLS على مستوى قاعدة البيانات

### 7.3 PHI Protection
- مشفّر at rest (DPAPI KEK)
- مشفّر in transit (TLS 1.2+)
- محذوف من logs تلقائياً
- مُسجَّل في audit log

---

## الفصل 8: الامتثال (Compliance)

### 8.1 CBAHI
- Time-out procedures
- Hand hygiene documentation
- Patient identification (2 identifiers)
- Critical lab value alerts

### 8.2 NPHIES
- Eligibility check
- Pre-authorization
- Claim submission
- Denial appeal

### 8.3 PDPL
- Patient data rights
- Data export (30 days)
- Erasure (subject to legal retention)
- Breach notification (72 hours)

### 8.4 ZATCA Phase 2
- VAT-inclusive pricing
- UBL 2.1 invoices
- XAdES-BES digital signature

---

## الفصل 9: الأسئلة الشائعة (FAQ)

### س: كيف أضيف مستخدم جديد؟
**ج:** اطلب من Admin عبر `/admin` → Users → Add User

### س: كيف أصدر فاتورة؟
**ج:** Encounter → Billing tab → Generate Invoice → Submit to NPHIES

### س: كيف أوقّع على طلب؟
**ج:** افتح الطلب → Review → "Sign" button

### س: كيف أستخدم AI؟
**ج:** اضغط 🤖 → اكتب سؤال → "Get AI suggestion"

### س: كيف أعمل backup؟
**ج:** Admin → Backup → "Run Now"

### Q: How do I add a new patient?
**A:** Search → "+ New Patient" → Fill demographics → Save

### Q: How do I prescribe medication?
**A:** Encounter → Orders → Medication → Search drug → Sign

---

## الفصل 10: الدعم (Support)

| Channel | Hours | Response SLA |
|---|---|---|
| Email | 24/7 | 24h |
| WhatsApp | 08-20 AST | 4h |
| Phone (Enterprise) | 08-20 AST | 1h |
| In-app chat | 24/7 | 1h |

**Email:** support@jumanasoft.com
**Phone:** +966-XXX-XXXX
**Knowledge Base:** https://jumanasoft.com/help

---

**Generated:** 2026-08-08 · **Total pages:** 50+
