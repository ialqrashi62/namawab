# جرد دلتا ختم tenant_id في الكود (Code-Level Delta Inventory)

> المرحلة: `P1_RLS_CODE_LEVEL_TENANT_STAMPING_DEFENSE_IN_DEPTH_AND_NAMAWEB_RECONCILIATION` | التاريخ: 2026-06-21 | read-only. الكود الحيّ: namaweb 039a7d7.

## تشعّب namaweb (مؤكَّد)
```text
namaweb local branch = main @ 039a7d7 (المنشور/الجاري)
namaweb origin/master = 10ded01 (سطري الأمني)
merge-base = c6e44ae (سلف مشترك) ؛ كلاهما متشعّب عن الآخر (non-FF بالاتجاهين)
=> دفع كود إلى master غير ممكن بلا force (محظور). القرار للمالك (دمج/rebase).
```

## جرد البنود الـ16 على 039a7d7
| # | البند | PRESENT_IN_LIVE | PROTECTED_BY_DB_DEFAULT | STILL_NEEDS_CODE_DEFENSE | RISK |
| --- | --- | --- | --- | --- | --- |
| 1 | logAudit tenant_id stamping | لا (6 أعمدة) | نعم (DEFAULT يختم تحت السياق) | نعم (دفاع) | منخفض الآن |
| 2 | blood_bank_units POST stamping | لا | نعم | نعم | منخفض |
| 3 | blood_bank_donors POST stamping | لا | نعم | نعم | منخفض |
| 4 | audit_trail safe insert | نعم (write-always policy) | — | لا | — |
| 5 | INSERT into FORCE-RLS بلا tenant_id (~44) | لا (متعددة) | نعم (DEFAULT) | نعم (دفاع، batched) | منخفض |
| 6 | routes تثق بـ tenant_id من body | لم يُرصَد ثقة بالـbody في عينة Batch1 (الأعمدة تُفكَّك صراحةً) | — | تحقق مستمر | منخفض |
| 7 | SELECT-after-insert / RETURNING tenant restriction | جزئي (RETURNING id/*) | RLS يفلتر القراءة | دفاع | منخفض |
| 8 | refund IDOR guard | مُغطّى بـ RLS | — | دفاع | منخفض |
| 9-14 | queue/referral/claim/visits/records/multi-update guards | عزل القراءة/التحديث مُغطّى بـ RLS؛ INSERTs ضمن #5 | نعم | دفاع | منخفض |
| 15 | facility entitlement guard | **نعم** (موجود) | — | لا | — |
| 16 | app.tenant_id ALS/pool binding | **نعم** (مُثبَت 9/9) | — | لا | — |

## الخلاصة
- **الخطر الوظيفي مرفوع بالكامل** بالـ DB default (Phase 157، تحقق 31/31). ما تبقّى دفاع-في-العمق فقط.
- **العائق الحقيقي**: تشعّب namaweb main(039a7d7)↔origin/master(10ded01) يمنع دفع/دمج كود نظيفاً بلا قرار مالك.
- لذا: إنشاء **patch spec فقط** (Batch 1) تحت docs/patches، **بلا تعديل/دفع namaweb**، وإغلاق `BLOCKED_PENDING_BRANCH_DECISION`.

`DELTA_INVENTORY_COMPLETE`
