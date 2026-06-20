# P1 الترحيل المحاسبي — 05 التنفيذ (Implementation)

> التاريخ: 2026-06-20 | code-first، **بلا DDL، بلا تغيير بيانات، بلا ربط مسارات إنتاجية**.

## 1. ما نُفّذ — مكتبة محرك الترحيل (`namaweb/accounting_posting.js`)
دوال نقية قابلة للاختبار (غير موصولة بأي مسار بعد — لا تغيّر سلوك التطبيق):
- `splitVatInclusive(total)` — فصل الإجمالي الشامل (15%) إلى صافٍ + ضريبة.
- `validateBalanced(lines)` — يضمن Σمدين = Σدائن > 0.
- `buildPostingReference(sourceType, sourceId)` — مرجع idempotency فريد لكل مستند.
- بناة قيود متوازنة: `buildPatientInvoicePosting` (نقدي/تأمين)، `buildReceiptPosting`، `buildRefundPosting`، `buildCreditNotePosting`، `buildSupplierInvoicePosting`، `buildPaymentVoucherPosting`، `buildInventoryConsumptionPosting`.
- `buildReversalLines(lines)` — قيد عكسي للتصحيح.
- `ACCOUNT_CODES` — رموز الحسابات القياسية المتوقّعة في CoA.

## 2. لماذا لم تُوصَل بالمسارات الآن (حدود السلامة)
الربط الفعلي بـ invoice/receipt/... يتطلب:
1. **شجرة حسابات مُعبّأة** (CoA=0 على الإنتاج) → تغيير بيانات (موافقة).
2. **idempotency بنيوي** (source_type/source_id + فهرس فريد) → DDL (موافقة).
3. ربط المسارات + نشر محكوم (موافقة نشر).
لذا المحرك يبقى مكتبة أساس مُختبَرة (USER_VISIBLE_ON_WEBSITE: NO — لا تُستورد في server.js).

## 3. خطة DDL/بيانات (غير منفّذة — للمراحل الفرعية المُعتمَدة)
- DDL: `ALTER TABLE finance_journal_entries ADD COLUMN source_type TEXT, ADD COLUMN source_id INTEGER` + `CREATE UNIQUE INDEX uq_je_source ON finance_journal_entries (tenant_id, source_type, source_id) WHERE source_type<>''` (idempotency)؛ `ALTER TABLE finance_chart_of_accounts ADD COLUMN tenant_id INTEGER` (عزل SaaS).
- بيانات: seed شجرة حسابات قياسية (AR/Revenue/VAT/Cash/Bank/AP/Inventory/COGS/Sales Returns) بالرموز في `ACCOUNT_CODES`.
- ربط: `postDocument(client, posting, {tenantId, facilityId})` يكتب entry+lines داخل معاملة بعد فحص المرجع (idempotent)، ويُستدعى من المسارات.

## 4. الحالة
`CHANGE_CLASSIFICATION: CODE_ONLY (library, unwired)` — يُحفظ في GitHub، لا يُنشر (لا أثر runtime). التفعيل: `BLOCKED_PENDING_DDL_APPROVAL` + `BLOCKED_PENDING_DATA_CHANGE_APPROVAL` + `BLOCKED_PENDING_DEPLOY_APPROVAL`.

`IMPLEMENTATION_COMPLETE (foundation library)`
