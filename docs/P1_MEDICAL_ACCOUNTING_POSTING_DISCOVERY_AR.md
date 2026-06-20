# P1 الترحيل المحاسبي — 02 الاكتشاف (Discovery)

> التاريخ: 2026-06-20 | بحث code-first + فحص بيانات الإنتاج read-only.

## 1. البنية المحاسبية الموجودة (db_postgres.js)
8 جداول: `finance_chart_of_accounts`, `finance_journal_entries`, `finance_journal_lines`, `finance_fiscal_years`, `finance_cost_centers`, `finance_tax_declarations`, `finance_doctor_commissions`, `finance_vouchers`.

| الجدول | tenant_id؟ | ملاحظات |
| ------ | :--------: | ------- |
| finance_journal_entries | ✅ (+facility/branch) | entry_number/date/description/reference/is_auto/is_posted/created_by — **لا source_type/source_id** (لا idempotency بنيوي) |
| finance_journal_lines | ✅ | entry_id/account_id/debit/credit/cost_center_id |
| finance_chart_of_accounts | ❌ | عام (لا tenant_id) — account_code/name/type |
| finance_vouchers / doctor_commissions | ✅ | غير مستخدمة |

## 2. مسارات الـ API (server.js)
- `GET /api/finance/accounts`, `POST /api/finance/accounts`, `GET /api/finance/journal`, `GET /api/finance/vouchers`, `GET/POST /api/finance/daily-close`, `GET /api/finance/summary`.
- **لا يوجد** `POST /api/finance/journal` (لا إنشاء قيود عبر API).
- **لا ترحيل آلي**: فاتورة/سند/استرداد/مورّد لا تُنشئ قيوداً.

## 3. الدليل القاطع — لا محرك ترحيل
- `grep "INSERT INTO finance_(journal_entries|journal_lines|vouchers|doctor_commissions)"` في server.js/seed/db → **NONE**.
- مسارات posting/journal/ledger/debit/credit في server.js: المرجع الوحيد هو `GET /api/finance/journal` (قراءة) — صفر كتابة.
- `POST /api/invoices`: يُنشئ صف invoices فقط + logAudit؛ **لا قيد محاسبي**.
- **لا CoA seed** في الكود.

## 4. حالة بيانات الإنتاج (read-only)
| الجدول | عدد الصفوف على الإنتاج |
| ------ | --------------------- |
| finance_chart_of_accounts | **0** (شجرة حسابات فارغة) |
| finance_journal_entries | **0** |
| finance_journal_lines | **0** |
| finance_vouchers | **0** |
| invoices | 3 (تُنشأ لكن لا تُرحَّل) |

## 5. الخلاصة
**لا يوجد محرك ترحيل محاسبي إطلاقاً**؛ الجداول هيكل خامل بلا بيانات (CoA فارغة) ولا منطق. الفجوة شاملة (P1). التفعيل يتطلب: تعبئة CoA (بيانات) + idempotency (DDL) + كود محرك + ربط مسارات + نشر. لذا قُسّمت المرحلة: **هذه = تدقيق + أساس code-first مُختبَر + خطة**، والتفعيل الفعلي في مراحل فرعية مُعتمَدة.

`DISCOVERY_COMPLETE`
