# سجل المخاطر والفجوات (Risks & Gaps Register)

> التاريخ: 2026-06-20 | الحالة الراهنة (ef1acf9). مرجع: [GLOBAL_AUDIT_12_GLOBAL_GAP_MATRIX_AR.md](GLOBAL_AUDIT_12_GLOBAL_GAP_MATRIX_AR.md).

| ID | الخطر/الفجوة | الفئة | الخطورة | الدليل | القرار |
| -- | ------------ | ----- | ------- | ------ | ------ |
| R1 | تباين RLS: توثيق يدّعي 115 جدولاً، الفعلي على الإنتاج 13 FORCE/14 ENABLE | عزل/أمن | **P1** | prod pg_class + docs commit 54549e1 | FIX_NOW — تحقق وتسوية |
| R2 | عزل ناقص: blood_bank/approvals/package_sessions (لا tenant_id/RLS) | عزل | **P1** | لا ALTER tenant_id | FIX_NEXT (Class A، DDL معلّق) |
| R3 | RLS DDL لموديولات Wave1 (medical_records/rehab/portal/dietary) غير منشور على الإنتاج | عزل | P1 | DDL ready, not deployed | FIX_NEXT (نشر مُعتمَد) |
| R4 | المحاسبة مُوصَّلة لكن OFF + CoA فارغة | تكامل مالي | P1 | flag OFF، CoA=0 | تفعيل محكوم (DDL+seed+موافقة) |
| R5 | rate limiter `/api` opt-in (غير مفعّل افتراضياً) | أمن | P1 | 9 refs، اختياري | تفعيل افتراضي |
| R6 | لا CSRF صريح | أمن | P1 | لا token | FIX_NEXT |
| R7 | لا قفل حساب بعد محاولات فاشلة | أمن | P1 | rate limit فقط | FIX_NEXT |
| R8 | اعتماد مزدوج للمختبر/الأشعة (verify/approve) | سلامة سريرية | P1 | منطق جزئي | FIX_NEXT |
| R9 | التأمين بلا EDI/NPHIES؛ المشتريات بلا 3-way match | منطق عمل | P1 | سجلات فقط | NEEDS_RESEARCH |
| R10 | لا SaaS provisioning/خطط/فوترة/usage | SaaS تجاري | P1 | بنية فقط | FIX_NEXT |
| R11 | wrapper اتصال-لكل-query (أداء عند الحمل) | أداء | P2 | P0 binding | IMPROVE_LATER (قياس) |
| R12 | activeSessions في الذاكرة (يكسر التوسّع الأفقي) | أداء/توسّع | P2 | server.js | FIX_NEXT |
| R13 | لا pagination/caching/job-queue | أداء/UX | P2 | — | IMPROVE_LATER |
| R14 | إتاحة WCAG/ARIA غائبة | UX/امتثال | P1 | الواجهة | FIX_NEXT |
| R15 | لا CI + إطار اختبار رسمي | جودة/DevOps | P1 | تشغيل يدوي | FIX_NEXT |
| R16 | لا مراقبة/تنبيه آلي + نسخ off-site مجدول + HA | تشغيل/DevOps | P1 | GLOBAL_AUDIT_07 | FIX_NEXT |
| R17 | بيئتان متوازيتان (Desktop\NamaMedical + 11\newfolder) تدفعان لنفس remote | DevOps/حوكمة | P1 | تضارب 28 commit حدث | توحيد العمل على نسخة واحدة |
| R18 | idempotency للمدفوعات/المحاسبة (لا فهرس فريد) | سلامة بيانات | P2 | لا source_type/id | DDL idempotency |
| R19 | soft-delete/audit columns (old_values/created_by) ناقصة | تتبّع/امتثال | P2 | المخطط | IMPROVE_LATER |
| R20 | تكاملات خارجية (SMS/دفع/HL7/FHIR/LIS/PACS/ZATCA Phase2) | تكامل/امتثال | P1 | GLOBAL_AUDIT_10 | NEEDS_RESEARCH |
| R21 | ملفات خارج النطاق غير ملتزمة (app.js/login.*/walkthrough/Stitch docs) | حوكمة | P3 | working tree | تنظيف/قرار |

## أعلى 5 (FIX_NOW/NEXT)
R1 (تباين RLS) · R2 (عزل بنك الدم) · R5 (تفعيل limiter) · R6/R7 (CSRF/قفل) · R17 (توحيد النسخ).

## نقاط القوة (تُحمى — لا تُعاد بناؤها)
العزل الأساسي + binding، استحقاقات نوع المنشأة fail-closed، SESSION_SECRET guard، Redis-required، least-privilege user، محرك ترحيل fail-closed، التوطين/Stitch، 24 ملف اختبار، 500+ تقرير + ذاكرة.

`RISKS_AND_GAPS_REGISTER_COMPLETE`
