# Phase B — Mirth Channel Import -> HAPI Transaction — التصميم

> 2026-06-23 | إثبات مسار FHIR Bundle عبر قناة (channel) إلى HAPI محلي. dummy فقط، loopback، بلا PHI/شهادات/طرف خارجي/ربط إنتاجي.

## المقاربة (Option B + C، مع احترام حدود المصادقة)
- **النشر الفعلي للقناة داخل Mirth** يتطلّب مصادقة admin على Mirth API ⟹ صُنّف **CANDIDATE_READY_PENDING_OWNER_ADMIN_AUTH** (لا تجاوز للمصادقة، لا تمرير اعتمادات).
- **أُثبت مسار البيانات end-to-end فعلياً** عبر **channel relay محلي** ينفّذ منطق القناة `SBX_FHIR_BUNDLE_IN` نفسه مقابل **HAPI الحقيقي** (loopback): استقبال Bundle → filter(type=transaction) → HTTP-send إلى `/fhir` → transaction-response → read-back؛ الرسالة الفاسدة → DLQ.
- أُنتج **artifact قابل للاستيراد**: `tools/mirth-sandbox/SBX_FHIR_BUNDLE_IN.channel.xml` (HTTP Listener 127.0.0.1:6663 → HTTP Sender إلى `http://127.0.0.1:8090/fhir`).

## مكوّنات القناة SBX_FHIR_BUNDLE_IN
| المكوّن | الوصف |
|---|---|
| Source | HTTP Listener **loopback** `127.0.0.1:6663/sbx/fhir-bundle` (أو ملف محلي) |
| Filter | يقبل فقط `resourceType=Bundle && type=transaction` |
| Destination | HTTP Sender → HAPI المحلي `/fhir` (application/fhir+json) |
| Error/DLQ | الرسالة غير المطابقة → مجلد dead-letter |
| Retry | queue + retryCount=3 (محدود) |
| Audit | metadata فقط، **بلا محتوى PHI** |

## الملفات (sandbox، غير مربوطة بالإنتاج)
- `tools/mirth-sandbox/SBX_FHIR_BUNDLE_IN.channel.xml` — قناة candidate للاستيراد (تُراجَع ضد نسخة Mirth الفعلية).
- `tools/mirth-sandbox/channel_relay.js` — relay يثبت مسار البيانات مقابل HAPI الحقيقي (loopback).

## ضوابط
loopback فقط؛ dummy فقط؛ لا PHI/شهادات/NPHIES/طرف خارجي؛ لا ربط route/nginx/PM2/DB إنتاج؛ تفكيك الحاويات بعد الاختبار؛ لا تجاوز مصادقة Mirth.
