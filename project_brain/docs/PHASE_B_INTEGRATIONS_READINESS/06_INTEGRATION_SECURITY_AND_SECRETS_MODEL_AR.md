# Phase B — نموذج أمان التكامل والأسرار

> Discovery فقط. لا أسرار مطبوعة، لا مفاتيح مُلتزَمة، لا تغيير.

## الواقع الحالي
- `.env` يحوي 11 مفتاحاً فقط، **لا شيء منها لتكامل خارجي** (DB_HOST، REDIS_HOST، SESSION_SECRET + اعتمادات DB/NODE_ENV). الأسرار خارج Git (نمط ملفات: `nama_medical_app_db_password`، `pgpass.conf`).
- **لا آلية مفتاح/KMS at-rest** (نتيجة Gate 1 لـPhase A3): لا KMS، لا DPAPI مُهيّأ، لا مفتاح تشفير مخصّص.

## لماذا هذا حاجز لمعظم Phase B
كل التكاملات التنظيمية (**NPHIES، ZATCA Phase 2**) تتطلّب **شهادات/مفاتيح خاصة** + بيانات اعتماد منصّة. تخزين هذه نصاً على القرص أو في `.env` داخل المستودع = مخاطرة امتثال وسرقة. لذا **نموذج الأسرار يجب أن يُحسم قبل أي تكامل يحمل شهادة/مفتاح**.

## النموذج المقترح (موحّد مع تبعية A3)
1. **مخزن أسرار خارج Git** لكل اعتمادات التكامل (endpoints/clients/tokens) — نمط ملفات مقيّدة ACL خارج المستودع (كما DB password)، أو متغيّرات بيئة على مستوى الخدمة (ليست داخل repo).
2. **مفتاح/شهادة at-rest** (للختم التشفيري ZATCA + mTLS NPHIES + تشفير PHI): أحد خيارات A3 — ملف مفتاح يضعه المالك (مستثنى من النسخ)، أو Windows DPAPI، أو KMS سحابي. **نفس قرار A3 يخدم Phase B**.
3. **مبادئ**: لا مفتاح/سرّ في Git أو `.env` داخل المستودع؛ لا طباعة؛ تدوير (rotation) مخطّط؛ فصل بيئات sandbox/production؛ تدقيق كل استخدام للشهادة.
4. **عزل**: التكاملات الخارجية (HL7/FHIR/DICOM) يُفضّل تشغيلها كخدمة/محرّك منفصل لتقليل سطح الخطر على المونوليث الإنتاجي.

## الحقول
```text
EXTERNAL_SECRETS_PRESENT_NOW: NO
KMS_OR_AT_REST_KEY: NO (blocked — same as Phase A3)
SECRETS_PRINTED: NO | KEYS_COMMITTED: NO
DEPENDENCY: Phase B integrations carrying certs/keys (NPHIES, ZATCA Ph2) are BLOCKED until owner provisions the secrets/key model
RECOMMENDED_ORDER: secrets/key model -> low-risk no-cert candidate (FHIR sandbox) -> cert-bearing candidates
```

## الخلاصة
حسم نموذج الأسرار/المفتاح (المشترك مع A3) هو **الممكّن الأول** لـPhase B. التكاملات التي لا تحمل شهادة (مثل FHIR محلي تجريبي، أو محرّك تكامل داخلي) يمكن استكشافها أبكر؛ أما NPHIES/ZATCA Ph2 فمحجوبة على هذا القرار.
