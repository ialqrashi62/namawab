# Wave 2 — Mirth/NextGen Local Runtime Sandbox

> 2026-06-23 | شُغّل Mirth Connect فعلياً محلياً (loopback)، dummy، ثم فُكّك. الإنتاج بقي 200.

## ما نُفِّذ
- **سحب الصورة** `nextgenhealthcare/connect:latest` (موافقة المالك).
- **تشغيل loopback**: `docker run -e DATABASE=derby -p 127.0.0.1:8443:8443` (تأكيد الربط: `8443/tcp -> 127.0.0.1:8443` — لا `0.0.0.0`؛ تخزين Derby مدمج، بلا DB إنتاج).
- **الحالة**: الحاوية `running`؛ الواجهة على HTTPS:8443 ردّت صفحة HTML (TLS handshake نجح، صفحة الإدارة). نقطة `/api/server/version` لم تُرجع 200/401 ضمن نافذة ~150ث (تتطلّب مصادقة/ترويسات admin محدّدة + إقلاع Java أطول).
- **التفكيك**: `docker stop/rm`؛ الإنتاج 200 بعدها.

## التحقّق
| الفحص | النتيجة |
|---|---|
| container starts | PASS (state=running) |
| admin UI local only (HTTPS loopback) | PASS (صفحة HTML على 127.0.0.1:8443) |
| dummy channel import candidate | موثّق candidate (يتطلّب admin auth + إعداد قناة — بوابة لاحقة) |
| D1 simulator remains 7/7 PASS | PASS (regression) |
| no public exposure | PASS (loopback فقط) |
| no PHI / no certs / no external endpoints | PASS |
| production health throughout | PASS (200) |

```text
MIRTH_STATUS: STARTED_AND_HTTPS_RESPONDING (loopback admin page); deeper admin-API/channel config = follow-up gate
IMAGE_PULL: executed (owner-approved) | PUBLIC_EXPOSURE: NO | REAL_PHI: NO | CERTS: NO | TORN_DOWN: YES
```

## ملاحظة
منطق القنوات (استقبال/تحويل/DLQ/retry/audit) مُثبت أصلاً بمحاكي D1 المحلي (7/7). تشغيل Mirth الحقيقي هنا أثبت الإقلاع + خدمة HTTPS على loopback؛ استيراد قناة dummy فعلية واختبار تدفّق رسالة عبرها = بوابة تنفيذ لاحقة (تتطلّب admin auth وإعداد قناة)، مع نموذج الأسرار للمرحلة 2 لأي mTLS مستقبلي.
