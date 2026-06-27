# تنفيذ تدوير الأسرار — Option A (Owner-Run · NO PUSH · NO HISTORY REWRITE)

**المشروع:** NamaMedical / الطبيب
**الفرع:** `audit/phase-1-critical-remediation`
**التاريخ:** 2026-06-27
**الموافقة:** `APPROVE_OPTION_A_IMMEDIATE_SECRET_ROTATION_FIRST` · PUSH=NO · HISTORY_REWRITE=NO · DEPLOY=NO إلا restart مُتحكَّم بموافقة المالك · `PRODUCTION_SECRET_ROTATION_OWNER_RUN_ONLY: YES`

> صرامة: لم تُطبع أي قيمة سرّ، ولم يُقرأ `.env` لقيمه، ولا قيمة في هذا التقرير أو في Git أو في terminal.

---

## 1. السبب

تقرير البوابة السابق (`OWNER_SECRET_ROTATION_AND_REMOTE_PUSH_DECISION_REPORT_AR.md`، root `9f18518`) أثبت أن فرع **namaweb منشور علناً** على `origin` (`github.com/ialqrashi62/namawab`) عند `44f8178`، وأن أسلافه تحمل التاريخ القديم الحامل للأسرار → **الأسرار التاريخية مكشوفة عملياً**. لذلك التدوير **عاجل** وأولوية على أي نشر.

---

## 2. الوضع الحالي (بلا قيم)

- **current tree نظيف:** `no_hardcoded_secrets` 14/14 · `tracked_secret_redaction` 2/2 (4805 ملف).
- **التخزين:** `namaweb/.env` (غير متتبَّع، gitignored) · `~/nama_medical_app_db_password` · `pgpass.conf` (خارج المستودع). لا PM2 ecosystem · لا CI · لا أسرار متتبَّعة.
- **E2E:** `e2e_local_smoke_test.js` يقرأ كلمة المرور من **env** (`.env.e2e.example` placeholder)؛ 0 قيمة مزروعة.

---

## 3. حالة التنفيذ — مُعَدّ للمالك، لم يُنفّذه الوكيل

**لم يُنفّذ الوكيل أي تدوير.** السبب (Gate 3): لا اعتمادات admin لـMSSQL/PostgreSQL لدى الوكيل، والـshell غير تفاعلي (إدخال سرّ المالك يُعلّقه)، وتوجيه المالك صريح: **التدوير الإنتاجي يُشغّله المالك فقط**. أدناه runbook دقيق ينفّذه المالك في terminal خاص به.

> مبدأ التوليد الآمن لكل القيم: استخدم **CSPRNG فقط** (`openssl rand` أو Node `crypto.randomBytes`) — **لا `Math.random`**. لا تُظهر القيمة في stdout/سجلات/الدردشة؛ اكتبها مباشرة إلى مخزن الأسرار. اعتبر كل قيمة سبق التزامها **محروقة**.

### 3.1 MSSQL `sa`
1. تأكّد أولاً هل MSSQL مُستخدَم إنتاجياً فعلاً (التطبيق يعمل على PostgreSQL؛ سكربتات `restore_db.sh`/`configure_sql.sh`/`fix_ldap.sh` قد تكون إرثية). إن لم يُستخدَم → **عطّل/ألغِ تسجيل `sa`** بدل التدوير.
2. وَلِّد كلمة مرور قوية محلياً (دون طباعتها لسجلات مشتركة).
3. طبّق على الخادم: `ALTER LOGIN [sa] WITH PASSWORD = N'…';` (بحساب admin الحالي).
4. حدِّث `MSSQL_SA_PASSWORD` في مخزن الأسرار/البيئة فقط (لا Git).
5. تحقّق باتصال دخان لا يطبع القيمة (`sqlcmd -Q "SELECT 1"` بمتغير بيئة).
6. سجّل **الوقت والفاعل** — لا القيمة.

### 3.2 PostgreSQL (أدوار التطبيق)
1. حدِّد الأدوار النشطة: `SELECT rolname, rolsuper, rolbypassrls, rolcanlogin FROM pg_roles WHERE rolname IN ('nama_medical_app','namasoft','nama_app_user');`
2. وَلِّد كلمة مرور جديدة (CSPRNG، دون طباعة).
3. طبّق: `ALTER USER nama_medical_app WITH PASSWORD '…';` (وأي دور تطبيق نشط آخر).
4. أكِّد بقاء **NOBYPASSRLS** وعدم superuser: `ALTER USER nama_medical_app NOSUPERUSER NOBYPASSRLS;` (idempotent).
5. حدِّث `DB_PASSWORD` في `namaweb/.env` + `~/nama_medical_app_db_password` + `pgpass.conf` (خارج Git).
6. تحقّق: اتصال دور التطبيق ينجح ويرى صفوف tenant-scoped فقط (harness القائم) — **لا schema change عدا كلمة المرور**.
7. سجّل الوقت والفاعل — لا القيمة.

### 3.3 JWT_SECRET + SESSION_SECRET
1. وَلِّد قيمتين عاليتي الإنتروبيا (مثل `openssl rand -hex 32` / `crypto.randomBytes(48)`) دون طباعة لسجلات مشتركة.
2. حدِّث `SESSION_SECRET` (و`JWT_SECRET` حيثما يُستهلَك في سكربتات النشر) في مخزن الأسرار/`.env`.
3. **الأثر:** تدوير `SESSION_SECRET` يُبطِل كل الجلسات القائمة (إعادة تسجيل دخول)، و`JWT_SECRET` يُبطِل التوكنات الصادرة.
4. **إعادة تشغيل مُتحكَّمة فقط بموافقة المالك** (التطبيق يرفض الإقلاع بالإنتاج بلا `SESSION_SECRET`، فيلتقط القيمة الجديدة عند الإقلاع).

### 3.4 E2E TEST_PASSWORD
1. دوِّر كلمة مرور حساب الاختبار في `system_users` (أو عطِّل/استبدل حساب الاختبار).
2. حدِّث مخزن الأسرار المحلي فقط؛ الـharness يقرأ من env (مؤكَّد، 0 مزروعة).
3. لا كلمة مرور مزروعة.

---

## 4. التحققات (ما يمكن إثباته بلا أسرار)

| الفحص | النتيجة | ملاحظة |
|---|---|---|
| current-tree secret scan | CLEAN (14/14) | بلا أسرار متتبَّعة |
| tracked_secret_redaction | CLEAN (2/2، 4805 ملف) | — |
| E2E password env-driven | نعم | لا قيمة مزروعة |
| PostgreSQL NOBYPASSRLS بعد التدوير | **يتحقّقه المالك** | يحتاج اتصال DB (خارج صلاحية الوكيل) |
| app health smoke | **بعد restart مُصرَّح فقط** | لم يُجرَ restart |

---

## 5. القرار المتبقّي (بعد إتمام التدوير)

نشر namaweb يبقى **محظوراً** حتى تُحسَم استراتيجية الـremote العام:
1. **تطهير تاريخ namaweb العام** (history purge + force-push) — موافقة مالك منفصلة.
2. أو **النقل إلى remote خاص نظيف**.
3. أو **أرشفة/حذف الـremote العام**.

> حتى بعد التدوير تبقى القيم القديمة مكشوفة في التاريخ العام؛ التدوير يُبطِل ضررها لكن الإغلاق الكامل يتطلب أحد الخيارات الثلاثة.

---

## 6. تأكيدات السلامة

لا قيمة سرّ مطبوعة/في التقرير/في Git/في terminal · لا قراءة قيم `.env` · لا تعديل `.env` متتبَّع · لا إضافة `.env` لـGit · لا push · لا force push · لا history rewrite · لا filter-repo/BFG · لا حذف/نقل remote · لا DDL عدا تدوير credential (إن نُفِّذ owner-run) · لا H9/H10 · لا GL/journal · لا Phase 3 · لا production touch بواسطة الوكيل.

**الحالة:** runbook جاهز — **التنفيذ الإنتاجي معلّق على تشغيل المالك** (يتطلب اعتمادات المالك). بعد التدوير: قرار استراتيجية الـremote.
