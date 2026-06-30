# الدفعة 4C — Runbook تفعيل إنفاذ max_users على staging (GATE 9 — إعداد فقط)

**التاريخ:** 2026-06-30 · الحالة: **غير مُنفَّذ** — للتفعيل على **staging فقط** بعد نجاح 4B وبإذن المالك.
**القاعدة:** لا production. observe أولاً ثم enforce على staging فقط. لا طباعة env values.

## 0) المتطلّبات المسبقة (Prerequisites)
- [ ] `BATCH4B_STAGING_E25_PROVISIONING_PASS` (e25 موفّر على staging — حالياً BLOCKED، انتظار devops).
- [ ] خطط seeded على staging (starter/growth/enterprise) باستحقاقات `max_users` حقيقية.
- [ ] مستأجر staging مربوط بخطة، و`GET /api/super-admin/tenants/:id/entitlements` يقرأ `max_users` الحقيقي (source=plan).
- [ ] **تأكيد ربط العضوية:** التحقّق أن إنشاء المستخدم (أو مسار العضوية) يحدّث `user_tenants` بحيث ينمو العدّ — وإلا الإنفاذ بلا أثر (فجوة §6 من الجرد/المراجعة). إصلاح هذا الربط شرط إلزامي قبل enforce.

## 1) التفعيل التدريجي (staging فقط)
- [ ] المرحلة 1 — observe:
  - `ENTITLEMENTS_ENABLED=true`
  - `ENTITLEMENTS_ENFORCEMENT_MODE=observe`
  - `ENTITLEMENTS_FAIL_MODE=allow_existing`
  - راقب أحداث `USER_CREATE_LIMIT_OBSERVED` فترة كافية (لا منع).
- [ ] المرحلة 2 — enforce (بعد رضا observe):
  - `ENTITLEMENTS_ENFORCEMENT_MODE=enforce` (staging فقط).

## 2) اختبارات التفعيل (staging)
- [ ] إنشاء مستخدم و`current_users < max_users` → ينجح (200).
- [ ] إنشاء مستخدم عند `current_users >= max_users` → يُرفَض **409** `USER_LIMIT_REACHED` + audit `USER_CREATE_LIMIT_BLOCKED`.
- [ ] خطة `max_users=null` → لا منع (غير محدود).
- [ ] أدمن مستأجر فقط يصل المسار (غير الأدمن 403 قبل الحارس).
- [ ] تسجيل الدخول / Tenant Control Center / public plans — بلا تأثّر.

## 3) Rollback (فوري)
- [ ] الرجوع إلى observe: `ENTITLEMENTS_ENFORCEMENT_MODE=observe` (يوقف المنع فوراً).
- [ ] التعطيل الكامل: `ENTITLEMENTS_ENABLED=false` (يعيد no-op التام — لا استعلام، لا منع).
- [ ] لا أثر على بيانات (لا DDL، لا كتابة من الحارس).

## 4) ملاحظة الإنتاج
- التفعيل على **production** = runbook منفصل لاحق بإذن مستقل، بعد استقرار staging (observe ثم enforce) وفترة مراقبة. **خارج نطاق 4C.**

## 5) قائمة موافقة المالك (وقت التفعيل)
- [ ] 4B ناجحة على staging + ربط العضوية مؤكَّد.
- [ ] أذنت بـ observe ثم enforce على **staging فقط**.
- [ ] أفهم أن production خارج النطاق هنا.
- التوقيع/التاريخ: ____________________
