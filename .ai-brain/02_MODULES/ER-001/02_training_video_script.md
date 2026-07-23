---
module_id: ER-001
section: 08_operations
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Training Video Script

## Overview
- **Title:** "Emergency Department Module — Complete Walkthrough"
- **Duration:** 18 minutes
- **Audience:** All ED staff (MD, RN, PA, NP, Reception, Charge)
- **Format:** Screencast + voiceover
- **Languages:** EN + AR (separate recordings)

## Section 1: Introduction (1:00)

**Visual:** Logo, ER module title slide

**Script (EN):**
"Welcome to the NamaMedical Emergency Department module. This training will walk you through the complete ED workflow, from patient arrival to disposition. By the end, you'll know how to perform triage, activate codes, administer medications, and document care safely and efficiently."

**Script (AR):**
"مرحباً بكم في وحدة الطوارئ في NamaMedical. سيأخذك هذا التدريب خلال سير العمل الكامل للطوارئ، من وصول المريض إلى القرار. في النهاية، ستعرف كيفية إجراء الفرز، وتفعيل الأكواد، وإعطاء الأدوية، وتوثيق الرعاية بأمان وكفاءة."

## Section 2: Login + ER Board (1:30)

**Visual:** Login screen → ER board

**Script (EN):**
"First, log in with your username and password, then complete MFA. After authentication, you'll land on the ER Board. The board shows all active encounters sorted by ESI level — red for level 1 (resuscitation), orange for level 2 (emergent), yellow for level 3 (urgent), green for level 4, gray for level 5."

**Demo:** Login → ER board → point to color coding

**Script (AR):**
"أولاً، سجل الدخول باسم المستخدم وكلمة المرور، ثم أكمل المصادقة الثنائية. بعد المصادقة، ستصل إلى لوحة الطوارئ. تعرض اللوحة جميع الحالات النشطة مرتبة حسب مستوى ESI — أحمر للمستوى 1 (إنعاش)، برتقالي للمستوى 2 (طارئ)، أصفر للمستوى 3 (عاجل)، أخضر للمستوى 4، رمادي للمستوى 5."

## Section 3: Triage (3:00)

**Visual:** Triage modal → ESI classification

**Script (EN):**
"Click 'New Triage' to start a new patient. Fill in the chief complaint, history, vitals, pain score, and review PMH, allergies, and medications. When you submit, the AI classifies the patient to an ESI level and detects any red flags.

[Demo: enter a chest pain patient → ESI 2 → red flag: ACS]

The AI is advisory — you can override, but you must provide a reason. A supervisor co-sign is required for ESI 1-2 overrides."

**Script (AR):**
"انقر 'فرز جديد' لبدء مريض جديد. املأ الشكوى الرئيسية، التاريخ، العلامات الحيوية، درجة الألم، وراجع التاريخ المرضي والحساسية والأدوية. عند الإرسال، يصنف الذكاء الاصطناعي المريض إلى مستوى ESI ويكتشف أي علامات حمراء.

[عرض: إدخال مريض ألم صدر → ESI 2 → علامة حمراء: متلازمة الشريان التاجي الحادة]

الذكاء الاصطناعي استشاري — يمكنك التجاوز، لكن يجب تقديم سبب. التوقيع المشترك من المشرف مطلوب لتجاوزات ESI 1-2."

## Section 4: Code Activation (2:00)

**Visual:** Code activation modal → team page

**Script (EN):**
"For life-threatening situations, click the red 'Activate Code' button. Select the code type: Blue for cardiac arrest, STEMI for heart attack, Stroke for brain attack, Trauma for major injury, Sepsis for severe infection, MCI for mass casualty.

[Demo: Activate Code STEMI → team page → encounter marked critical]

Once activated, the team is auto-paged and the encounter is flagged critical. The timer starts for time targets like door-to-balloon."

**Script (AR):**
"للحالات المهددة للحياة، انقر الزر الأحمر 'تفعيل كود'. اختر نوع الكود: أزرق للسكتة القلبية، STEMI لاحتشاء القلب، السكتة للسكتة الدماغية، الصدمة للإصابة الكبيرة، التعفن للعدوى الشديدة، MCI لحوادث الكوارث.

[عرض: تفعيل كود STEMI → إخطار الفريق → الحالة موسومة كحرجة]

بمجرد التفعيل، يتم إخطار الفريق تلقائياً وتُوسم الحالة كحرجة. يبدأ المؤقت لأهداف الوقت مثل من الباب إلى البالون."

## Section 5: Medication Administration (3:00)

**Visual:** Medication tab → safety checks

**Script (EN):**
"To administer a medication, search the drug, enter the dose, route, and frequency. The system automatically performs five safety checks:

1. Right patient
2. Right drug
3. Right dose
4. Right route
5. Right time

Plus critical safety:
- Allergy check — if the patient is allergic, the medication is BLOCKED. You cannot override this.
- Drug interaction — critical interactions are blocked.
- Renal dose — if eGFR is low, the system recommends an adjusted dose. You can override with a reason.
- Pregnancy — for women 12-55, pregnancy test is required before teratogens. If not done, BLOCKED.

[Demo: penicillin-allergic patient + amoxicillin → BLOCKED]"

**Script (AR):**
"لإعطاء دواء، ابحث عن الدواء، أدخل الجرعة والطريق والتكرار. يقوم النظام تلقائياً بإجراء خمسة فحوصات سلامة:

1. المريض الصحيح
2. الدواء الصحيح
3. الجرعة الصحيحة
4. الطريق الصحيح
5. الوقت الصحيح

بالإضافة إلى السلامة الحرجة:
- فحص الحساسية — إذا كان المريض يعاني من حساسية، الدواء محظور. لا يمكنك التجاوز.
- التفاعل الدوائي — التفاعلات الحرجة محظورة.
- الجرعة الكلوية — إذا كان eGFR منخفضاً، يوصي النظام بجرعة معدلة. يمكنك التجاوز مع سبب.
- الحمل — للإناث 12-55، فحص الحمل مطلوب قبل الماسخات. إذا لم يتم، محظور.

[عرض: مريض لديه حساسية بنسلين + أموكسيسيلين → محظور]"

## Section 6: Disposition (2:30)

**Visual:** Disposition modal

**Script (EN):**
"When the patient is ready for disposition, click the 'Disposition' button. Choose: Admit, Discharge, Transfer, AMA (Against Medical Advice), Deceased, or Observation.

For Discharge: provide instructions and follow-up.
For AMA: a witness signature is required, and capacity must be documented.
For Admit: select the receiving unit (CCU, ward, etc.), and the system will trigger the admission workflow.

[Demo: discharge with instructions + follow-up]"

**Script (AR):**
"عندما يكون المريض جاهزاً للقرار، انقر زر 'القرار'. اختر: قبول، خروج، تحويل، خروج ضد النصيحة، وفاة، أو ملاحظة.

للخروج: قدم التعليمات والمتابعة.
للخروج ضد النصيحة: توقيع الشاهد مطلوب، ويجب توثيق الأهلية.
للقبول: اختر الوحدة المستقبلة (CCU، القسم، إلخ)، وسيشغل النظام سير عمل القبول.

[عرض: خروج مع التعليمات + المتابعة]"

## Section 7: Documentation (1:30)

**Visual:** Notes tab

**Script (EN):**
"All notes are auto-saved every 30 seconds. Click 'Sign' to apply your electronic signature. The system captures your signature, timestamp, and the note content. Co-sign is required for resident notes by the attending MD.

All actions are logged in the audit log for quality and compliance. You can view the audit log of your own actions from the user menu."

**Script (AR):**
"يتم حفظ جميع الملاحظات تلقائياً كل 30 ثانية. انقر 'توقيع' لتطبيق توقيعك الإلكتروني. يلتقط النظام توقيعك، والطابع الزمني، ومحتوى الملاحظة. التوقيع المشترك مطلوب لملاحظات المقيمين من الطبيب المعالج.

يتم تسجيل جميع الإجراءات في سجل التدقيق للجودة والامتثال. يمكنك عرض سجل التدقيق لإجراءاتك الخاصة من قائمة المستخدم."

## Section 8: Mobile + Accessibility (1:30)

**Visual:** Mobile layout → keyboard nav

**Script (EN):**
"The ER module is mobile-friendly. The layout adapts to phones and tablets, with a sticky patient header and swipeable actions. The module is fully accessible — keyboard navigation, screen reader support, and WCAG 2.2 AA compliance.

Use keyboard shortcuts: N for new triage, D for disposition, arrow keys to navigate."

**Script (AR):**
"وحدة الطوارئ متوافقة مع الجوال. يتكيف التخطيط مع الهواتف والأجهزة اللوحية، مع رأس مريض ثابت وإجراءات قابلة للسحب. الوحدة متاحة بالكامل — التنقل بلوحة المفاتيح، دعم قارئ الشاشة، والامتثال لمعايير WCAG 2.2 AA.

استخدم اختصارات لوحة المفاتيح: N للفرز الجديد، D للقرار، مفاتيح الأسهم للتنقل."

## Section 9: Best Practices (2:00)

**Visual:** Tips overlay

**Script (EN):**
"Best practices:
1. Document in real-time, don't wait until end of shift
2. Always verify the 5 rights before medication
3. Use the AI as a second opinion, not a replacement
4. Escalate when in doubt
5. Review your audit log weekly for quality improvement
6. Report any issues to IT or QA

Remember: patient safety is everyone's responsibility. If you see a red flag, act on it."

**Script (AR):**
"أفضل الممارسات:
1. وثّق في الوقت الفعلي، لا تنتظر حتى نهاية المناوبة
2. تحقق دائماً من 5 حقوق قبل الدواء
3. استخدم الذكاء الاصطناعي كرأي ثانٍ، ليس بديلاً
4. تصعيد عند الشك
5. راجع سجل التدقيق أسبوعياً لتحسين الجودة
6. أبلغ عن أي مشاكل لـ IT أو الجودة

تذكر: سلامة المريض مسؤولية الجميع. إذا رأيت علامة حمراء، تصرف."

## Section 10: Q&A + Resources (0:30)

**Visual:** Contact info, user manual link

**Script (EN):**
"For questions, contact the ED head, charge nurse, IT helpdesk, or refer to the full user manual in the system. Thank you for your dedication to patient care."

**Script (AR):**
"للأسئلة، اتصل برئيس قسم الطوارئ، ممرض الطوارئ المناوب، مكتب المساعدة، أو راجع الدليل الكامل في النظام. شكراً لالتزامك برعاية المرضى."

---
*Section 08.b of ER-001. Owner: PM + Ops. L4 validated.*
