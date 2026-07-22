# User Manual — Cardiology (AR/EN)

> **Owner:** PM
> **Date:** 2026-07-22
> **Format:** Bilingual AR (primary) + EN

---

## الفصل الأول: مقدمة

### 1.1 الهدف

دليل المستخدم لقسم طب القلب والأوعية الدموية في نظام NamaMedical. يشرح كيفية استخدام محطة عمل القلب للقيام بالمهام السريرية اليومية: قراءة تخطيطات القلب، استعراض تقارير الإيكو، جدولة الإجراءات، وتشغيل نظام دعم القرار السريري (CDS).

### 1.2 الفئة المستهدفة

- أطباء القلب
- ممرضو القلب
- فنيو الموجات الصوتية (Sonographers)
- أطباء الفيزيولوجيا الكهربائية (EP)
- أخصائيو تجلط الدم
- فريق قصور القلب

### 1.3 المتطلبات الأساسية

- حساب NamaMedical مفعل
- صلاحية `cardiology_doctor` أو `cardiology_nurse` أو `sonographer` أو `ep_doctor`
- متصفح حديث (Chrome 100+, Safari 15+, Firefox 100+)
- AR/EN language preference

---

## Chapter 1: Introduction (English)

### 1.1 Purpose

User manual for the Cardiology department of the NamaMedical system. It explains how to use the Cardiology Workstation for daily clinical tasks: reading ECGs, viewing echo reports, scheduling procedures, and using the Clinical Decision Support (CDS) engine.

### 1.2 Target Audience

- Cardiologists
- Cardiology Nurses
- Sonographers
- Electrophysiologists (EP)
- Anticoagulation Specialists
- Heart Failure Team

### 1.3 Prerequisites

- Active NamaMedical account
- Role: `cardiology_doctor`, `cardiology_nurse`, `sonographer`, or `ep_doctor`
- Modern browser (Chrome 100+, Safari 15+, Firefox 100+)
- AR/EN language preference set

---

## الفصل الثاني: محطة عمل القلب (Cardiology Workstation)

### 2.1 فتح محطة القلب

1. سجّل دخولك إلى `jumanasoft.com`
2. من القائمة الجانبية، اضغط "القلب" (NAV index 48)
3. ستفتح محطة القلب بتصميم ثلاثي الأعمدة

### 2.2 التخطيط ثلاثي الأعمدة

- **العمود الأيسر (320px):** السياق — العلامات الحيوية، الحساسية، المشاكل النشطة
- **العمود الأوسط (flex):** مساحة العمل — ECG، Echo، CDS، الإجراءات
- **العمود الأيمن (320px):** اللوحة الجانبية — الطلبات، النتائج، الملاحظات

### 2.3 التبويبات الفرعية

- **عام:** عرض شامل للمريض
- **إيكو:** عرض تقارير الإيكو + رفع DICOM
- **تخطيط القلب:** أرشيف ECG
- **الإجراءات:** جدولة القسطرة، PCI، TAVR، الأجهزة
- **عيادة مضادات التجلط:** قائمة INR اليومية
- **لوحة قصور القلب:** GDMT tracking

---

## Chapter 2: Cardiology Workstation (English)

### 2.1 Opening the Cardiology Workstation

1. Log in to `jumanasoft.com`
2. From the side menu, click "Cardiology" (NAV index 48)
3. The Cardiology Workstation opens with a 3-column layout

### 2.2 Three-Column Layout

- **Left (320px):** Context — vitals, allergies, active problems
- **Center (flex):** Workspace — ECG, Echo, CDS, procedures
- **Right (320px):** Side panel — orders, results, notes

### 2.3 Sub-tabs

- **General:** Comprehensive patient view
- **Echo:** Echo reports + DICOM upload
- **ECG:** ECG archive
- **Procedures:** Schedule cath, PCI, TAVR, devices
- **Anticoag Clinic:** Daily INR queue
- **HF Dashboard:** GDMT tracking

---

## الفصل الثالث: نظام دعم القرار السريري (CDS)

### 3.1 CHA₂DS₂-VASc (خطر السكتة الدماغية في الرجفان الأذيني)

**متى تستخدمه:** كل مريض رجفان أذيني جديد أو قائم

**كيف:**
1. افتح تبويب "عام" في محطة القلب
2. اضغط "احتساب خطر السكتة"
3. سيُفتح نموذج CHA₂DS₂-VASc
4. أدخل: العمر، CHF، HTN، DM، Stroke، Vascular، Sex
5. اضغط "احتساب"
6. النتيجة: الدرجة (0-9) + التوصية + الاقتباس

**التفسير:**
- 0 (ذكور) أو 1 (إناث): لا يحتاج مضاد تجلط
- 1 (ذكور) أو 2 (إناث): فكر في مضاد التجلط
- ≥2 (ذكور) أو ≥3 (إناث): يوصى بمضاد التجلط

### 3.2 HAS-BLED (خطر النزيف)

**متى تستخدمه:** قبل بدء مضاد التجلط، وكل 6-12 شهراً بعد ذلك

**كيف:**
1. اضغط "احتساب خطر النزيف"
2. أدخل: HTN، Renal، Liver، Stroke، Bleeding، INR، Elderly، Drugs، Alcohol
3. النتيجة: درجة 0-9
4. الدرجة ≥3 = خطر نزيف عالٍ، راقب بعناية

### 3.3 HF GDMT (العلاج الرباعي لقصور القلب)

**متى تستخدمه:** كل مريض LVEF ≤40%

**الأعمدة الأربعة:**
1. ARNI/ACE-i/ARB
2. Beta-blocker (carvedilol, metoprolol succinate, bisoprolol)
3. MRA (spironolactone, eplerenone)
4. SGLT2i (dapagliflozin, empagliflozin)

**الهدف:** ≥70% من المرضى HFrEF على الأعمدة الأربعة

### 3.4 تفعيل STEMI (مختبر القسطرة)

**متى تستخدمه:** STEMI مؤكد (ارتفاع ST + troponin يرتفع)

**كيف:**
1. من ER أو أي مكان، اضغط "STEMI Activation" (أحمر)
2. النظام سيتصل:
   - طبيب القلب التداخلي
   - فريق مختبر القسطرة
   - حجز slot في المختبر
   - بدء timer "door-to-balloon"
3. الهدف: <90 دقيقة

---

## Chapter 3: Clinical Decision Support (CDS) (English)

### 3.1 CHA₂DS₂-VASc (Stroke Risk in AF)

**When to use:** Every new or existing AF patient

**How:**
1. Open the "General" tab in Cardiology Workstation
2. Click "Calculate Stroke Risk"
3. The CHA₂DS₂-VASc form opens
4. Enter: age, CHF, HTN, DM, stroke, vascular, sex
5. Click "Calculate"
6. Result: score (0-9) + recommendation + citation

**Interpretation:**
- 0 (men) or 1 (women): no anticoagulation needed
- 1 (men) or 2 (women): consider anticoagulation
- ≥2 (men) or ≥3 (women): anticoagulation recommended

### 3.2 HAS-BLED (Bleeding Risk)

**When to use:** Before starting anticoagulation, and every 6-12 months after

**How:**
1. Click "Calculate Bleeding Risk"
2. Enter: HTN, renal, liver, stroke, bleeding, INR, elderly, drugs, alcohol
3. Result: score 0-9
4. Score ≥3 = high bleeding risk, monitor closely

### 3.3 HF GDMT (Four Pillars for HFrEF)

**When to use:** Every patient with LVEF ≤40%

**Four pillars:**
1. ARNI/ACE-i/ARB
2. Beta-blocker (carvedilol, metoprolol succinate, bisoprolol)
3. MRA (spironolactone, eplerenone)
4. SGLT2i (dapagliflozin, empagliflozin)

**Target:** ≥70% of HFrEF patients on all 4 pillars

### 3.4 STEMI Activation (Cath Lab)

**When to use:** Confirmed STEMI (ST elevation + rising troponin)

**How:**
1. From ER or anywhere, click "STEMI Activation" (red button)
2. The system will:
   - Page the on-call interventional cardiologist
   - Page the cath lab team
   - Reserve a slot in the lab
   - Start the "door-to-balloon" timer
3. Target: <90 minutes

---

## الفصل الرابع: الجدولة والإجراءات

### 4.1 جدولة قسطرة قلبية

1. افتح تبويب "الإجراءات"
2. اضغط "+ جدولة إجراء"
3. اختر المريض
4. اختر نوع الإجراء (Cath، PCI، TAVR، إلخ)
5. اختر التاريخ والوقت
6. حدد الطبيب المنفذ
7. أضف الـ indication
8. اضغط "حفظ"

### 4.2 توثيق نتيجة القسطرة

بعد الإجراء:
1. افتح "إجراءاتي" → "مكتملة"
2. اختر الإجراء
3. أدخل: النتائج، المضاعفات، CPT code
4. وقّع (signature إلكتروني)
5. النظام يُغلق السجل (EMR lock)

---

## Chapter 4: Scheduling & Procedures (English)

### 4.1 Schedule a Cardiac Catheterization

1. Open "Procedures" tab
2. Click "+ Schedule Procedure"
3. Select patient
4. Choose procedure type (Cath, PCI, TAVR, etc.)
5. Pick date/time
6. Assign operator
7. Add indication
8. Click "Save"

### 4.2 Document Cath Results

After procedure:
1. Open "My Procedures" → "Completed"
2. Select procedure
3. Enter: findings, complications, CPT code
4. Sign (electronic signature)
5. System locks the record (EMR lock)

---

## الفصل الخامس: الأمان والخصوصية

- كل البيانات مشفرة في حالة السكون (DPAPI KEK)
- RLS مفعّلة على كل الجداول
- كل CDS run يُسجَّل في audit log
- 7 سنوات احتفاظ بالسجلات
- لا PHI في الـ logs العامة

---

## Chapter 5: Security & Privacy (English)

- All data encrypted at rest (DPAPI KEK)
- RLS enabled on all tables
- Every CDS run is logged in audit trail
- 7-year retention
- No PHI in general application logs

---

## الدعم الفني

- Helpdesk: `helpdesk@jumanasoft.com`
- Phone: +966-XX-XXX-XXXX
- After-hours: page on-call cardiologist

---

End of user manual.
