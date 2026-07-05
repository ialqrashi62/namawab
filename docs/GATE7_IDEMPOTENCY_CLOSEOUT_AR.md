# تقرير إغلاق Gate 7 — Idempotency لنقاط المال/المطالبات (آخر بوابات موجة العزل)
**التاريخ:** 2026-07-03  •  **الحالة:** ✅ ناجح  •  **Commit محلي:** namaweb `f5a445c` على `integration/all-epics` (لا push، لا DDL، لا نشر)

## المشكلة (من Gate 0)
تقديم المطالبة، تقديم ZATCA، وترحيل التحصيل (post-to-ar) **بلا مفاتيح idempotency** — نقرة مزدوجة أو إعادة محاولة من العميل أو سباق شبكي قد تُنشئ **مطالبات مكرّرة** أو **ترحيل AR مزدوج**. الأسوأ: حارس idempotency جاهز وناضج (`idempotency.js` + جدول `idempotency_keys` بـRLS من e23) لكنه **غير موصول بأي نقطة**.

## ما نُفّذ (توصيل، بلا DDL)
وصّلت الحارس (opt-in + fail-open) في **النقاط الأربع** المُحوِّلة للمال/المطالبات:
- `POST /api/insurance/claims` (إنشاء مطالبة)
- `PUT /api/insurance/claims/:id/transition` (submit / remittance_posted)
- `POST /api/zatca/submit`
- `POST /api/nphies/remittance/:id/post-to-ar`

### لماذا هو آمن (تغيير سلوكي صفري للعملاء الحاليين)
- **Opt-in**: لا ينشط إلا عند إرسال العميل ترويسة `Idempotency-Key` — الطلبات بلا ترويسة تمرّ كما هي.
- **Fail-open**: أي خطأ في جدول التخزين → يُسجّل ويُكمل (لا يحجب الفوترة على عطل بنية تحتية).
- **إعادة التشغيل (Replay)**: مفتاح مكتمل مكرّر → يُرجع الاستجابة المخزّنة مع `Idempotent-Replay: true` **بلا إعادة تنفيذ المعالج** (لا صف مكرّر).
- **سباق متزامن**: `UNIQUE(tenant_id, idem_key, route)` هو حَكَم السباق → 409 `IDEMPOTENCY_CONFLICT`.
- **5xx**: يُحذف المفتاح (قابل لإعادة المحاولة بأمان).
- الاختبارات التكاملية (DB-gated) لا ترسل الترويسة → تمرّ بلا تغيّر.

## الأدلة
- اختبار idempotency النقي: **36/36 PASS** • الحزمة الآمنة: **108/108 PASS** • `node --check` سليم • تأكيد التوصيل في النقاط الأربع بـgrep.

## موجة العزل (Wave 2) اكتملت: G4 ✅ G5 ✅ G6 ✅ G7 ✅

| Gate | الموضوع | Commit |
|---|---|---|
| G4 | أسبقية الجلسة على x-tenant-id | `872ea35` |
| G5 | RLS جداول e21 (كود + مرشّح e50) | `de3ddd8` |
| G6 | إصلاح فقدان بيانات OB (حجب المسار) | `e251b8b` |
| G7 | Idempotency للمال/المطالبات | `f5a445c` |

## التالي — الموجة 3 (الامتثال السعودي)
**Gate 8:** مطابقة حزم NPHIES لبروفايلات KSA (Bundle=message + MessageHeader + امتدادات + SBS/ICD-10-AM)، ثم **Gate 9** تضمين توقيع ZATCA في UBL (XAdES/SignedProperties)، ثم **Gate 10** إغلاق دورة الإيراد charge→claim→remittance→GL.
