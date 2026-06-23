# إصلاح XSS — Layer 2 (المُصيّرات المخصّصة / البطاقات / النوافذ) — تقرير

> 2026-06-23 | تنفيذ `APPROVE_FIX_XSS_LAYER2_CUSTOM_RENDERERS`. تهريب كل بيانات API/DB/المستخدم في مُصيّرات HTML المخصّصة خارج `makeTable`/`createTable` داخل `namaweb/public/js/app.js`. **client فقط — لا server.js، لا PM2 restart، لا DB/DDL/محاسبة، لا Gate 3/CORS/CSRF/CSP.** أُنجز في worktree معزول ثم طُبّق حيّاً ذرّياً بعد الفحوص.

## الحالة النهائية
**`LAYER2_XSS_CUSTOM_RENDERERS_FIXED_LIVE`** — حُصِر المسح المنهجي للبواقي على عناصر آمنة فقط (أرقام/تواريخ منسّقة/إعدادات ثابتة/مُهرّبة عند المصدر). الإصلاح حيّ عبر الخدمة الساكنة (static serving) دون إعادة تشغيل.

## المهارات الفعلية المفعّلة
قُرئ `.ai-brain/skills/nama-medical/NM_SKILLS_INDEX_AR.md`: `NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`. لا مهارة جديدة/مخترعة.

## المنهجية
1. **مسح كامل** لكل مواضع الإقحام الخام (`${...}` و`+ x.field +`) خارج `makeTable`/`createTable`.
2. أُضيفت دوال تهريب سياقية: `safeId` (تحويل المعرّفات الرقمية في onclick/data-id إلى Number أو '') · `safeUrl` (تحقّق scheme آمن لـ href/src، رفض javascript:/data:) · `jsStr` (تهريب سلسلة JS داخل سمة HTML).
3. تهريب كل حقول البيانات بـ `escapeHTML`، وتحويل 9 معالجات onclick من النمط الخطير `.replace(/'/g,...)` إلى `safeId`/`jsStr`.
4. حلقة تقارب: إعادة المسح حتى لم يتبقَّ إلا عناصر آمنة مصنّفة.

## sinks — قبل/بعد
- **قبل:** `escapeHTML` مستخدمة 20 مرة؛ 152 بانية `.map().join`؛ 167 إسناد innerHTML؛ 9 معالجات onclick بنمط `.replace(/'/g)` خطير؛ ~85+ إقحام بيانات PHI خام.
- **بعد:** `escapeHTML` مستخدمة **373** مرة؛ **0** معالج onclick بنمط `.replace(/'/g)`؛ بواقي المسح المنهجي = عناصر آمنة فقط.

## sinks المُصلَحة (~115 عبر الملف، حسب المجال)
- **المختبر/الأشعة:** جداول الطلبات (معرّفات، نتائج، أنواع، تواريخ)، `printLabReport`/`printInvoice`، باركود، نوافذ النتائج.
- **الطوارئ/ER:** صفوف الفرز (patient_name، chief_complaint، assigned_doctor، diagnosis)، نقل/خروج، خرائط الأسرّة.
- **الحمل/النساء، اللياقة/الإجازات، التقارير الطبية:** `renderOBGYN`، `printMedicalReport`، شهادات.
- **الفوترة/الحسابات:** `printPatientStatement`، نوافذ الفواتير، كشوف.
- **الإقرارات (consent):** الأسماء، الشهود، تفاصيل الإجراء، صورة التوقيع (data-URL → escapeHTML).
- **العيادة/التمريض/الصيدلية:** بطاقة الاتصال بالمريض، طابور، العلامات الحيوية، الحساسية/الأمراض المزمنة/الأدوية، صرف الأدوية، تنبيهات التفاعل/الحساسية الدوائية.
- **بنك الدم، التنويم/ADT/ICU، الموردون، الكتالوجات، الجودة/الصيانة/النقل، التجميل، سجل التدقيق، المراسلات، إدارة المستخدمين.**

## raw HTML المُراجَع
- لم تُستخدم `rawHtml` لأي بيانات (القاعدة 9 محترمة). الإضافة الوحيدة المحتوية على `rawHtml` كانت زرّ `makeTable` موجوداً مسبقاً (administerMed)، وبياناته الآن مُهرّبة عبر `jsStr`/`parseInt` (القاعدة 5).

## الإقحام الخام المتبقّي (مُصنّف آمن — لا يحتاج تغيير)
- أرقام/إحصاءات محسوبة (`stats.*`، `census.*`، `.toFixed`/`.toLocaleString`/`Number`/`parseFloat`).
- تواريخ منسّقة (`new Date(...).toLocale*`).
- إعدادات ثابتة مُضمّنة في الكود (قوائم checklist الامتثال/ما قبل الجراحة، أيقونات NAV، خرائط الألوان/الحالات).
- تعبيرات ternary تُخرج رموزاً/حروفاً ثابتة فقط (✅/⏳/👨/👩).
- قيم مُهرّبة عند المصدر الفعلي: `events[].detail` (يُهرّب عند sink السطر 3260)، `showToast(msg)` (يُهرّب داخلياً)، خلايا `makeTable` (تُهرّب عبر `cellHtml`).
- روابط `fetch()` المبنية بـ `encodeURIComponent` (لا تُحقَن في DOM).
- خلايا CSV (سياق غير-HTML).
- 4 حالات `escapeHTML(tr(...))` صحيحة: وسيط `tr` يحوي بيانات (`'ESI '+v.triage_level`، `k.status`، `i.severity`) فيُهرَّب الناتج.

## الملفات المعدّلة
- `namaweb/public/js/app.js` فقط (+407/-401). `admin.js` نظيف (لا تغيير).

## نتائج الفحوص
`node --check` app.js + admin.js = OK · diff --check نظيف · secrets scan = لا تطابق · mojibake (U+FFFD/Latin-1) = 0 · معالجات onclick خطيرة متبقّية = 0 · double-escape = 0 · escapeHTML(tr()) المُساء = 0 · `rawHtml` على بيانات = 0.

## live smoke
طُبّق ذرّياً (نسخ إلى ملف مؤقت في الدليل الحيّ ثم rename فوق app.js). بعد التطبيق: health=200 · login=200 · `/js/app.js`=200 · الملف المُقدَّم يحوي `safeId`/`safeUrl`/`jsStr` (3/3) وعدّ `escapeHTML`=373. **PM2 لم يُعَد تشغيله** (restarts=4 دون تغيير، تغيير client ساكن لا يحتاج restart).

## الحقول
```text
FINAL_STATUS: LAYER2_XSS_CUSTOM_RENDERERS_FIXED_LIVE
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
SINKS_BEFORE_escapeHTML_USES: 20 | SINKS_AFTER_escapeHTML_USES: 373
UNSAFE_ONCLICK_REPLACE_HANDLERS: 9 -> 0
SINKS_FIXED: ~115 (incl. lab/radiology, ER, billing, consent, vitals, nursing, pharmacy, blood bank, ADT/ICU, suppliers, catalogs, audit)
SINKS_REMAINING: 0 unsafe (residual interpolations all safe-classified: numerics/dates/static-config/escaped-at-sink/makeTable/fetch-url)
RAW_HTML_REVIEWED: 1 pre-existing makeTable button (administerMed), data inside escaped via jsStr/parseInt
RAW_DATA_INTERPOLATION_REMAINING: none unescaped (safe-skip only)
FILES_MODIFIED: namaweb/public/js/app.js
PM2_RESTARTED: NO
GATE3_EXECUTED: NO
LAYER2_XSS_EXECUTED: YES
HTTP_PERIMETER_CHANGED: NO
DB_CHANGED: NO
DDL: NO
DATA_CHANGED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
MOJIBAKE_AUDIT: CLEAN
AUTHENTICATED_BROWSER_SMOKE: PENDING_OWNER
GIT_PARENT: 9631e35 -> (this report commit)
GIT_COMMIT: namaweb 5a5d216 / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: AUTHENTICATED_BROWSER_SMOKE (المالك) ثم APPROVE_FIX_HTTP_PERIMETER_VALIDATE (CORS/CSRF/CSP)
```

أُصلحت ثغرات XSS Layer 2 في المُصيّرات المخصّصة عبر تهريب كل بيانات API/DB/المستخدم؛ التغيير client فقط، حيّ عبر الخدمة الساكنة، بلا إعادة تشغيل أو مساس بـ server/DB/المحاسبة. يلزم فحص متصفّح مُصادَق من المالك للتأكيد البصري.
