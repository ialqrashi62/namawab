# تقرير بوابة قرار عزل شجرة العمل النظيفة (ISOLATED_CLEAN_WORKTREE_DECISION_REPORT)

**المشروع:** NamaMedical / الطبيب
**الفرع:** `audit/phase-1-critical-remediation`
**رأس التزام الجذر (ROOT HEAD):** `f3829611eb5e690afaffb9e12ece4803ec68ec69`
**رأس التزام namaweb المتوقع:** `319c4a553a2f1d240661ba174fa7c8065b655a03`
**التاريخ:** 2026-06-27
**النوع:** تقرير قرار عزل شجرة العمل — لا push — لا DDL — لا DB — لا deploy — لا تعديل كود

---

## 1. الهدف
تقييم حالة شجرة العمل الحالية وتصنيف التغييرات غير الملتزم بها (dirty items)، واتخاذ قرار بشأن مسار العزل المناسب لتنفيذ عمليات الـ push والتحقق اللاحقة دون تلويث شجرة العمل أو إدخال عناصر خارج النطاق.

---

## 2. مراجع الحالة (Baseline Verification)

### 2.1 مستودع الجذر (Root Repository)
- **الفرع الحالي:** `audit/phase-1-critical-remediation`
- **التزام الرأس الحالي:** `f3829611eb5e690afaffb9e12ece4803ec68ec69`
- **حالة الـ staged:** لا توجد أي تغييرات مجهزة (NONE).
- **رابط namaweb المسجل في الالتزام الحالي:** `319c4a553a2f1d240661ba174fa7c8065b655a03`

### 2.2 مستودع namaweb الفرعي
- **التزام الرأس الفعلي الحالي:** `1fe349d9f09a12c358aefbf2b0fd644c4cf27d04` (متقدم بـ 14 التزامًا عن الرابط المسجل بالجذر).
- **حالة شجرة العمل:** نظيفة تمامًا (باستثناء المجلد المحلي المستبعد `.claude/`).
- **حالة الـ staged:** لا توجد أي تغييرات مجهزة (NONE).

---

## 3. تصنيف عناصر شجرة العمل غير النظيفة (Dirty Items Classification)

تم تصنيف العناصر غير النظيفة في المستودع كالتالي:

1. **تحديث الـ gitlink الخاص بـ namaweb:**
   - `M namaweb` (تغيير من `319c4a5` إلى `1fe349d` غير مجهز ومؤجل بقصد).
2. **مستندات خارج النطاق (STITCH / MEDICAL UI / WWW_SSL):**
   - `M docs/STITCH_DESIGN_IMPLEMENTATION_REPORT_AR.md`
   - `?? docs/MEDICAL_DATABASE_TABLES_FOR_UI_REDESIGN_AR.md`
   - `?? docs/MEDICAL_FULL_UI_SECTIONS_FOR_STITCH_AR.md`
   - `?? docs/MEDICAL_UI_API_DB_MAPPING_FOR_STITCH_AR.md`
   - `?? docs/MEDICAL_UI_TABLES_INVENTORY_FOR_STITCH_AR.md`
   - `?? docs/STITCH_GLOBAL_NAVIGATION_REDESIGN_BRIEF_AR.md`
   - `?? docs/STITCH_MEDICAL_DESIGN_SYSTEM_BRIEF_AR.md`
   - `?? docs/STITCH_REDESIGN_PROMPTS_BY_SECTION_AR.md`
   - `?? docs/STITCH_UI_DISCOVERY_FINAL_CLOSEOUT_AR.md`
   - `?? docs/WWW_SSL_CANONICAL_DOMAIN_HOTFIX_AR.md`
3. **مستندات حوكمة غير مجهزة:**
   - `?? docs/governance/.../COMMIT_3E51A724_CONTENT_AUDIT_AR.md`
   - `?? docs/governance/.../WORKTREE_HYGIENE_REVIEW_AR.md`
4. **أدوات ومجلدات محلية مستبعدة:**
   - `.claude/` و `.playwright-mcp/` و `namaweb/.claude/` تم استبعادها محليًا بالكامل عبر `.git/info/exclude`.
5. **الملفات المحذوفة مسبقًا:**
   - تم استعادتها بالكامل محليًا (`migrate.ps1` و `protocol_x.ps1`) وبالتالي لا تظهر كملفات محذوفة أو معدلة.

---

## 4. قرار مسار العزل (Isolation Decision)

### القرار المتخذ: `READY_TO_CREATE_ISOLATED_DETACHED_WORKTREE`

**المبررات:**
1. مستودع الجذر مستقر تمامًا عند الالتزام `f382961`.
2. لا توجد أي تغييرات مجهزة (staged) تمنع العزل.
3. شجرة العمل الحالية غير نظيفة بسبب مستندات خارج النطاق وتعديل gitlink مؤجل.
4. عزل بيئة العمل في شجرة عمل منفصلة (Isolated detached worktree) هو الحل الأمثل لتفادي تلوث الالتزامات المستقبلية ولإجراء عمليات الـ push والتحقق بأمان كامل.

---

## 5. خطة إنشاء شجرة العمل المعزولة (المقترحة)

*لا يتم التنفيذ إلا بعد موافقة المالك الصريحة.*

- **المسار المقترح:** `../NamaMedical-clean-gate-f382961`
- **الالتزام الأساسي:** `f3829611eb5e690afaffb9e12ece4803ec68ec69`
- **الأمر المقترح للإنشاء:**
  ```bash
  git worktree add -d --checkout ../NamaMedical-clean-gate-f382961 f3829611eb5e690afaffb9e12ece4803ec68ec69
  ```
- **الغرض:**
  - التحقق من الـ remotes وإعدادات الـ push بأمان.
  - عزل المستندات والتعديلات الحالية غير الملتزم بها خارج النطاق.
  - ضمان خلو شجرة العمل تمامًا من أي ملفات غير معتمدة قبل القيام بأي عملية دفع (push).
  - الحفاظ على حظر كامل لـ DDL و DB و Deploy و Production.

---

## 6. حقول الإغلاق

```
FINAL_STATUS: ISOLATED_CLEAN_WORKTREE_DECISION_COMMITTED_NO_PUSH
ROOT_HEAD_BEFORE: f3829611eb5e690afaffb9e12ece4803ec68ec69
ROOT_HEAD_AFTER: [سيتم تحديثه بعد الالتزام]
NAMAWEB_HEAD: 319c4a5
GITLINK_MATCH: YES
CURRENT_WORKTREE_CLEAN: NO
STAGED_CHANGES: NONE
OUT_OF_SCOPE_DIRTY_ITEMS_PRESENT: YES
OUT_OF_SCOPE_DIRTY_ITEMS_PRESERVED: YES
ISOLATION_DECISION: READY_TO_CREATE_ISOLATED_DETACHED_WORKTREE
ISOLATED_WORKTREE_CREATED: NO_OWNER_APPROVAL_REQUIRED
PUSH_DONE: NO
DB_TOUCHED: NO
DDL_RUN: NO
PRODUCTION_TOUCHED: NO
DEPLOY_RUN: NO
CODE_CHANGED: NO
NAMAWEB_CHANGED: NO
NAMAWEB_GITLINK_CHANGED: NO
REPORT_FILE: docs/governance/enterprise-engineering-constitution/ISOLATED_CLEAN_WORKTREE_DECISION_REPORT_AR.md
NEXT_RECOMMENDED_ACTION: OWNER_APPROVAL_TO_CREATE_ISOLATED_CLEAN_WORKTREE_OR_PROVIDE_PRIVATE_REPO_URL
```
