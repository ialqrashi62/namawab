# جمانة سوفت — فهرس تسليم أساس SaaS لـ DevOps (Master Handoff Index)

**التاريخ:** 2026-06-30 · **الحالة:** الكود مكتمل ومُختبَر ومرفوع على فروع خاصة. **لا شيء مدموج بـ main ولا منشور على production.**
**الحاجز الوحيد المتبقّي:** بنية staging معزولة حقيقية (خادم/عنقود + DNS) — مهمة DevOps.

> هذه الوثيقة فهرس مرجعي واحد لكل عمل أساس SaaS (الدفعات 1 → 4D) وما يتبقّى على DevOps. الـ submodule = `namaweb`. الريموتات: جذري `origin` (خاص)، submodule `private-origin` (خاص). دفع FF فقط، لا force.

## 1) خريطة الدفعات (الحالة + الفروع + الـ commits)
| الدفعة | الوصف | الحالة | الفرع | root | submodule |
|---|---|---|---|---|---|
| 1 | Tenant Control Center / Super Admin | ✅ PASS | `feature/jumanasoft-tenant-control-center` | `20405e2` | `82f4572` |
| 2 | Auth/RBAC Hardening | ✅ PASS | `feature/jumanasoft-auth-rbac-hardening` | `17dd621` | `0751e79` |
| 3 | Plans & Pricing / Entitlements catalog | ✅ PASS | `feature/jumanasoft-plans-pricing` | `6927d89` | `de3b762` |
| 4A | Entitlements Runtime Resolver (observe-only) | ✅ PASS | `feature/jumanasoft-entitlements-runtime` | `c50e3dd` | `be4dd86` |
| 4B | Staging e25 provisioning (محاولة + مدوّنة) | ⛔ BLOCKED | `feature/jumanasoft-staging-e25-provisioning` · `ops/jumanasoft-staging-e25-execution-attempt` | `ce326a9` · `aab6bdd` | (لا تغيير) |
| 4C | max_users Enforcement Candidate (flag-gated) | ✅ PASS | `feature/jumanasoft-max-users-enforcement-candidate` | `b87a73b` | `0747768` |
| 4D | User↔Tenant Linkage Integrity (أغلق فجوة العدّ) | ✅ PASS | `feature/jumanasoft-user-tenant-linkage-integrity` | `b20c280` | `44537b7` |
| 4B-INFRA | حزمة توفير staging الجاهزة | ⛔ BLOCKED (مُسلَّمة) | `ops/jumanasoft-staging-infra-prep` | `da20af6` | (لا تغيير) |

## 2) ملفات الكود الأساسية (في `namaweb/`)
- `super_admin.js` (+ `public/super-admin/*`) — منصّة Super Admin (مبوّبة بعلم `SUPER_ADMIN_ENABLED`).
- `rbac_guards.js` — حُرّاس موحّدة: `requireAuthenticated` / `requireTenantAdmin` / `requireSuperAdmin`.
- `plans.js` — كتالوج الخطط/الأسعار/الاستحقاقات (إدارة خلف requireSuperAdmin + قراءة عامة fail-safe).
- `entitlements.js` — resolver وقت التشغيل + `countTenantUsers` + `makeUserLimitGuard` (observe/enforce/disabled، fail-open).
- `user_provisioning.js` — إنشاء مستخدم + ربط `user_tenants` ذرّياً (يغلق فجوة عدّ max_users).
- `migrations/e25_plans_pricing_candidate_{up,down,validate}.sql` — **مرشّح، لم يُشغَّل**.

## 3) الأعلام التشغيلية (كلها آمنة افتراضياً = OFF)
| العلم | الافتراضي | الأثر |
|---|---|---|
| `SUPER_ADMIN_ENABLED` | `false` | منصّة Super Admin خاملة تماماً ما لم =true. |
| `SUPER_ADMIN_USERS` | (فارغ) | قائمة أسماء Super Admin (env). **يجب إعادة تسجيل دخول المسؤولين بعد التفعيل** لتعبئة `username` بالجلسة (إصلاح الدفعة 2). |
| `ENTITLEMENTS_ENABLED` | `false` | resolver + حارس max_users خاملان تماماً ما لم =true. |
| `ENTITLEMENTS_ENFORCEMENT_MODE` | `observe` | observe=تسجيل بلا منع · enforce=منع عند الحدّ. |
| `ENTITLEMENTS_FAIL_MODE` | `allow_existing` | fail-open عند غياب e25/خطأ. |

## 4) حزمة توفير staging (في `ops/staging/` — جاهزة، لم تُنفَّذ)
- `provision_staging.sql` — `jumanasoft_staging_user` (`NOSUPERUSER`/`NOBYPASSRLS`/`NOCREATEDB`/`NOCREATEROLE`) + قاعدة `jumanasoft_staging` + قفل صلاحيات + تحقّق عزل (كلمة المرور عبر متغيّر psql).
- `.env.staging.example` — قالب (`NODE_ENV=staging`, `PORT=3010`, `DB_NAME=jumanasoft_staging`, flags آمنة).
- `ecosystem.staging.config.example.js` — PM2 `jumanasoft-app-staging` (3010).
- `nginx.staging.conf.example` — عكسي لـ `staging.jumanasoft.com` + basic-auth/IP allowlist + noindex.

## 5) تسلسل تنفيذ DevOps (الترتيب الإلزامي)
**المرحلة A — بنية staging معزولة (4B-INFRA):**
1. خادم/عنقود staging منفصل عن production و jumanasoft.com.
2. `psql -v staging_pw="'<قوي>'" -f ops/staging/provision_staging.sql` على عنقود staging.
3. `.env.staging.example` → `namaweb/.env.staging` (ملء القيم على الخادم، لا git).
4. `pm2 start ops/staging/ecosystem.staging.config.example.js` + nginx + DNS.
5. **تحقّق العزل (إلزامي):** `NODE_ENV!=production` · `current_database=jumanasoft_staging` · `current_user=jumanasoft_staging_user` · `rolsuper=f` · `rolbypassrls=f`.
   → `BATCH4B_INFRA_STAGING_READY`

**المرحلة B — تشغيل e25 على staging (4B):** اتبع `JUMANASOFT_BATCH4B_STAGING_E25_PROVISIONING_RUNBOOK_AR.md`:
6. backup/snapshot.
7. `e25_up` → `validate` (`all_ok=true`).
8. seed خطط synthetic (starter/growth/enterprise).
9. ربط مستأجر staging تجريبي بخطة.
10. تفعيل observe فقط: `ENTITLEMENTS_ENABLED=true`, `ENFORCEMENT_MODE=observe`, `FAIL_MODE=allow_existing`.
11. smoke: الخطة تظهر · `max_users` من الخطة · **إنشاء مستخدم يزيد `countTenantUsers`** (مغلَق بالدفعة 4D) · observe لا يمنع · لا أسرار في logs.
    → `BATCH4B_STAGING_E25_PROVISIONING_PASS`

**المرحلة C — تفعيل enforce على staging (4C):** اتبع `JUMANASOFT_BATCH4C_STAGING_ACTIVATION_RUNBOOK_AR.md`:
12. بعد فترة observe مُرضية: `ENFORCEMENT_MODE=enforce` (staging فقط).
13. smoke enforce: تحت الحدّ يسمح · عند الحدّ يمنع 409 `USER_LIMIT_REACHED`.
14. rollback جاهز: `MODE=observe` أو `ENTITLEMENTS_ENABLED=false`.

> **production** خارج كل ما سبق — يحتاج runbook منفصل وإذناً مستقلاً بعد استقرار staging.

## 6) شبكة أمان الاختبارات (للتشغيل قبل أي نشر)
`super_admin` 28 · `rbac_guards` 23 · `plans` 47 · `entitlements` 27 · `max_users_enforcement` 16 · `user_tenant_linkage` 20 · **المجموعة الآمنة `node run_safe_tests.js` = 97/97**. (الاختبارات المعتمدة على DB تُشغَّل عبر `run_all_tests.js` على قاعدة معزولة.)

## 7) إقرار الامتثال (للسلسلة كاملةً)
❌ لمس production · ❌ DDL/migration/e25 مُشغَّل على أي قاعدة · ❌ enforcement حيّ مُفعّل · ❌ دفع/checkout/webhook · ❌ أسرار مطبوعة · ❌ force push · ❌ حذف بيانات · ❌ دمج boilerplate خارجي · ❌ دمج إلى main · ❌ نشر إنتاجي.

## 8) المخاطر/الملاحظات المتبقية
1. **e25 غير موفّر** — كل ما يقرأ الكتالوج fail-open (`no_plan/default`) حتى التوفير على staging.
2. **إعادة تسجيل دخول Super Admin** مطلوبة بعد تفعيل `SUPER_ADMIN_ENABLED` (تعبئة `username`).
3. **الإنفاذ يبقى observe** حتى استقرار staging؛ enforce على staging فقط ثم لاحقاً production بإذن مستقل.
4. **توحيد خط الإنتاج:** الفروع متفرّعة من `audit/phase-1a`؛ المواءمة مع خط الإنتاج الحيّ (`integration/all-epics` على jumanasoft.com) تُعالَج عند قرار النشر (merge لا copy).

## 9) القرار
**JUMANASOFT_SAAS_FOUNDATION_CODE_COMPLETE — DEVOPS_STAGING_INFRA_PENDING.** الكود جاهز للتفعيل المبوّب التدريجي فور توفّر بنية staging معزولة.
