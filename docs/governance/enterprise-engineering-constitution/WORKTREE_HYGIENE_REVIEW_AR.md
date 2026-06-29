# بوابة نظافة شجرة العمل — بعد commit d467376

**النوع:** مراجعة Read-only (بلا تعديل/حذف/commit/push/merge/DB/DDL/restore/clean).
**المستودع:** الجذر `NamaMedical`.
**الفرع:** `audit/phase-1-critical-remediation` — HEAD `d467376`.
**التاريخ:** 2026-06-27.

---

## 1. ملخص تنفيذي
شجرة العمل **غير نظيفة** (16 عنصراً)، لكن **لا شيء منها ناتج عن التزام المراجعة d467376** (الذي مسّ ملفاً واحداً فقط). كل العناصر إمّا **خارج النطاق** (مستندات UI/SSL، أدوات محلية) أو **مؤجّلة بقصد** (تحديث gitlink لـ namaweb)، أو **حذوفات سابقة** لملفات PowerShell استعراضية. لا أسرار/PHI. لم يُجرَ أي تعديل في هذه البوابة.

## 2. تصنيف كل عنصر في `git status`
| العنصر | الحالة | التصنيف | ملاحظة |
|---|---|---|---|
| `docs/governance/.../P0P1_AUTOPILOT_POST_REMEDIATION_REVIEW_AR.md` | مُلتزَم في d467376 | **IN_SCOPE_COMMITTED** | لم يعد ظاهراً في status |
| `M namaweb` | gitlink delta (`319c4a5`→`1fe349d`) غير مُجهّز | **SUBMODULE_DIRTY** | مؤجّل بقصد (لا تُحدّث gitlink دون بوابة) |
| `D protocol_x.ps1` | حذف tracked غير مُجهّز | **DELETED_TRACKED_FILE** | سكربت استعراضي «PROTOCOL X» (Write-Host فقط، بلا أسرار) |
| `D migrate.ps1` | حذف tracked غير مُجهّز | **DELETED_TRACKED_FILE** | حذف سابق (موجود منذ بداية الجلسة) |
| `M docs/STITCH_DESIGN_IMPLEMENTATION_REPORT_AR.md` | تعديل tracked | **OUT_OF_SCOPE_UI_DOCS** | عمل إعادة تصميم STITCH، لا علاقة بـ P0/P1 |
| `?? .claude/` | مجلد untracked | **OUT_OF_SCOPE_LOCAL_TOOLING** | أدوات Claude؛ يبقى untracked أو gitignore ببوابة منفصلة |
| `?? .playwright-mcp/` | مجلد untracked | **OUT_OF_SCOPE_LOCAL_TOOLING** | مخرجات Playwright MCP |
| `?? docs/MEDICAL_*_FOR_*_AR.md` (4) | untracked | **OUT_OF_SCOPE_UI_DOCS** | اكتشاف UI/جداول |
| `?? docs/STITCH_*_AR.md` (3) | untracked | **OUT_OF_SCOPE_UI_DOCS** | مواجيز إعادة تصميم |
| `?? docs/WWW_SSL_CANONICAL_DOMAIN_HOTFIX_AR.md` | untracked | **OUT_OF_SCOPE_HOTFIX_DOCS** | إصلاح SSL/نطاق منفصل |
| `?? docs/governance/.../COMMIT_3E51A724_CONTENT_AUDIT_AR.md` | untracked | **OUT_OF_SCOPE_HOTFIX_DOCS** (تدقيق حوكمة مستقل) | يُلتزَم منفصلاً ببوابته أو يبقى untracked — لا يُخلط بـ P0/P1 |

## 3. المحاور الخمسة المطلوبة
1. **`M namaweb`** = **gitlink/submodule dirty** وليس تغييرات داخلية غير مُلتزَمة. شجرة namaweb نفسها نظيفة (عدا `?? .claude/`)، لكن رأسها تقدّم إلى `1fe349d` (الـ14 commit) بينما يسجّل الجذر `319c4a5`. تحديث gitlink **مؤجّل بقصد** إلى بوابة مالك (لم يُجهَّز/يُلتزَم).
2. **`D protocol_x.ps1`** = حذف tracked غير مُجهّز. المحتوى سكربت استعراضي (بانرات «PROTOCOL X / SYSTEM SECURED»)، **بلا أسرار/وظيفة حقيقية**. ظاهر منذ بداية الجلسة (ليس من فعلي). القرار (التزام الحذف عمداً أم استعادته) يُترك لبوابة منفصلة — لم أحذف/أستعد.
3. **`.claude/` و `.playwright-mcp/`** = يجب أن تبقى **untracked**، أو تُضاف إلى `.gitignore` في **بوابة نظافة منفصلة** (ليست هنا).
4. **مستندات STITCH و WWW_SSL** = خارج نطاق P0/P1 وDDL؛ **لا تُخلط** معها. تُعالَج في مسار التصميم/الـSSL الخاص بها.
5. **`COMMIT_3E51A724_CONTENT_AUDIT_AR.md`** = مستند حوكمة untracked من تدقيق مختلف؛ يُلتزَم **منفصلاً** ببوابته أو يُترك untracked — لا يُدمج مع هذه المراجعة.

## 4. الأمان
- لا أسرار/PHI في أي عنصر (حذف protocol_x.ps1 محتواه بانرات نصية فقط).
- لم يُجرَ git restore / git clean / حذف / تعديل / commit إضافي في هذه البوابة.

## 5. الخلاصة والتوصيات
- شجرة العمل غير نظيفة بعناصر **كلها خارج النطاق أو مؤجّلة بقصد**؛ لا تعرقل عملاً مُلتزَماً.
- **قبل أي push**: نظافة هذه العناصر (gitignore للأدوات المحلية، قرار حذف PS1، فصل مستندات UI/SSL/الحوكمة في بواباتها) — في **بوابة نظافة مخصّصة**، لتفادي اكتساحها في commit واحد.
- تحديث gitlink لـ namaweb إلى `1fe349d` يبقى **قرار مالك** (بوابة مستقلة).

---

## حقول الإغلاق
```
FINAL_STATUS: WORKTREE_HYGIENE_REVIEW_COMPLETE_READ_ONLY_NO_CHANGES
CURRENT_BRANCH: audit/phase-1-critical-remediation
HEAD: d467376
WORKTREE_CLEAN: NO
DIRTY_ITEMS_COUNT: 16 (4 tracked + 12 untracked)
SUBMODULE_DIRTY: YES (namaweb gitlink 319c4a5 vs working 1fe349d — unstaged, deferred by design)
TRACKED_DELETED_FILES: 2 (migrate.ps1, protocol_x.ps1 — unstaged, pre-existing)
UNTRACKED_DIRS: 2 (.claude/, .playwright-mcp/)
UNTRACKED_DOCS: 10 (4 MEDICAL_*, 3 STITCH_*, WWW_SSL hotfix, COMMIT_3E51A724 audit, + STITCH modified is tracked)
PROTOCOL_X_STATUS: DELETED_TRACKED_FILE_UNSTAGED (harmless banner script, no secrets) — decision deferred to a separate gate
NAMAWEB_STATUS: SUBMODULE_DIRTY (gitlink delta only; namaweb worktree clean except untracked .claude/; gitlink bump deferred)
SAFE_TO_RUN_STAGING_DDL_GATE: YES_STAGING_ONLY_WITH_OWNER_APPROVAL
SAFE_TO_START_PHASE_2: NO
SAFE_TO_PUSH: NO (no safe private remote + out-of-scope dirty items must be cleaned first)
RECOMMENDED_NEXT_ACTION: run a dedicated WORKTREE_HYGIENE cleanup gate (gitignore local tooling, decide PS1 deletions, separate UI/SSL/governance docs into their own commits) BEFORE any push; namaweb gitlink bump + staging DDL gate remain owner decisions
```
