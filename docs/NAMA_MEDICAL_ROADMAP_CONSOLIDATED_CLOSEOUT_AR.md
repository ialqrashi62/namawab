# NamaMedical — تقرير الإغلاق الموحّد لخارطة الطريق (RLS + المحاسبة + go-live)

> التاريخ: 2026-06-20. تقرير capstone موحّد. **الترحيل المحاسبي معطّل (flag OFF)، journals الإنتاج = 0/0.**
> origin/master الحالي عند إصدار هذا التقرير: انظر آخر commit. gitlink الإنتاج = `4d2bcaf` (كود fail-closed، flag OFF).

## ACTIVE_SKILLS
```text
MEDICAL_AUTOPILOT_CORE_SKILL_AR · MEDICAL_BILLING_INSURANCE_ACCOUNTING_SKILL_AR ·
MEDICAL_DATABASE_SCHEMA_AUDIT_SKILL_AR · MEDICAL_BUSINESS_LOGIC_AUDIT_SKILL_AR ·
MEDICAL_API_AUDIT_SKILL_AR · MEDICAL_RBAC_TENANT_ISOLATION_SKILL_AR ·
MEDICAL_TEST_SCENARIOS_SKILL_AR · MEDICAL_PRODUCTION_READINESS_GATE_SKILL_AR ·
MEDICAL_REPORTS_HYGIENE_AND_CLOSEOUT_SKILL_AR · MEDICAL_ARABIC_UTF8_REPORTING_SKILL_AR
```

## 1) مصفوفة حالة المراحل (Roadmap Status Matrix)
| Phase | الوصف | الحالة |
|---|---|---|
| P1 محاسبة DDL/CoA readiness | تصميم + مرشّحات | ✅ DOCS_AND_SQL_CANDIDATE |
| P1 DDL/CoA prod execution | تنفيذ الأساس المحاسبي في الإنتاج | ✅ PRODUCTION_EXECUTED_PASS (numeric، CoA 30، mapping 23، idempotency/FK/CHECK) |
| P2 توصيل المحرك (staging) | wiring خلف flag | ✅ STAGING_PASS |
| P2A RLS مالية + fail-closed readiness | تصميم | ✅ RLS staging-proven + خطة fail-closed |
| P2B تصليب دور التطبيق | nama_medical_app | ✅ PRODUCTION (LOGIN/NOSUPERUSER/NOBYPASSRLS) |
| P2D تبديل DB_USER للإنتاج | إنفاذ RLS فعلياً | ✅ PASS (RLS مُنفَّذة على 42 جدولاً) |
| P2D-INFRA Redis + HTTP smoke | تشغيل | ✅ PASS |
| P2D-OPS إشراف الخدمات | Docker Redis + PM2 | ✅ PASS (reboot autostart = خطوة مدير) |
| WS6 fail-closed refactor | issue/pay/cancel atomic | ✅ STAGING_PASS (10/10) |
| Phase7/WS6B نشر fail-closed flag OFF | gitlink e6608ba→4d2bcaf | ✅ DEPLOYED (code-only, flag OFF) |
| RLS Group A (staging) | 40 PHI/HR/مالي | ✅ STAGING_PASS |
| RLS Group B (staging) | 23 تشغيلي | ✅ STAGING_PASS |
| RLS Group C (staging) | 6 إعدادات مختلطة | ⏸ global-aware candidate (PARTIAL_DEFERRED، يحتاج فحص بيانات إنتاج) |
| RLS Group D — 4 آمنة (staging) | backfill من patients | ✅ STAGING_PASS |
| RLS Group D — 18 مؤجَّلة | بلا مصدر tenant حتمي | ⏸ DEFERRED (قرارات عمل/تصميم) |
| Phase3/4 نشر RLS إنتاجي | A/B/C/D4 | ⛔ BLOCKED (auth-smoke / risk-accept) |
| Phase6 تشديد الصلاحيات | least privilege | ⏸ DEFERRED (يحتاج رصد استخدام حيّ) |
| Phase9 أحداث المحاسبة | issue/pay/cancel/refund | ✅ CORE (4 أحداث fail-closed)؛ الباقي DEFERRED |
| Phase10 go-live محاسبي | تفعيل posting | ⛔ PENDING (موافقة مخصّصة؛ flag OFF) |
| Phase11 backfill تاريخي | — | NOT_REQUIRED (افتراضياً) |
| Phase12 مراقبة ما بعد go-live | — | N/A حتى go-live |
| Phase13 تصليب أمني | df893ab/gitmodules | ⏸ DEFERRED (لم يُمسّا، مراجعة منفصلة) |

## 2) مصفوفة اللمس الإنتاجي (تراكمي)
```text
PRODUCTION_TOUCHED: YES (P1 accounting DDL+CoA+mapping ; P2B/P2D role+RLS ; Phase7 gitlink code-only deploy)
DATA_CHANGED: YES (seed only: CoA 30 + mapping 23 ; NO business/journal data)
DDL_EXECUTED: YES (finance schema upgrade + finance RLS in prod)
DEPLOYED: YES (code-only, fail-closed, flag OFF)
POSTING_ENABLED: NO
PROD_JOURNALS_WRITTEN: NO (0/0)
FORCE_PUSH_USED: NO
```

## 3) مصفوفة تغطية RLS
- **مُنفَّذة في الإنتاج**: 35 (موجودة سابقاً) + 7 (finance) = **42 جدولاً** ✅ (تحت دور غير-superuser).
- **staging-proven جاهزة للإنتاج (pending auth-smoke/approval)**: Group A (40) + Group B (23) + Group D-4 = **67 جدولاً**.
- **candidate يحتاج فحص بيانات إنتاج**: Group C (6، global-aware).
- **مؤجَّلة (تصميم/قرار عمل)**: Group D 18 (auth-mapping/global/legacy/schema-gap).

## 4) مصفوفة الأحداث المحاسبية
| الحدث | الحالة |
|---|---|
| فاتورة مريض صدرت | ✅ fail-closed (deployed flag OFF) |
| تحصيل دفعة | ✅ fail-closed |
| إلغاء/عكس | ✅ fail-closed (قيد عكسي) |
| استرداد | ✅ fail-closed (feature/refund-event، staging 5/5، غير منشور) |
| فاتورة مورّد / استهلاك مخزون | ✅ بانٍ موجود (غير مُوصَل بمسار) |
| مطالبة تأمين تقديم/اعتماد/تسوية | ⏸ DEFERRED (لا قاعدة/mapping) |
| خصم/تسوية، write-off، ديون معدومة، ضريبة/ZATCA adjustments | ⏸ DEFERRED (لا قاعدة) |

## 5) سجل المخاطر (Risk Register)
| المخاطرة | الحالة/التخفيف |
|---|---|
| تسريب بين المستأجرين | مُخفَّفة — RLS مُنفَّذة على 42 جدولاً تحت دور غير-superuser |
| فاتورة بلا قيد (partial) | مُعالَجة — fail-closed atomic (issue/pay/cancel/refund) |
| ترحيل مزدوج | مُخفَّفة — uq_journal_idempotency + SAVEPOINT |
| سلامة المال | مُعالَجة — numeric(18,2) في الإنتاج |
| كسر مسارات بعد RLS | مُخفَّفة — pool مغلّف يربط app.tenant_id؛ يلزم auth-smoke لتأكيد الدفعات الجديدة |
| Group C يكسر حارس الاستحقاق | مُخفَّفة — سياسة global-aware؛ مؤجَّلة لفحص بيانات إنتاج |
| Group D backfill خاطئ | مُخفَّفة — مصدر حتمي (patient) فقط للـ4؛ 18 مؤجَّلة |
| فقدان جلسات عند إعادة الإقلاع | متبقّية — reboot autostart يحتاج صلاحيات مدير |
| الصلاحيات الواسعة (DML على الكل) | متبقّية — انتقالية موثّقة؛ تشديد يحتاج رصد استخدام |

## 6) مراجع الاسترجاع (Rollback)
- finance RLS: `finance_rls_candidate_down.sql`؛ دور التطبيق: إعادة `.env` DB_USER=postgres (فوري) + pm2 restart.
- fail-closed code: إعادة gitlink إلى e6608ba + namaweb checkout e6608ba + pm2 restart.
- RLS Groups A/B/C/D: ملفات `*_candidate_down.sql` لكل مجموعة.
- backups: `C:/Users/ice/nama_prod_backups/` (pre_p2d, pre_ddl)؛ نسخ git: backup branches/tags لكل مرحلة.
- posting go-live (مستقبلاً): `ACCOUNTING_POSTING_ENABLED=false` + pm2 restart (فوري).

## 7) ملخص التشغيل
Redis = حاوية Docker `nama-redis` (restart=unless-stopped)؛ التطبيق = PM2 `nama-app` (autorestart مُثبت، pm2 save)؛ health 200؛ DB_USER=nama_medical_app. استمرارية الإقلاع تحتاج خطوة مدير (`pm2 startup` + Docker autostart) — البيئة NON_ADMIN.

## 8) الامتثال النهائي
mojibake PASS · secrets clean · no force push · `.gitmodules` لم يُعدَّل · `df893ab` لم يُدمج · UTF-8 نظيف · backups خارج git · أسرار فقط في `.env` (gitignored).

## 9) المتبقّي + ما يفتحه (NEXT)
| البند | البوابة المطلوبة |
|---|---|
| نشر RLS إنتاجي (A/B + D4) | smoke مُصادَق (قائمة المشغّل جاهزة) **أو** قبول مخاطرة صريح |
| RLS Group C إنتاج | فحص توزيع بيانات الإنتاج (صفوف global NULL) + تأكيد حارس الاستحقاق |
| Group D الـ18 | قرارات عمل (global مقابل per-tenant، auth-mapping، legacy) |
| تشديد الصلاحيات | رصد استخدام حيّ عبر الجلسات |
| نشر حدث الاسترداد | مراجعة/دمج feature/refund-event + نشر (flag OFF) |
| go-live محاسبي | موافقة go-live مخصّصة (ثم سيناريو إنتاج أول محكوم) |
| استمرارية الإقلاع | صلاحيات مدير |
| أحداث محاسبية مؤجَّلة | قواعد عمل/mapping للتأمين/الخصم/write-off/الضريبة |

## الحالة النهائية لخارطة الطريق
```text
FINAL_STATUS: NAMA_MEDICAL_ROADMAP_PARTIAL_DEFERRED_WITH_RATIONALE
PRODUCTION_TOUCHED: YES (RLS enforcement + accounting foundation + fail-closed code, all posting-OFF)
DATA_CHANGED: NO (business/journals) / seed-only (CoA+mapping)
DDL_EXECUTED: YES (finance schema + finance RLS, prod)
DEPLOYED: YES (code-only, flag OFF)
POSTING_ENABLED: NO | PROD_JOURNALS_WRITTEN: NO | FORCE_PUSH_USED: NO
NEXT_REQUIRED_ACTION: explicit production approvals/credentials per table §9 (auth-smoke/risk-accept for prod RLS ; business decisions for Group D-18 & deferred accounting events ; dedicated go-live approval ; admin for reboot autostart)
```

## خلاصة
أساس عزل المستأجرين والمحاسبة **مكتمل ومُنفَّذ في الإنتاج بأمان** (دور مُصلّب + RLS على 42 جدولاً + مخطط محاسبي numeric + كود fail-closed منشور بعلم OFF)، مع journals=0 وposting معطّل. كل ما تبقّى محكوم ببوابات بشرية (موافقات/بيانات اعتماد/قرارات عمل/صلاحيات مدير) لا يمكن للأوتوبايلوت تجاوزها بأمان — وكلها موثّقة بمرشّحات SQL + runbooks + قوائم تحقّق جاهزة للتنفيذ فور توفّر البوابة.
