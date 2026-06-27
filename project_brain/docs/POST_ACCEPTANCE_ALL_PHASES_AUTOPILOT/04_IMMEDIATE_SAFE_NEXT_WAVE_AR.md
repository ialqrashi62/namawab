# 04 — الموجة الآمنة الفورية (Immediate Safe Next Wave)

> 2026-06-22 | بنود قابلة للتنفيذ بأمان **بلا E2E، بلا KMS، بلا طرف خارجي، بلا DDL مخاطر**. للتنفيذ تحتاج بوابة تنفيذ مستقلة (هذا التقرير مراجعة فقط).

| # | البند | لماذا آمن الآن | النوع | بوابة التنفيذ المقترحة |
|---|---|---|---|---|
| 1 | **audit hardening** (توسيع logAudit للطفرات الحسّاسة) | backend فقط، deploy كنمط A1، لا E2E، لا DDL | code | APPROVE_AUDIT_HARDENING_BACKEND_DEPLOY |
| 2 | **scheduled local DB backup** (Scheduled Task + pg_dump محلي) | infra إضافي، قابل للتراجع (حذف task)، لا مفتاح للمحلي | infra | APPROVE_SCHEDULED_LOCAL_BACKUP (التشفير/offsite لاحقاً مع KMS) |
| 3 | **beta pages review** (مراجعة فرع r17 قراءة-فقط، بلا merge) | قراءة فقط، لا تغيير | review | لا بوابة (مراجعة فقط) |
| 4 | **BI/observability + design-system + i18n candidates** | docs/candidate، لا نشر | docs | لا بوابة (candidate) |
| 5 | **WHO checklist / ESI / ICU scores — candidates** | تصميم+DDL candidate+rehearsal معزول، بلا نشر | candidate | لا بوابة لإعداد المرشّح؛ النشر لاحقاً |

## التوصية
أكثر قيمة وأماناً الآن (بلا حواجز): **(1) audit hardening** و**(2) scheduled local backup** — كلاهما يرفع الجاهزية الأمنية/التشغيلية دون E2E/مفاتيح. الباقي candidate/review. **التنفيذ الفعلي يحتاج توجيه بوابة مستقل** (هذه مراجعة فقط).
