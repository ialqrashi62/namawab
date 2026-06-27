# A3A — PHI File Guard — إغلاق (OPTION_2: harness/static/Playwright، بلا كلمة مرور)

> 2026-06-22 | نُقلت ملفات أشعة PHI خارج الويب‑روت العام وصارت تُخدَّم فقط عبر مسار محمي tenant‑scoped. تُحقّق دون أي كلمة مرور في المتصفح ودون كشف أسرار. ملف اختبار وهمي غير‑PHI فقط. MFA لم تبدأ (بوابة منفصلة).

## ما نُفِّذ (backend فقط — الواجهة لم تتغيّر)
- **DDL**: نُفِّذ مُرشَّح `phi_files` (FORCE RLS + سياسة عزل المستأجر + `tenant_id`). FORCE_RLS: **149 → 150**. (نسخة قبلية + down.sql محفوظة في `C:\Users\ice\nama_deploy_backups\a3a_phi_guard_20260622\`.)
- **مجلد الرفع نُقل خارج public**: `public/uploads/radiology/` ⟶ `phi_vault/radiology/` (خارج الويب‑روت، غير مُخدَّم static، مُدرَج في `.gitignore` — لا يُلتزَم PHI أبداً).
- **مسار الرفع** (`POST /api/radiology/orders/:id/upload`): يحفظ الملف في الخزنة، يحسب `sha256`، يُسجّل صفاً في `phi_files` (tenant عبر RLS)، ويُضمّن في النتائج الوسم `[IMG:/api/phi-files/<id>]` (مسار محمي) بدل المسار العام.
- **مسار التنزيل المحمي** `GET /api/phi-files/:id`: `requireAuth` + عزل المستأجر عبر RLS (مستأجر آخر ⟶ لا صف ⟶ 404) + منع path‑traversal (`id` عدد صحيح فقط + `resolved.startsWith(vaultRoot)`) + تدقيق `PHI_FILE_DOWNLOAD`.
- **منع المسار العام القديم**: `app.all('/uploads/radiology/*', 404)` قبل static/SPA — أي URL مباشر للأشعة ⟶ 404 (ليس index.html).
- **الواجهة**: لا تغيير في app.js — الوسم `[IMG:...]` صار يحمل المسار المحمي؛ المتصفح يُرسل الكوكي تلقائياً (same‑origin) فيُحمَّل للمصرَّح فقط.

## التحقّق (OPTION_2 — بلا دخول مكتوب بكلمة مرور)
| الطبقة | النتيجة |
|---|---|
| node --check server.js | OK |
| static guard (a3a_phi_guard_test.js) | 10/10 PASS |
| harness API موثّق (e2e_doctor / e2e_t2user، قراءة الاعتماد داخلياً، طبع PASS/FAIL فقط) | **15/15 PASS** |
| Playwright navigation + browser fetch | login يُعرَض (RTL)؛ `/api/phi-files/1` غير مصادق ⟶ **401**؛ `/uploads/radiology/*` ⟶ **404**؛ لا يُخدَّم أي image |
| تنظيف | حُذف الملف الوهمي + صف phi_files + أمر الاختبار (phi_files=0، E2E orders=0، الخزنة فارغة) |

### تفصيل الـ15 فحص (harness)
doctor login (كوكي، غير مطبوع) · upload 200 · المسار المُعاد محمي `/api/phi-files/N` (ليس عام) · صف phi_files أُنشئ · الملف مُخزَّن **خارج** public داخل phi_vault · الملف موجود فعلياً · تنزيل الطبيب المصرَّح 200 · البايتات تطابق الملف الوهمي · غير‑مصادق ⟶ 401 · مستأجر آخر (tenant2) ⟶ 404 (RLS) · URL عام مباشر ⟶ 404 · path‑traversal id ⟶ ليس 200 · id غير رقمي ⟶ 404 · `UPLOAD_RADIOLOGY_IMAGE` مُدقّق · `PHI_FILE_DOWNLOAD` مُدقّق.

## الحقول
```text
FINAL_STATUS: A3A_PHI_FILE_GUARD_DEPLOYED_AND_VERIFIED_BY_OPTION2
OPTION_USED: SERVER_HARNESS_STATIC_PLAYWRIGHT_NAVIGATION_NO_SECRET_PRINT
PUBLIC_DIRECT_ACCESS_STATUS: DENIED_OR_NOT_FOUND (404)
AUTH_REQUIRED: YES (unauth -> 401)
TENANT_SCOPE_REQUIRED: YES (tenant2 -> 404 via RLS)
PATH_TRAVERSAL_STATUS: DENIED (integer-only id + vaultRoot prefix check)
PHI_STORED_OUTSIDE_PUBLIC: YES (namaweb/phi_vault/radiology, gitignored)
HARNESS_STATUS: 15/15 PASS
STATIC_GUARD_STATUS: 10/10 PASS
PLAYWRIGHT_MODE: navigation/snapshot + browser fetch (NO password fill)
PASSWORD_PRINTED: NO
SESSION_COOKIE_PRINTED: NO
CREDENTIALS_COMMITTED: NO
REAL_PHI_UPLOADED: NO (dummy 1x1 PNG only)
DDL_EXECUTED: YES (phi_files candidate)
FORCE_RLS: 150 (149 -> 150)
CODE_DEPLOYED: YES (namaweb 4fb13ae -> 46c14eb)
PM2_RESTARTED: YES
HEALTH_STATUS: local 200, domain 200
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
A3B_FREEZE_STATUS: LIFTED_FOR_GUARDED_UPLOADS_ONLY
PHI_UPLOAD_ALLOWED: YES_THROUGH_GUARDED_ROUTE_ONLY
A2_MFA_STARTED: NO
R17_BRANCH_MERGED: NO
FORCE_PUSH_USED: NO
GIT_COMMIT: namaweb 46c14eb + parent (gitlink+closeout)
GIT_PUSH: FF (namaweb origin/main + parent origin/master)
NEXT_RECOMMENDED_ACTION: APPROVE_OPTION2_A2_MFA_HARNESS_DEPLOY
```

## ملاحظات سلامة
- لم تُستخدم `browser_fill_form` لأي كلمة مرور؛ التحقّق طبقة‑الخادم (node قرأ الاعتماد داخلياً) + Playwright للعرض/الشبكة فقط.
- `phi_vault/` مُدرَج في `.gitignore` — لا يُلتزَم PHI إطلاقاً؛ النسخ المجدول (pg_dump) يغطي قاعدة البيانات، أما ملفات الخزنة فتحتاج لاحقاً نسخاً للملفات + تشفيراً عند الراحة (PHASE_A3 الكامل، KMS) — تبقى توصية مفتوحة.
- beta/R17 لم تُلمس؛ المحاسبة OFF؛ حسابات e2e_* المؤقتة قائمة لبوابة A2، تُحذف بعدها.
- المتبقّي: تشفير ملفات الخزنة عند الراحة + نسخ الملفات offsite (مُرشَّح PHASE_A3 الكامل)، وبوابة A2 MFA.

تم نشر حارس ملفات PHI (A3A) والتحقق منه عبر OPTION_2 دون كشف كلمات مرور أو رفع PHI حقيقي
