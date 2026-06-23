# خطة الانتقال من Vault Staging إلى Production — Plan-Only — تقرير

> 2026-06-23 | تنفيذ `APPROVE_VAULT_STAGING_TO_PRODUCTION_DEPLOYMENT_PLAN_ONLY`. **خطة/وثائق فقط.** لا نشر Vault production، لا تشغيل Docker/حاويات، لا re-wrap، لا KEK/DPAPI/escrow، لا تغيير إنتاجي، لا ZATCA/NPHIES.

## الحالة النهائية
**`VAULT_STAGING_TO_PRODUCTION_DEPLOYMENT_PLAN_READY`** — خطة انتقال جاهزة للمراجعة، قرارها الموصى به = **مضيف معزول (dedicated host)**. لا تفويض لأي نشر؛ كل تنفيذ خلف بوابة منفصلة.

## المهارات الفعلية المفعّلة
`NM_GLOBAL_GATES` · `NM_SECURITY_DR_KEY_MANAGEMENT` · `NM_OBSERVABILITY_OPS` · `NM_INTEGRATION_SANDBOX` · `NM_FINANCE_ACCOUNTING_GUARD` · `NM_GOVERNANCE_CLOSEOUT`.

## مراجعة أثر Docker Bounce (Gate 1 — لا تهوين)
**واقعة مثبتة (2026-06-23):** نشاط Docker الثقيل أثناء نشر Vault staging (سحب صورة + دورات حاويات) أعاد تشغيل محرّك Docker Desktop، فارتدّت **كل** الحاويات معاً — ومنها **`nama-redis`** (مخزن جلسات الإنتاج) — وأُعيد تشغيل عملية التطبيق (pid 46172→96016، عدّاد restart=0). تعافى آلياً (health/login 200، Redis reconnected)، والـDB أصلية (PostgreSQL خارج Docker) لم تتأثّر.
**الدلالة (بلا تخفيف):** على هذا single-box، Vault/أي حاوية sandbox **مقترنة بالإنتاج عبر محرّك Docker المشترك**؛ نشر Vault على نفس الصندوق يهدّد استمرارية الجلسات والخدمة. ⟹ **العزل ليس تحسيناً اختيارياً بل شرط سلامة.**

## 1) قرار البنية التحتية
| الخيار | الوصف | التقييم |
|---|---|---|
| **A) مضيف/VM معزول** | Vault production على خادم/VM منفصل عن صندوق التطبيق | **موصى به** — يلغي اقتران Docker/Redis/app؛ لا ارتداد مشترك؛ حدود شبكة نظيفة |
| B) نفس الصندوق + نافذة صيانة صارمة | Vault على نفس الصندوق داخل نافذة معلنة | مقبول فقط كحل مؤقت؛ يبقى خطر ارتداد Docker للجلسات؛ يتطلب إعلان توقف |
| C) Managed/external Vault | خدمة مُدارة لاحقاً | مؤجّل — يتطلب تقييم امتثال/سيادة بيانات صحية + اتصال خارجي |
**القرار الموصى به: A (مضيف معزول).** السبب: الواقعة أعلاه تثبت أن B يعرّض الإنتاج لارتداد غير مباشر؛ A يفصل دورة حياة Vault تماماً عن `nama-redis`/`nama-app`.

## 2) Production Architecture (تصميم)
- **topology:** Vault على مضيف معزول؛ هدف 3 عُقد raft (quorum يتحمّل فقد عقدة)؛ مرحلة أولى عقدة واحدة + snapshot offline (قيد توافر موثّق).
- **عزل الشبكة:** شبكة إدارة خاصة؛ التطبيق→Vault:8200 (TLS) فقط، raft:8201 بين العُقد؛ منع وصول عام.
- **firewall:** سماح صريح للمنافذ المذكورة فقط؛ رفض ما عداه؛ لا تعريض إنترنت.
- **TLS:** listener TLS فقط (لا HTTP)، CA داخلي، tls_min_version=tls12+، تدوير شهادات مجدول.
- **raft/HA:** Integrated Storage؛ HA عند توفّر العُقد.
- **audit:** file device + شحن مركزي؛ HMAC redaction؛ تدوير + احتفاظ.
- **backup:** raft snapshot مجدول + قبل كل ترقية؛ تخزين مشفّر ACL-مقيّد offline.
- **إشراف الخدمة:** خدمة مُدارة Restart=on-failure؛ مستخدم خدمة أقل امتياز.
- **monitoring:** sealed-state، فشل unseal، أخطاء audit، صحة العقدة، تنبيهات.
- **upgrade/rollback:** إصدار مثبّت (لا latest؛ مرجع staging = v1.18.5)؛ snapshot قبل الترقية + اختبار unseal + rollback لإصدار سابق بنفس snapshot.

## 3) Deployment Prerequisites
مضيف معزول جاهز (أو نافذة صيانة معلنة لو اضطُر للخيار B) · backup مُتحقَّق · **KEK escrow مُتحقَّق ✅ (مُغلق metadata-only)** · rollback plan · DNS/endpoint داخلي · TLS CA · قواعد firewall · اعتماد runbook · حضور المالك.

## 4) قواعد عدم التأثير على الإنتاج
- **لا عمليات Docker ثقيلة على الصندوق المشترك بلا نافذة** (الدرس المثبت).
- لا restart للتطبيق · لا restart لـRedis · لا PM2 restart · لا تغيير DB · لا أسرار في السجلّات · لا tokens في git.

## 5) Production Smoke Plan (بعد النشر المعزول، بوابة لاحقة)
Vault status (unsealed) · TLS (HTTPS+CA=200، HTTP مرفوض، بلا CA مرفوض) · audit enabled · raft snapshot ينجح · policy smoke (`nama-app-kek` least-privilege) · **dummy transit roundtrip فقط** · لا KEK حقيقي · لا DPAPI · لا escrow · لا re-wrap.

## 6) Risk Register
| الخطر | التخفيف |
|---|---|
| ارتداد محرّك Docker | **عزل على مضيف منفصل** (الأساس)؛ أو نافذة صيانة |
| انقطاع Redis/الجلسات | العزل يمنع الاقتران؛ DPAPI fallback للتطبيق يبقى أثناء أي انتقال |
| انقطاع Vault | HA/raft quorum؛ DPAPI fallback؛ تنبيه sealed-state |
| فقد مفاتيح unseal | Shamir m-of-n + حُرّاس + break-glass + escrow offline مُغلق ✅ |
| اختراق token | tokens قصيرة + AppRole + إلغاء root + مراجعة |
| تسرّب سجل audit | HMAC + ACL + تدوير |
| تعريض الشبكة | شبكة إدارة خاصة + firewall + loopback/داخلي فقط |
| فشل rollback | snapshot قبل التغيير + DPAPI fallback محفوظ |
| خطأ المشغّل | runbook + موافقة مزدوجة + نافذة + dry-run سابق |

## 7) Go/No-go Checklist
- [ ] مضيف معزول جاهز (أو نافذة صيانة معلنة).
- [ ] firewall مُتحقَّق.
- [ ] TLS مُتحقَّق.
- [ ] مسار audit مؤمّن.
- [ ] snapshot مُختبَر.
- [ ] موافقات المالك.
- [ ] monitoring جاهز.
- [ ] لا اقتران بتطبيق الإنتاج (لا Docker مشترك).
- [ ] لا ZATCA/NPHIES calls.
- [ ] **لا موافقة re-wrap بعد** (بوابة لاحقة منفصلة).

## 8) حزمة الموافقة المستقبلية (لا تُنفَّذ الآن)
- التالية: **`APPROVE_VAULT_PRODUCTION_DEPLOYMENT_ISOLATED_HOST_ONLY`** (نشر Vault مُحصَّن على مضيف معزول؛ بلا re-wrap).
- وبعد نجاح الإنتاج: **`APPROVE_PRODUCTION_REWRAP_EXECUTION_WINDOW_ONLY`** (إعادة لفّ KEK DPAPI→Vault؛ بوابة مستقلة تماماً، نافذة صيانة، rollback، escrow مُغلق ✅).

## إثبات عدم التغيير الإنتاجي
قراءة فقط. parent c03b788 · namaweb 0bb8fa2 · drift 0/0 · لا حاوية Vault · لا `~/vault_staging` · app online (pid 96016) health 200 · Redis PONG · FORCE_RLS 150 · accounting OFF. لم يُشغَّل Docker/حاوية، لا keys/tokens، لا قراءة KEK/DPAPI/escrow.

## الحقول
```text
FINAL_STATUS: VAULT_STAGING_TO_PRODUCTION_DEPLOYMENT_PLAN_READY
SKILLS_INDEX_READ: YES
SKILLS_ACTIVATED: NM_GLOBAL_GATES, NM_SECURITY_DR_KEY_MANAGEMENT, NM_OBSERVABILITY_OPS, NM_INTEGRATION_SANDBOX, NM_FINANCE_ACCOUNTING_GUARD, NM_GOVERNANCE_CLOSEOUT
STAGING_REPORT_REVIEWED: YES (VAULT_STAGING_HARDENED_DEPLOYMENT_REPORT_AR.md, parent c03b788)
DOCKER_BOUNCE_REVIEWED: YES (documented as operational risk; not minimized)
DEDICATED_HOST_RECOMMENDED: YES (Option A)
PLAN_CREATED: YES
VAULT_PRODUCTION_DEPLOYED: NO
DOCKER_RUN: NO
CONTAINERS_STARTED: NO
VAULT_KEYS_CREATED: NO
VAULT_TOKENS_CREATED: NO
REAL_KEYS_READ: NO
DPAPI_READ: NO
ESCROW_CONTENT_READ: NO
PRODUCTION_REWRAP_RUN: NO
PRODUCTION_CHANGES: NONE
PM2_RESTARTED: NO
REDIS_RESTARTED: NO
DB_CHANGED: NO
DDL: NO
DATA_CHANGED: NO
ZATCA_CALLS: NO
NPHIES_CALLS: NO
EXTERNAL_HEALTHCARE_CALLS: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS: 150
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
TOKENS_COMMITTED: NO
MOJIBAKE_AUDIT: CLEAN
GIT_PARENT: c03b788 -> (this report commit)
GIT_COMMIT: namaweb 0bb8fa2 (unchanged) / parent (this report commit)
DRIFT: 0/0
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: APPROVE_VAULT_PRODUCTION_DEPLOYMENT_ISOLATED_HOST_ONLY
```

خطة الانتقال جاهزة: القرار الموصى به = مضيف معزول (مدعوماً بواقعة ارتداد Docker المثبتة)، مع بنية/شروط/قواعد عدم تأثير/smoke/مخاطر/go-no-go وحزمة موافقة مستقبلية — plan-only تماماً، لا نشر ولا Docker ولا تغيير إنتاجي. التنفيذ خلف بوابة معزولة منفصلة.
