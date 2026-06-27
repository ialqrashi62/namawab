# تقرير بوابة تنظيف شجرة العمل (WORKTREE_HYGIENE_CLEANUP_GATE)

**المشروع:** NamaMedical / الطبيب
**الفرع:** `audit/phase-1-critical-remediation`
**HEAD:** `d467376`
**التاريخ:** 2026-06-27
**النوع:** تنظيف محلي ضيق النطاق — لا commit — لا push — لا DB — لا DDL

---

## 1. الهدف

تقليل ضوضاء شجرة العمل (worktree noise) بأضيق نطاق ممكن، دون إجراء أي commit أو تعديل على الكود أو قاعدة البيانات.

---

## 2. الإجراءات المنفذة

### 2.1 استبعاد الأدوات المحلية (.git/info/exclude)

أُضيفت الأنماط التالية إلى `.git/info/exclude` (محلي فقط، لا يؤثر على `.gitignore`):

```
.claude/
.playwright-mcp/
namaweb/.claude/
```

**النتيجة:** هذه المجلدات لم تعد تظهر في `git status`.

### 2.2 استعادة الملفات المحذوفة

نُفّذ `git restore protocol_x.ps1 migrate.ps1` لاستعادة الملفين المحذوفين محلياً.

**النتيجة:** `D migrate.ps1` و `D protocol_x.ps1` لم تعد تظهران في `git status`.

---

## 3. ما لم يتم (بقرار المالك)

- ❌ لم يتم stage لحذف `migrate.ps1` أو `protocol_x.ps1`.
- ❌ لم يتم تعديل `.gitignore`.
- ❌ لم يتم تنظيم أو commit مستندات STITCH / MEDICAL UI / WWW_SSL / COMMIT_3E51A724.
- ❌ لم يتم تحديث gitlink لـ namaweb.
- ❌ لم يتم أي push أو merge أو DDL أو DB أو production.
- ❌ لم يتم commit لهذا التقرير.

---

## 4. حالة شجرة العمل بعد التنظيف

### قبل التنظيف (17 عنصراً)

| النوع | العدد |
|-------|-------|
| تعديل tracked | 2 (STITCH doc + namaweb gitlink) |
| حذف tracked | 2 (migrate.ps1 + protocol_x.ps1) |
| مجلدات untracked (أدوات) | 2 (.claude/ + .playwright-mcp/) |
| مستندات untracked | 11 |

### بعد التنظيف (13 عنصراً)

| النوع | العدد |
|-------|-------|
| تعديل tracked | 2 (STITCH doc + namaweb gitlink) |
| حذف tracked | 0 ✅ |
| مجلدات untracked (أدوات) | 0 ✅ |
| مستندات untracked | 11 (بما فيهم هذا التقرير + WORKTREE_HYGIENE_REVIEW) |

**الانخفاض:** 17 → 13 عنصراً (إزالة 4 مصادر ضوضاء).

---

## 5. العناصر المتبقية وبواباتها المقترحة

### 5.1 مستندات STITCH / MEDICAL UI (بوابة منفصلة)
- `M docs/STITCH_DESIGN_IMPLEMENTATION_REPORT_AR.md`
- `?? docs/MEDICAL_DATABASE_TABLES_FOR_UI_REDESIGN_AR.md`
- `?? docs/MEDICAL_FULL_UI_SECTIONS_FOR_STITCH_AR.md`
- `?? docs/MEDICAL_UI_API_DB_MAPPING_FOR_STITCH_AR.md`
- `?? docs/MEDICAL_UI_TABLES_INVENTORY_FOR_STITCH_AR.md`
- `?? docs/STITCH_GLOBAL_NAVIGATION_REDESIGN_BRIEF_AR.md`
- `?? docs/STITCH_MEDICAL_DESIGN_SYSTEM_BRIEF_AR.md`
- `?? docs/STITCH_REDESIGN_PROMPTS_BY_SECTION_AR.md`
- `?? docs/STITCH_UI_DISCOVERY_FINAL_CLOSEOUT_AR.md`

**التوصية:** بوابة `STITCH_UI_DOCS_COMMIT_GATE` منفصلة.

### 5.2 مستند WWW/SSL (بوابة منفصلة)
- `?? docs/WWW_SSL_CANONICAL_DOMAIN_HOTFIX_AR.md`

**التوصية:** بوابة `WWW_SSL_HOTFIX_DOCS_GATE` منفصلة.

### 5.3 مستند تدقيق الحوكمة (بوابة منفصلة)
- `?? docs/governance/.../COMMIT_3E51A724_CONTENT_AUDIT_AR.md`

**التوصية:** بوابة `GOVERNANCE_AUDIT_DOCS_GATE` منفصلة.

### 5.4 تحديث gitlink لـ namaweb (قرار مالك)
- `M namaweb` — gitlink `319c4a5` vs HEAD `1fe349d` (14 commits behind)

**التوصية:** بوابة `NAMAWEB_GITLINK_BUMP_GATE` بموافقة المالك.

---

## 6. حقول الإغلاق

```
FINAL_STATUS:                      WORKTREE_HYGIENE_CLEANUP_DONE_NO_COMMIT
CURRENT_BRANCH:                    audit/phase-1-critical-remediation
HEAD:                              d467376
LOCAL_TOOLING_EXCLUDED:            YES (.git/info/exclude: .claude/, .playwright-mcp/, namaweb/.claude/)
TRACKED_DELETIONS_RESTORED:        YES (git restore protocol_x.ps1 migrate.ps1)
OUT_OF_SCOPE_DOCS_ACTION:          LEFT_UNTOUCHED (recommend separate gates per category)
NAMAWEB_GITLINK_STAGED:            NO
ROOT_GITLINK:                      319c4a5
NAMAWEB_HEAD:                      1fe349d
GITLINK_BUMP_DEFERRED:             YES
WORKTREE_CLEAN:                    NO (13 items: 2 tracked modified + 11 untracked docs)
SAFE_TO_PUSH:                      NO
SAFE_TO_START_PHASE_2:             NO
SAFE_TO_RUN_STAGING_DDL_GATE:      BLOCKED_UNTIL_OWNER_APPROVAL
PRODUCTION_TOUCHED:                NO
DB_TOUCHED:                        NO
DDL_RUN:                           NO
PUSH_RUN:                          NO
SECRETS_PRINTED:                   NO
PHI_PRINTED:                       NO
REPORT_FILE:                       docs/governance/enterprise-engineering-constitution/WORKTREE_HYGIENE_CLEANUP_REPORT_AR.md
NEXT_RECOMMENDED_ACTION:           OWNER_DECIDES: (A) STITCH_UI_DOCS_COMMIT_GATE, (B) WWW_SSL_HOTFIX_DOCS_GATE, (C) GOVERNANCE_AUDIT_DOCS_GATE, (D) NAMAWEB_GITLINK_BUMP_GATE — in any order, each with separate owner approval
```
