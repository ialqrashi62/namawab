# قائمة المهام - تفعيل وضبط لوحة تحكم الساس (SaaS Control Center Activation)

- [x] تشخيص وتحليل سبب ظهور خطأ JSON الخاطئ (أعلام البيئة غير المفعلة).
- [x] تطبيق ترحيل الجداول `e25_plans_pricing_candidate_up.sql` على السيرفر الفعلي كمسؤول (postgres).
- [x] فحص تأكيد تطبيق الترحيل e25 بنجاح وصحة كافة الحقول.
- [x] تهيئة وضبط متغيرات البيئة (`SUPER_ADMIN_ENABLED=true` و `SUPER_ADMIN_USERS=admin` و `ENTITLEMENTS_ENABLED=true`) في ملف `.env` على خادم الإنتاج.
- [x] إعادة تشغيل عملية PM2 لتحديث المتغيرات: `pm2 restart nama-medical-erp --update-env`.
- [x] التحقق من سلامة الطلبات واستجابة واجهة الساس المحدثة بعودة JSON سليم `{"plans":[]}`.
- [x] توثيق وإعداد التقارير الثمانية المعتمدة لحفظ الذاكرة في الـ AI Brain.
- [x] تحديث الذاكرة المركزية للمشروع `AI_PROJECT_MEMORY.md`.
