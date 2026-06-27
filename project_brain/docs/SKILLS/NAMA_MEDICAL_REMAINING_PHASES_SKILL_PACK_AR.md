# NamaMedical — Remaining Phases Skill Pack — تقرير

> 2026-06-23 | أُنشئ Skill Pack مضغوط لكل المراحل المتبقية لتقليل التوكنز وتوحيد تنفيذ Auto Pilot بأمان. docs فقط، لا تغيير إنتاجي.

## ما أُنشئ (13 ملفاً تحت `.ai-brain/skills/nama-medical/`)
1. NM_GLOBAL_GATES (القواعد الدائمة + Gate 0 + نمط النشر/Git) · 2. NM_SECURITY_DR_KEY_MANAGEMENT · 3. NM_INTEGRATION_SANDBOX · 4. NM_FHIR_HAPI · 5. NM_MIRTH_NEXTGEN · 6. NM_ORTHANC_PACS · 7. NM_ZATCA_PHASE2 · 8. NM_NPHIES · 9. NM_CLINICAL_ADVANCED · 10. NM_OBSERVABILITY_OPS · 11. NM_FINANCE_ACCOUNTING_GUARD · 12. NM_GOVERNANCE_CLOSEOUT · 13. NM_SKILLS_INDEX (فهرس: Skill/الغرض/متى/المحظور/حقول الإغلاق).

## الفائدة
- البرومنتات القادمة تستشهد بـ`NM_GLOBAL_GATES` + المهارة الخاصة بدل تكرار قواعد السلامة وbaseline ⟹ توكنز أقل.
- توحيد التصنيفات وحقول الإغلاق والحدود (auth boundary، loopback، accounting OFF، no real PHI/keys).

## كيف تُستخدم
في أي بوابة: "فعّل NM_GLOBAL_GATES + NM_GOVERNANCE_CLOSEOUT + <مهارة البوابة>" — بدل لصق كل القواعد.

## الحقول
```text
FINAL_STATUS: NAMA_MEDICAL_REMAINING_PHASES_SKILL_PACK_READY
SKILLS_CREATED: 13 (12 skills + index)
SKILLS_UPDATED: 0 (new dir)
INDEX_UPDATED: YES (NM_SKILLS_INDEX_AR.md)
PRODUCTION_CHANGES: NONE
CODE_DEPLOYED: NO
DDL_EXECUTED: NO
DATA_CHANGED: NO
SECRETS_PRINTED: NO
KEYS_COMMITTED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_RLS_COUNT: 150
FORCE_PUSH_USED: NO
NEXT_RECOMMENDED_ACTION: USE_SKILL_PACK_IN_FUTURE_GATES (cite NM_GLOBAL_GATES + per-gate skill) — أو OWNER_SELECT_VAULT_KMS_PROVIDER / KEK_ESCROW_OWNER_RUN
```

تم إنشاء Skill Pack للمراحل المتبقية لتقليل التوكنز وتوحيد تنفيذ Auto Pilot بأمان
