# Clinician FAQ (Bilingual)

## EN

### Logging in & access
**Q: I can't log in / 2FA failed.**
Reset MFA at the IT helpdesk. Your SCFHS license must be valid (auto-checked on login). If expired, credentialing will block access until renewal.

**Q: I need access to a different department.**
Submit a privileging change request via Quality. New scope appears within 1 business day after committee approval.

**Q: Break-glass access.**
For life-critical patient who is not yours, use the **Break-Glass** button in the patient header. Reason is mandatory and triggers a 24-hour post-audit.

### Orders
**Q: System blocked my order.**
Read the alert reason — usually allergy, dose, eGFR, or restricted antimicrobial. You may override with a documented reason for non-block warnings; block-class requires a peer review.

**Q: My order didn't reach pharmacy/lab.**
Check status in the order detail. If "stuck" > 5 min, see [oncall.md](../runbooks/oncall.md) §"Common issues".

**Q: I want to apply an order set.**
Patient → Orders → "Apply set" → choose (e.g., `stemi`, `sepsis_1h`). Each line still needs your sign-off.

### AI co-pilot
**Q: Should I trust the AI suggestion?**
AI is **advisory only**. You retain full clinical responsibility. AI shows confidence + citations; verify with sources. If you disagree, override with reason — that improves the model.

**Q: AI flagged STEMI on my ECG read.**
Confirm clinically; if you agree, activate Code STEMI from the ECG screen. The AI alert is logged regardless.

**Q: How do I request human-only review for a patient who declined AI?**
Patient Header → Privacy badge → "Disable AI suggestions for this visit". A note is added to the record.

### Notes & documentation
**Q: How do I use smart phrases?**
Type `.` then the shortcode (e.g., `.cardio.hpi`) → press Tab. The template expands; fill placeholders.

**Q: I made an error in a signed note.**
Add an Addendum (cannot edit signed notes). The original is preserved per CBAHI.

### Handover
**Q: How do I generate SBAR?**
Track sheet → "Handover SBAR". The system pre-fills from the chart; review and sign before sending.

### Privacy
**Q: A colleague asked me to share a patient screenshot via WhatsApp.**
Don't. PHI on personal channels violates AUP and PDPL. Use in-app secure messaging.

**Q: Patient asked who has accessed their record.**
The Access Log is patient-visible. Anyone with concerns can contact DPO.

### Reporting incidents
**Q: I noticed a near-miss / medication error.**
File an OVR within 24 h. Reporting culture is encouraged; non-punitive for honest errors.

### Training
**Q: How do I keep my mandatory training up-to-date?**
Profile → Training. System blocks clinical access if BLS/ACLS or annual modules expire.

---

## AR — أسئلة شائعة للأطباء والممارسين

### تسجيل الدخول والصلاحيات
**س: لا أستطيع الدخول / فشل التحقق الثاني.**
ج: أعد تعيين MFA عبر الدعم. تأكد من صلاحية ترخيص الهيئة (يُفحص آلياً). انتهاء الترخيص يُوقف الوصول.

**س: أحتاج صلاحية لقسم آخر.**
ج: قدّم طلب تعديل امتيازات عبر الجودة. تظهر الصلاحية بعد موافقة اللجنة (يوم عمل واحد).

**س: الوصول الطارئ (Break-Glass).**
ج: استخدم زر "Break-Glass" في رأس المريض. تسجيل السبب إلزامي ويفعّل تدقيقاً بعد 24 ساعة.

### الأوامر
**س: النظام منع طلبي.**
ج: اقرأ سبب التنبيه — عادةً حساسية أو جرعة أو eGFR أو مضاد مقيد. التحذيرات يمكن تجاوزها بسبب موثَّق؛ المنع التام يستلزم مراجعة الزميل.

**س: لم يصل طلبي للصيدلية/المختبر.**
ج: راجع حالة الطلب. إذا توقف > 5 دقائق، راجع [oncall.md](../runbooks/oncall.md).

### الذكاء الاصطناعي
**س: هل أثق باقتراح AI؟**
ج: AI **استشاري فقط**. مسؤوليتك السريرية كاملة. النموذج يعرض الثقة + المراجع. إذا اختلفت، عارِض مع سبب — هذا يحسّن النموذج.

**س: AI رصد STEMI في ECG.**
ج: أكّد سريرياً؛ إن وافقت، فعّل Code STEMI. تنبيه AI يُسجَّل في الحالتين.

### التوثيق
**س: كيف أستخدم العبارات الذكية؟**
ج: اكتب `.` ثم الاختصار (مثال `.cardio.hpi`) ← Tab. يتوسع القالب، املأ المتغيرات.

**س: أخطأت في ملاحظة موقّعة.**
ج: أضف Addendum (لا يمكن تعديل الموقّع). الأصل محفوظ وفق CBAHI.

### الخصوصية
**س: زميل طلب إرسال لقطة شاشة لمريض عبر واتساب.**
ج: لا. PHI على قنوات شخصية مخالف للسياسة وPDPL. استخدم المراسلة الآمنة في التطبيق.

### التقارير
**س: لاحظت خطأ دوائي قريب.**
ج: أنشئ OVR خلال 24 ساعة. ثقافة الإبلاغ مشجَّعة وغير عقابية للأخطاء الصادقة.

### التدريب
**س: كيف أبقي تدريبي محدَّثاً؟**
ج: الملف ← التدريب. النظام يُوقف الوصول السريري إذا انتهى BLS/ACLS أو الوحدات السنوية.
