# 53 — User Manual (CARD-001)

> Owner: PM/UX · Tier 1

## دليل المستخدم — قسم طب القلب

> **للأطباء والممرضين والفنيين الإداريين في قسم طب القلب**
> **المستشفى:** NamaMedical · **الإصدار:** 1.0 · **التاريخ:** 2026-07-27
> **اللغة:** العربية أساسية · الإنجليزية ثانوية · RTL

---

## 1. تسجيل الدخول والدخول للقسم

### 1.1 تسجيل الدخول

```
1. افتح https://jumanasoft.com/login
2. أدخل بريدك الإلكتروني
3. أدخل كلمة المرور
4. أدخل رمز MFA (TOTP)
5. اضغط "دخول"
```

### 1.2 MFA (المصادقة متعددة العوامل)

- إلزامية لجميع الأطباء والممرضين والفنيين
- TOTP (Google Authenticator / Authy / 1Password)
- Backup codes: 10 codes, regenerate on use

### 1.3 الدخول لقسم طب القلب

```
1. من القائمة الجانبية → Cardiology
2. أو ابحث في شريط البحث العلوي عن "Cardiology"
```

---

## 2. محطة الطبيب (Doctor Station)

### 2.1 الواجهة الرئيسية

- **عمود أيمن (RTL):** القائمة (Encounter, ECG, Echo, Cath, إلخ)
- **عمود وسط:** workspace نشط مع tabs
- **عمود أيسر (RTL):** timeline المريض

### 2.2 فتح مريض جديد

```
1. اضغط "Patients" في القائمة
2. ابحث بـ MRN أو الاسم أو رقم الهوية
3. اضغط على المريض
4. اضغط "New Cardiology Encounter"
5. املأ H&P (chief_complaint, HPI, PMH, PSH, FH, SH, allergies)
6. اضغط "Save"
```

### 2.3 تسجيل ECG

```
1. افتح patient encounter
2. اضغط "ECG" في القائمة
3. اضغط "Upload ECG"
4. اختر ملف ECG (PDF, PNG, DICOM)
5. انتظر 30 ثانية للتحليل التلقائي
6. راجع الـ impression + measurements
7. وقّع (Sign)
```

**⚠ في حالة STEMI:** النظام سيُفعّل CODE STEMI تلقائياً ويُعلم طبيب القسطرة.

### 2.4 طلب فحص (Echo / Stress / Holter / Labs)

```
1. افتح encounter
2. اضغط "Orders" tab
3. اضغط "+" بجانب الفحص المطلوب
4. راجع CDS alerts (تفاعلات دوائية، جرعة، موانع)
5. اضغط "Sign Orders"
```

### 2.5 كتابة وصفة طبية (Rx)

```
1. افتح encounter
2. اضغط "Rx" tab
3. ابحث عن الدواء
4. حدد الجرعة والتكرار
5. اضغط "Add to Rx"
6. راجع التحذيرات
7. اضغط "Sign and Submit to NPHIES"
```

**ملاحظة:** الوصفة تُرسل تلقائياً لـ NPHIES. لا تحتاج طباعة.

### 2.6 تفعيل CODE STEMI (يدوي)

```
1. افتح encounter
2. اضغط "Activate CODE" (أحمر)
3. اختر "STEMI"
4. أضف note (اختياري)
5. اضغط "Confirm"
```

**النظام سيُعلم:**
- طبيب القلب on-call
- فريق القسطرة (cath lab)
- طبيب الطوارئ
- CCU charge nurse

**عند الوصول:** مطلوب 4-eye review (طبيب قلب ثاني يوقّع).

### 2.7 استخدام المساعد الذكي (Co-pilot)

```
1. اضغط "Co-pilot" في القائمة
2. اكتب سؤالك (AR أو EN)
3. اضغط Enter
4. راجع الإجابة + المصادر + مستوى الدليل
5. (اختياري) اضغط "Save to Encounter" لإضافة الإجابة للسجل
```

**الإجابة تحتوي:**
- النص (AR)
- المصدر (دليل + سنة + قسم)
- مستوى الدليل (A/B/C)
- تحذيرات (إن وجدت)
- قواعد CDS المطبقة
- Red flag (إن وُجد)

### 2.8 تسجيل تقرير قسطرة

```
1. افتح encounter مريض بعد القسطرة
2. اضغط "Cath"
3. اضغط "New Cath Report"
4. املأ:
   - procedure_type (PCI / TAVR / Diagnostic / etc.)
   - access_site (radial / femoral)
   - findings (لكل vessel: stenosis %)
   - interventions (لكل stent: type, size)
   - contrast_ml, fluoro_minutes, dose_mgy
5. اضغط "Save Draft"
6. راجع + وقّع (Sign)
7. اضغط "Send to NPHIES"
```

**⚠ Idempotency-Key:** لا يمكن إرسال نفس الـ report مرتين. الـ NPHIES سيُرجع نفس الـ claim.

### 2.9 تسجيل جهاز (PM / ICD / CRT)

```
1. افتح encounter
2. اضغط "Devices"
3. اضغط "New Device Implant"
4. املأ:
   - device_type (PM_single / ICD_single / CRT_D / etc.)
   - manufacturer + model + serial
   - leads (positions, types, thresholds)
5. اضغط "Save + Sign"
6. اضغط "Send to NPHIES"
```

### 2.10 HF GDMT Optimizer

```
1. افتح مريض HF
2. اضغط "GDMT Optimizer"
3. راجع: EF, NYHA, BP, HR, eGFR, K
4. اضغط "Run Optimizer"
5. راجع التوصيات (changes, contra, monitor)
6. (اختياري) اضغط "Apply All" لقبول التغييرات
7. النظام سيكتب الـ Rx تلقائياً ويرسل لـ NPHIES
```

---

## 3. محطة الممرض/الفني

### 3.1 تسجيل العلامات الحيوية

```
1. افتح encounter
2. اضغط "Vitals"
3. أدخل: BP, HR, SpO2, weight, height
4. اضغط "Save"
```

**⚠ تنبيهات تلقائية:**
- BP > 180/120 → Hypertensive Emergency
- HR > 140 أو < 40 → arrhythmia alert
- SpO2 < 90 → respiratory alert

### 3.2 تفعيل CODE (ER / nurse)

```
1. افتح encounter
2. اضغط "Activate CODE" (أحمر)
3. اختر النوع (STEMI, dissection, etc.)
4. أضف note
5. اضغط "Confirm"
```

### 3.3 مراقبة CODE نشط

```
1. اذهب لـ "Active Red Flags"
2. راجع timeline + notifications
3. ACK الـ page
4. راقب SLA timer
```

### 3.4 استلام جهاز (Device Clinic)

```
1. افتح encounter
2. اضغط "Device Follow-up"
3. أدخل:
   - battery voltage
   - lead impedance
   - threshold
   - episodes (VT, VF, AT/AF)
4. اضغط "Save"
5. (اختياري) "Generate Report" للتوقيع من الطبيب
```

---

## 4. إدارة (Admin / Billing)

### 4.1 مراجعة مطالبة NPHIES

```
1. اذهب لـ "NPHIES Claims"
2. راجع status (queued / submitted / paid / denied)
3. للـ denied: اضغط "View Reason" + "Appeal" أو "Adjust"
4. للـ paid: تأكيد
```

### 4.2 لوحة تحكم Cardiology KPIs

```
1. اذهب لـ "Cardiology Dashboard"
2. راجع:
   - Encounters / day
   - Cath volume
   - Door-to-balloon (STEMI) — target < 90 min
   - HF GDMT optimization rate — target > 80%
   - NPHIES success rate
   - LLM cost
```

### 4.3 Audit log

```
1. اذهب لـ "Audit Log" (admin only)
2. فلتر بـ: action, actor, date range
3. راجع CRITICAL events
4. (اختياري) Export for forensic
```

---

## 5. الأسئلة الشائعة

### 5.1 ما الفرق بين PCI و TAVR؟

- **PCI** (Percutaneous Coronary Intervention): قسطرة الشرايين التاجية + stent
- **TAVR** (Transcatheter Aortic Valve Replacement): استبدال الصمام الأورطي بالقسطرة

### 5.2 كيف أعرف إذا كان المريض عنده STEMI؟

النظام يكتشف تلقائياً عبر:
- ECG auto-interpret (ST elevation ≥ 1mm في leads متجاورة)
- يمكن للطبيب تفعيل CODE STEMI يدوياً من زر "Activate CODE"

### 5.3 ما معنى FORCE RLS؟

- **Row-Level Security (RLS):** PostgreSQL يفلتر الصفوف حسب `tenant_id` تلقائياً
- **FORCE RLS:** حتى المستخدم الـ superuser يخضع لـ RLS
- **لماذا:** defense-in-depth — لو الـ app code فيه bug، الـ DB يحمي

### 5.4 ما الفرق بين anticoag و antiplatelet؟

- **Anticoag (DOAC, warfarin):** يمنع التجلط في الـ AF, VTE, valve
- **Antiplatelet (Aspirin, clopidogrel, ticagrelor):** يمنع التصاق الصفائح، بعد PCI/MI
- **DAPT (dual):** بعد PCI = aspirin + P2Y12 inhibitor لمدة 6-12 شهر

### 5.5 كيف أتعامل مع Hyperkalemia؟

- K 5.0-5.4: monitor، reduce MRA dose
- K 5.5-5.9: hold MRA، polystyrene binder، recheck
- K ≥ 6.0: ECG، calcium gluconate IV، insulin + glucose، hold ACEi/ARB/MRA → **red flag** (system alerts)

### 5.6 ما هو NPHIES Bundle؟

- **NPHIES** = National Platform for Health Insurance Exchange Services
- **Bundle** = مجموعة خدمات + أسعار معتمدة
- أمثلة: NPH-CARD-001 (consult), NPH-CARD-PCI (PCI), NPH-CARD-DEV (device)

### 5.7 كيف أبلغ عن bug؟

- في الـ app: اضغط "?" → "Report Bug"
- أو email: support@nama-medical
- في الحالات الحرجة: اتصل بـ IT on-call (pager)

---

## 6. الاختصارات

- **ACS** = Acute Coronary Syndrome
- **AF** = Atrial Fibrillation
- **CABG** = Coronary Artery Bypass Graft
- **CCU** = Coronary Care Unit
- **DAPT** = Dual Antiplatelet Therapy
- **DOAC** = Direct Oral Anticoagulant
- **EF** = Ejection Fraction
- **GDMT** = Guideline-Directed Medical Therapy
- **HF** = Heart Failure
- **HFrEF** = HF with reduced EF (EF<40)
- **HFmrEF** = HF with mildly reduced EF (EF 40-49)
- **HFpEF** = HF with preserved EF (EF≥50)
- **ICD** = Implantable Cardioverter Defibrillator
- **LVEF** = Left Ventricular EF
- **MRA** = Mineralocorticoid Receptor Antagonist
- **NSTEMI** = Non-ST Elevation MI
- **NPHIES** = National Platform for Health Insurance Exchange Services
- **PCI** = Percutaneous Coronary Intervention
- **PM** = Pacemaker
- **RLS** = Row-Level Security
- **STEMI** = ST-Elevation MI
- **TAVR** = Transcatheter Aortic Valve Replacement

---

## 7. الدعم الفني

- **Email:** support@nama-medical
- **هاتف (طوارئ):** +966-XX-XXX-XXXX (24/7)
- **Status page:** status.jumanasoft.com
- **Wiki:** wiki.nama-medical/cardio
