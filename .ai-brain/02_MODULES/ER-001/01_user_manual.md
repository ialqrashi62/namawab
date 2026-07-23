---
module_id: ER-001
section: 08_operations
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 User Manual (EN/AR Bilingual)

## EN — English Version

### Emergency Department Module — Quick Start Guide

#### 1. Login
1. Navigate to `https://app.namamedical.com/login.html`
2. Enter your username and password
3. Complete MFA (TOTP from authenticator app)
4. Click "Sign In"

#### 2. ER Board (Main Screen)
The ER Board shows all active encounters sorted by ESI level (1=highest priority).

| Column | What it shows |
|--------|---------------|
| Left sidebar | Search, filter, encounter list |
| Center | Active encounter timeline |
| Right sidebar | Patient summary, vitals, red flags |

#### 3. Triage a New Patient
1. Click "+ New Triage" (top-right)
2. Fill in: Chief complaint, HPI, vitals, pain score, PMH, allergies, medications
3. Click "Submit"
4. Review AI's ESI level + red flags
5. **Confirm** or **Override** (override requires reason)
6. Patient is auto-routed to Resus Bay (ESI 1) / Acute Bed (ESI 2-3) / Fast Track (ESI 4-5)

#### 4. Activate a Code
1. Click "Activate Code" button (red, top-right)
2. Select code type: Blue / STEMI / Stroke / Trauma / Sepsis / MCI
3. Enter reason
4. Click "Confirm"
5. Team is auto-paged, encounter is marked critical

#### 5. Administer Medication
1. In encounter detail, click "Medication" tab
2. Search drug (autocomplete)
3. Enter dose, route, frequency
4. **5-Rights Check** auto-validated:
   - Right patient ✓
   - Right drug ✓
   - Right dose ✓
   - Right route ✓
   - Right time ✓
5. If allergy conflict: **BLOCKED** (cannot override)
6. If renal dose adjustment needed: **OVERRIDE REQUIRED** (with reason)
7. Click "Administer"

#### 6. Order Labs
1. Click "Labs" tab
2. Search test (autocomplete, LOINC code shown)
3. Select priority: Stat / Urgent / Routine
4. Click "Order"
5. Track result in same tab (auto-refreshes)

#### 7. Order Imaging
1. Click "Imaging" tab
2. Select modality: X-ray / CT / MRI / US
3. Select body part
4. Indication (required)
5. **Pregnancy check** auto-validated for female 12-55
6. Click "Order"

#### 8. Request Consultation
1. Click "Consults" tab
2. Select specialty
3. Enter reason
4. Mark urgent if needed
5. Click "Request"

#### 9. Document a Note
1. Click "Notes" tab
2. Select note type: Triage / Nursing / MD / Procedure / Consult / Discharge
3. Type content (auto-saves every 30s)
4. Click "Sign" (electronic signature + timestamp)
5. Cosign by attending MD if needed

#### 10. Disposition
1. Click "Disposition" (bottom action bar)
2. Select: Admit / Discharge / Transfer / AMA / Deceased / Observation
3. Fill destination, discharge instructions, follow-up
4. For AMA: witness signature required
5. Click "Confirm"

#### 11. View Audit Log
1. Click "Audit" (top-right menu)
2. Filter by user, action, date
3. Search by patient or encounter
4. Export to CSV (CQO only)

#### 12. Sign Out
1. Click your name (top-right)
2. Click "Sign Out"
3. Session expires after 15 min idle (auto-logout)

### Keyboard Shortcuts
- `N` = New triage
- `R` = Reassign encounter
- `D` = Open disposition
- `Esc` = Close modal
- `↑/↓` = Navigate encounters
- `Enter` = Confirm

### Troubleshooting

**Q: Triage submission failed**
A: Check required fields (chief complaint + vitals). Verify patient is registered. If still failing, contact IT.

**Q: Drug allergy alert not showing**
A: Verify allergy is documented in patient's chart. Drug-allergy matching is server-side; if missing, contact pharmacy.

**Q: Code activation not paging team**
A: Verify paging system is up. Check team list. If issue persists, manually call team via backup process.

**Q: Audit log not visible**
A: Audit log requires CQO or admin role. Contact admin for access.

### Emergency Contacts
- IT Helpdesk: helpdesk@namamedical.com
- ED Charge Nurse: ext. 3001
- ED Head: ext. 3000
- Pharmacy (24/7): ext. 2500
- Security: ext. 9999

---

## AR — النسخة العربية

### وحدة الطوارئ — دليل البدء السريع

#### 1. تسجيل الدخول
1. اذهب إلى `https://app.namamedical.com/login.html`
2. أدخل اسم المستخدم وكلمة المرور
3. أكمل المصادقة الثنائية (TOTP)
4. انقر "تسجيل الدخول"

#### 2. لوحة الطوارئ (الشاشة الرئيسية)
تعرض لوحة الطوارئ جميع الحالات النشطة مرتبة حسب مستوى ESI (1 = الأولوية القصوى).

| العمود | ما يعرضه |
|--------|----------|
| الشريط الجانبي الأيسر | البحث، الفلتر، قائمة الحالات |
| الوسط | الجدول الزمني للحالة النشطة |
| الشريط الجانبي الأيمن | ملخص المريض، العلامات، العلامات الحمراء |

#### 3. فرز مريض جديد
1. انقر "+ فرز جديد" (أعلى اليمين)
2. املأ: الشكوى الرئيسية، تاريخ المرض، العلامات الحيوية، درجة الألم، التاريخ المرضي، الحساسية، الأدوية
3. انقر "إرسال"
4. راجع مستوى ESI والعلامات الحمراء من الذكاء الاصطناعي
5. **تأكيد** أو **تجاوز** (التجاوز يتطلب سبب)
6. يتم توجيه المريض تلقائياً إلى غرفة الإنعاش (ESI 1) / السرير الحاد (ESI 2-3) / المسار السريع (ESI 4-5)

#### 4. تفعيل كود
1. انقر زر "تفعيل كود" (أحمر، أعلى اليمين)
2. اختر نوع الكود: أزرق / STEMI / سكتة / صدمة / تعفن / حادث جماعي
3. أدخل السبب
4. انقر "تأكيد"
5. يتم إخطار الفريق تلقائياً، وتُوسم الحالة كحرجة

#### 5. إعطاء دواء
1. في تفاصيل الحالة، انقر تبويب "الأدوية"
2. ابحث عن الدواء (إكمال تلقائي)
3. أدخل الجرعة، الطريق، التكرار
4. **التحقق من 5 حقوق** تلقائي:
   - المريض الصحيح ✓
   - الدواء الصحيح ✓
   - الجرعة الصحيحة ✓
   - الطريق الصحيح ✓
   - الوقت الصحيح ✓
5. في حالة تعارض الحساسية: **محظور** (لا يمكن التجاوز)
6. في حالة تعديل الجرعة الكلوية: **التجاوز مطلوب** (مع السبب)
7. انقر "إعطاء"

#### 6. طلب فحوصات مخبرية
1. انقر تبويب "المخبر"
2. ابحث عن الفحص (إكمال تلقائي، كود LOINC معروض)
3. اختر الأولوية: عاجل / مستعجل / روتيني
4. انقر "طلب"
5. تابع النتيجة في نفس التبويب (تحديث تلقائي)

#### 7. طلب أشعة
1. انقر تبويب "الأشعة"
2. اختر النمط: أشعة / CT / MRI / US
3. اختر جزء الجسم
4. الاستطباب (إلزامي)
5. **فحص الحمل** تلقائي للإناث 12-55
6. انقر "طلب"

#### 8. طلب استشارة
1. انقر تبويب "الاستشارات"
2. اختر التخصص
3. أدخل السبب
4. حدد مستعجل إذا لزم
5. انقر "طلب"

#### 9. توثيق ملاحظة
1. انقر تبويب "الملاحظات"
2. اختر نوع الملاحظة: فرز / تمريض / طبيب / إجراء / استشارة / خروج
3. اكتب المحتوى (حفظ تلقائي كل 30 ثانية)
4. انقر "توقيع" (توقيع إلكتروني + طابع زمني)
5. التوقيع المشترك من الطبيب المعالج إذا لزم

#### 10. القرار
1. انقر "القرار" (شريط الإجراءات السفلي)
2. اختر: قبول / خروج / تحويل / خروج ضد النصيحة / وفاة / ملاحظة
3. املأ الوجهة، تعليمات الخروج، المتابعة
4. للخروج ضد النصيحة: توقيع الشاهد مطلوب
5. انقر "تأكيد"

#### 11. عرض سجل التدقيق
1. انقر "التدقيق" (قائمة أعلى اليمين)
2. فلتر حسب المستخدم، الإجراء، التاريخ
3. ابحث بالمريض أو الحالة
4. تصدير CSV (مسؤول الجودة فقط)

#### 12. تسجيل الخروج
1. انقر اسمك (أعلى اليمين)
2. انقر "تسجيل الخروج"
3. تنتهي الجلسة بعد 15 دقيقة خمول (تسجيل خروج تلقائي)

### اختصارات لوحة المفاتيح
- `N` = فرز جديد
- `R` = إعادة تعيين
- `D` = فتح القرار
- `Esc` = إغلاق النافذة
- `↑/↓` = التنقل بين الحالات
- `Enter` = تأكيد

### حل المشاكل

**س: فشل إرسال الفرز**
ج: تحقق من الحقول المطلوبة (الشكوى + العلامات). تحقق من تسجيل المريض. إذا استمر، اتصل بـ IT.

**س: تنبيه حساسية الدواء لا يظهر**
ج: تحقق من توثيق الحساسية في ملف المريض. المطابقة server-side؛ إذا كانت مفقودة، اتصل بالصيدلية.

**س: تفعيل الكود لا ينبه الفريق**
ج: تحقق من نظام الاتصال. تحقق من قائمة الفريق. إذا استمرت المشكلة، اتصل بالفريق يدوياً.

**س: سجل التدقيق غير مرئي**
ج: يتطلب دور مسؤول الجودة أو مدير. اتصل بالمسؤول.

### جهات الاتصال للطوارئ
- مكتب المساعدة: helpdesk@namamedical.com
- ممرض الطوارئ المناوب: تحويلة 3001
- رئيس قسم الطوارئ: تحويلة 3000
- الصيدلية (24/7): تحويلة 2500
- الأمن: تحويلة 9999

---
*Section 08.a of ER-001. Owner: PM + Ops. L4 validated.*
