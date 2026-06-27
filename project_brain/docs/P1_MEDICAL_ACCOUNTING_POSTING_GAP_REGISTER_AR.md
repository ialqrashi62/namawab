# P1 الترحيل المحاسبي — 04 سجل الفجوات (Gap Register)

> التاريخ: 2026-06-20

| Gap | Severity | Evidence | Financial Risk | Required Fix | Needs DDL? | Tests Required |
| --- | -------- | -------- | -------------- | ------------ | ---------- | -------------- |
| لا محرك ترحيل (Missing posting) لكل العمليات | **عالٍ جداً** | صفر INSERT في journal_*/vouchers | دفاتر فارغة؛ لا ميزان مراجعة/قوائم مالية حقيقية | محرك ترحيل (`accounting_posting.js`) + ربط المسارات | لا (للمحرك) / نعم (للـ idempotency) | balanced/posting لكل عملية ✅ مُنفّذ |
| شجرة حسابات فارغة (Missing account mapping) | **عالٍ** | chart_of_accounts=0 على الإنتاج، لا CoA seed | لا حسابات للترحيل إليها | تعبئة CoA قياسية (AR/Revenue/VAT/Cash/AP/Inventory/COGS...) | **بيانات (seed)** — موافقة | account-mapping resolver ✅ |
| لا idempotency بنيوي (Missing idempotency) | **عالٍ** | journal_entries بلا source_type/source_id ولا فهرس فريد | ترحيل مكرّر للمستند نفسه → أرصدة خاطئة | عمود source_type+source_id + فهرس فريد (tenant,source_type,source_id) | **نعم (DDL)** | buildPostingReference فريد ✅ |
| لا قيود عكسية (Missing reversal) | متوسط | invoices/cancel/refund لا تُنشئ عكساً | إلغاء بلا أثر دفتري؛ تعديل صامت محتمل | buildReversalLines + ربط الإلغاء | لا | reversal balanced ✅ |
| السجلات المرحَّلة قابلة للتعديل الصامت (Missing immutability) | متوسط | لا قفل على is_posted | تلاعب مالي | منطق منع تعديل is_posted=1 + عكس فقط | لا (منطق) | guard test (لاحقاً عند الربط) |
| لا audit trail للترحيل/العكس (Missing audit) | متوسط | logAudit لا يغطّي posting | تتبّع جنائي ناقص | logAudit عند post/reverse | لا | audit assertion (عند الربط) |
| chart_of_accounts بلا tenant_id (Missing tenant isolation للحسابات) | متوسط (SaaS) | لا ALTER tenant_id لـ CoA | خلط حسابات بين المستأجرين مستقبلاً | إضافة tenant_id لـ CoA | **نعم (DDL)** | tenant scoping test |
| لا اختبارات محاسبية (Missing tests) | عالٍ | لا اختبار posting سابق | انحدار صامت | اختبار المحرك | لا | `accounting_posting_test.js` ✅ 28/28 |
| ZATCA stub (لا توقيع/تقديم) | عالٍ (نظامي) | zatca/generate QR محلي فقط | عدم امتثال Phase 2 | تكامل ZATCA فعلي | يحتمل | خارج نطاق هذه المرحلة |
| لا UI status للقيود (Draft/Posted/Reversed) | منخفض | finance/journal قراءة فقط | وضوح تشغيلي | UI لاحقاً | لا | — |

## التصنيف الإجمالي
- **code-only (مُنفَّذ هذه المرحلة)**: المحرك (builders + validate + reference + reversal) + اختباراته.
- **يحتاج بيانات (موافقة)**: تعبئة شجرة الحسابات القياسية.
- **يحتاج DDL (خطة منفصلة، غير منفّذة)**: source_type/source_id + فهرس فريد للـ idempotency؛ tenant_id لـ chart_of_accounts.
- **يحتاج ربط مسارات + نشر محكوم (مرحلة فرعية)**: وصل المحرك بـ invoice/receipt/refund/supplier/inventory.

`GAP_REGISTER_COMPLETE`
