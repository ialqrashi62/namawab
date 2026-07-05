# تقرير حظر Gate 9 — تضمين توقيع ZATCA في UBL (XAdES)
**التاريخ:** 2026-07-03  •  **الحالة:** ⛔ محظور (حظر تحقّق، لا حظر بناء)  •  لم يُكتب أي كود لهذا الـGate

## الوضع الحالي (مؤكّد بالقراءة)
- `zatca_phase2.js`: التشفير **حقيقي** — `invoiceHash` (SHA-256 base64)، `signHashECDSA`/`verifyHashECDSA` (ECDSA secp256k1)، سلسلة PIH (`GENESIS_PIH`/`nextPih`)، `buildPhase2QR` (9 وسوم TLV)، `generateKeyPair`/`publicKeyDer`/`generateCsrConfig`.
- `finance_engine.js:208`: UBL يحمل **placeholder فقط**: `<cac:Signature><cbc:ID>UNSIGNED-NO-CSID</cbc:ID></cac:Signature>` — التوقيع غير مُضمَّن.

## سبب الحظر (حظر حقيقي على التحقق من الصحة)
تضمين توقيع ZATCA Phase-2 الصحيح يتطلب `<ext:UBLExtensions>` يحوي `<ds:Signature>` مع `<ds:SignedInfo>` + `<ds:SignatureValue>` + `<ds:KeyInfo>` (شهادة X509) + `<xades:QualifyingProperties>` → `<xades:SignedProperties>` (وقت التوقيع، digest الشهادة، المُصدِر/الرقم التسلسلي). صحة هذا مشروطة بأمور **غير متوفرة محليًا**:
1. **قواعد C14N الرسمية من ZATCA** بالضبط (استبعاد UBLExtensions/QR/Signature من نطاق hash الفاتورة) — أي انحراف يُنتج توقيعًا ترفضه المنصّة.
2. **شهادة CSID** من إعداد ZATCA (Onboarding) لملء KeyInfo وdigest الشهادة — غير موجودة (المسار الحقيقي مُبوّب خلف `ZATCA_ENABLED` + settings).
3. **متجهات اختبار ZATCA المعتمدة** للتحقق أن الـXML المُوقّع صحيح.

**بلا (2) و(3) لا يمكن إثبات صحة أي XML مُوقّع أُنتجه** — وإنتاج XML "يبدو موقّعًا" لكن ترفضه ZATCA **أسوأ من placeholder صادق** (ثقة امتثال زائفة تخالف مبدأ «أصغر تغيير آمن»).

## ما هو متاح دون كسر المبدأ (بانتظار قرارك)
يمكنني بناء **سقالة XAdES بنيوية نقية ومختبَرة** (مثل نهج Gate 8): دالة `buildUBLSignatureExtension(...)` تُجمّع شجرة `ds:Signature` + `xades:SignedProperties` من مدخلات حقيقية (hash، signature، cert)، تُوصَّل **فقط على مسار التوقيع الحقيقي** (عند توفّر cert + `ZATCA_ENABLED`)، مع إبقاء placeholder الصادق عند غيابها — **موسومة صراحة "سقالة غير مُعتمَدة"** حتى تتوفّر شهادة CSID ومتجهات ZATCA.

## المطلوب لرفع الحظر
- شهادة CSID من ZATCA (بيئة الاختبار/الإنتاج) — **لا تُشارك السر؛ تُوضع في settings المُبوّبة**.
- متجهات اختبار ZATCA الرسمية (أو الوصول إلى Fatoora SDK/simulator) للتحقق.
- قرارك: هل أبني «السقالة البنيوية غير المُعتمَدة» الآن (تحسين على placeholder، بلا ادعاء اعتماد)، أم نؤجّل Gate 9 كاملًا حتى تتوفّر الاعتمادات؟

## القرار التلقائي (Auto-Pilot)
لتجنّب حظر التقدّم: **أتخطّى Gate 9 مؤقتًا وأنتقل إلى Gate 10** (إغلاق دورة الإيراد charge→claim→remittance→GL) — قابل للتنفيذ بالكامل محليًا بلا اعتمادات خارجية — وأعود إلى Gate 9 عند توفّر شهادة/متجهات ZATCA أو موافقتك على السقالة.
