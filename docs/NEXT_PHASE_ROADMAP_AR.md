# خارطة المرحلة التالية (Next Phase Roadmap)

> التاريخ: 2026-06-20 | مرجع: [GLOBAL_AUDIT_13_RECOMMENDED_ROADMAP_AR.md](GLOBAL_AUDIT_13_RECOMMENDED_ROADMAP_AR.md). مُرتّبة حسب الأولوية والمخاطر.

## المرحلة 1 — تسوية وأمان حرج (FIX_NOW)
| البند | السبب | الجهد | المخاطر |
| ----- | ----- | ----- | ------- |
| **تسوية تباين RLS (115 vs 13)** | ادعاء توثيقي لا يطابق الإنتاج | منخفض | عالٍ (وهم تغطية) |
| نشر RLS لموديولات Wave1 + معالجة Class A (بنك الدم/الموافقات/الباقات) | عزل ناقص | متوسط | عالٍ (DDL مُعتمَد) |
| تفعيل rate limiter `/api` افتراضياً + CSRF + قفل الحساب | تقوية أمنية | منخفض | متوسط |
| توحيد بيئة العمل على نسخة واحدة (`C:\Users\ice\Desktop\NamaMedical`) | منع تضارب multi-checkout | منخفض | متوسط |

## المرحلة 2 — إكمال المحاسبة المحكوم
- `P1_ACCOUNTING_DDL_AND_COA_SEED_READINESS` (خطة) → ثم بموافقة: DDL idempotency (source_type/source_id + فهرس فريد) + tenant_id لـ CoA + seed شجرة حسابات → تفعيل `ACCOUNTING_POSTING_ENABLED` تدريجياً (فاتورة/سند أولاً) + اختبارات DB + نشر محكوم.

## المرحلة 3 — جودة ومنتج
- إطار اختبار رسمي + CI (يشغّل cross_tenant_* + accounting + staging).
- اعتماد مزدوج للمختبر/الأشعة، FEFO للصيدلية، 3-way match للمشتريات.
- إتاحة WCAG/ARIA + بحث الموبايل + pagination + focus trap.
- نقل activeSessions لـ Redis (تمكين التوسّع) + pagination/caching/job-queue.
- مراقبة/تنبيه آلي + نسخ off-site مجدول + HA.

## المرحلة 4 — تكاملات وSaaS تجاري
- تذكير SMS، بوابة دفع (Mada/Moyasar)، ZATCA Phase 2، NPHIES، HL7/FHIR، LIS، PACS/DICOM.
- SaaS: provisioning + خطط/entitlements (مبني على facility_entitlements) + اشتراكات/فوترة/usage + super-admin control center.
- Stitch Batch A (استقبال/مواعيد/بوابة) عند توفّر MCP.

## المرحلة 5 — منافسة عالمية
- تحليلات تفاعلية + دعم قرار سريري (CDS) + AI (تنبؤ no-show/تحليل رفض مطالبات/تنبؤ مخزون).

## نقطة البداية الموصى بها
**المرحلة 1 / تسوية تباين RLS** (R1) — لأنها تكشف ما إذا كانت تغطية العزل المعلنة حقيقية، وهي شرط قبل أي توسّع متعدد المستأجرين.

`NEXT_PHASE_ROADMAP_COMPLETE`
