# وثيقة عبور الموافقة وإطلاق التخطيط التنفيذي (Rollout Approval Gate Report)
## نظام نما الطبي (NamaMedical) - مرحلة التخطيط والتحقق

توثق هذه الوثيقة بدء وتأطير مرحلة بوابة الموافقة لتنفيذ الطرح الإنتاجي (`PRODUCTION_ROLLOUT_EXECUTION_APPROVAL_GATE`) لتأكيد جاهزية الأكواد، وإعداد الأوامر التنفيذية التفصيلية، وصياغة سجل المخاطر والتحقق قبل أي احتكاك فعلي ببيئة الإنتاج.

---

### 1. نطاق الموافقة والضوابط الصارمة (Controlled Scope & Restrictions)

بموجب الموافقة المحدودة الصادرة من إدارة النظام الطبي:
* **المسموح حالياً**:
  1. التحقق من نسخة الإطلاق (Release Candidate).
  2. صياغة أوامر التنفيذ التفصيلية وقوائم التدقيق.
  3. إعداد خطط النسخ الاحتياطي والتعافي وسجل مخاطر النشر.
  4. تشغيل اختبارات انحدار الأمان على Staging فقط لإعادة التأكيد.
* **الممنوع منعاً باتاً (حتى صدور موافقة ثانية صريحة)**:
  * حظر كامل للولوج (SSH) لخادم الإنتاج، أو تعديل الملف البيئي، أو تشغيل سكربتات الترقية/DDL، أو إعادة تشغيل أي عملية في الإنتاج، أو تغيير DNS/SSL.

---

### 2. محتويات حزمة الموافقة التنفيذية (Rollout Package Structure)

تتكون حزمة الموافقة الحالية من خمسة مستندات تفصيلية:
1. **الوثيقة الحالية (بوابة الموافقة)**: [MEDICAL_PRODUCTION_ROLLOUT_APPROVAL_GATE_AR.md](./docs/MEDICAL_PRODUCTION_ROLLOUT_APPROVAL_GATE_AR.md)
2. **التحقق من نسخة الإطلاق**: [MEDICAL_PRODUCTION_RELEASE_CANDIDATE_VERIFICATION_AR.md](./docs/MEDICAL_PRODUCTION_RELEASE_CANDIDATE_VERIFICATION_AR.md)
3. **خطة الأوامر التنفيذية**: [MEDICAL_PRODUCTION_EXECUTION_COMMAND_PLAN_AR.md](./docs/MEDICAL_PRODUCTION_EXECUTION_COMMAND_PLAN_AR.md)
4. **فحوصات الاستعادة والنسخ والتراجع**: [MEDICAL_PRODUCTION_BACKUP_ROLLBACK_FINAL_CHECK_AR.md](./docs/MEDICAL_PRODUCTION_BACKUP_ROLLBACK_FINAL_CHECK_AR.md)
5. **سجل مخاطر النشر**: [MEDICAL_PRODUCTION_DEPLOYMENT_RISK_REGISTER_AR.md](./docs/MEDICAL_PRODUCTION_DEPLOYMENT_RISK_REGISTER_AR.md)

---

### 3. الخلاصة وحالة العبور (Gate Conclusion)

* **حالة البوابة الحالية**: **PASS** (تم تأطير وحصر النطاق ودمج الملفات الأمنية بنجاح).
* **التوصية**: الانتقال لخطوات التحقق من نسخة الإطلاق وكتابة تقارير الفحص والتقييم قبل التوقف لطلب موافقة التنفيذ النهائية.

**القرار**: تم العبور وتأطير المرحلة بنجاح (**Approval Gate: PASS**).
