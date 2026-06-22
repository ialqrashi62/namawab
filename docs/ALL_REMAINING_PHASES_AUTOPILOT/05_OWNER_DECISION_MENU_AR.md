# قائمة قرار المالك

> اختر بوابة واحدة أو أكثر. كل تنفيذ عبر بروتوكول محكوم منفصل. المحاسبة تبقى OFF ما لم تُختر بوابتها صراحة.

## آمن الآن (بلا أسرار/شهادات/طرف خارجي/PHI/محاسبة)
| الرمز | الوصف | المخرج | المخاطرة |
|---|---|---|---|
| `APPROVE_A3_DPAPI_KEK_ESCROW_READINESS` | توثيق escrow الـKEK + خطة DR | وثيقة + إجراء | منخفضة |
| `APPROVE_RESTORE_DRILL_ISOLATED_DB` | drill استعادة دوري على DB معزولة | تقرير drill (نُفِّذ نموذج هذه الجلسة) | منخفضة |
| `APPROVE_PHASE_B_D1_MIRTH_ASSESSMENT` | تقييم محرّك تكامل معزول | قرار معماري | منخفضة |
| `APPROVE_PHASE_B_D2_FHIR_SANDBOX_LOCAL_NO_PHI` | FHIR محلي بلا PHI | candidate + mapping | متوسطة |
| `APPROVE_PHASE_B_D5_ORTHANC_PACS_SANDBOX` | تقييم Orthanc كـPACS تجريبي | candidate | متوسطة |
| `APPROVE_OPS_RUNBOOKS_AND_OBSERVABILITY` | runbooks/أدلة/مراقبة | وثائق + تصميم | منخفضة |
| `APPROVE_TENANT_ID_INDEX_CANDIDATE` | فهارس tenant_id (CONCURRENTLY) | تنفيذ آمن بلا قفل | منخفضة |

## يحتاج مفتاح/شهادة أو طرف خارجي (readiness الآن، تنفيذ لاحق)
| الرمز | الوصف | الحاجز |
|---|---|---|
| `APPROVE_VAULT_KMS_PHASE2_KEY_MODEL` | المرحلة 2 لإدارة المفاتيح | Vault/HSM/KMS |
| `APPROVE_ZATCA_PHASE2_READINESS_ONLY` | جاهزية ZATCA Ph2 | CSID/Fatoora |
| `APPROVE_NPHIES_READINESS_ONLY` | جاهزية NPHIES | onboarding/شهادة |
| `APPROVE_ENCRYPTED_OFFSITE_BACKUPS` | نسخ مشفّرة خارج الموقع | مفتاح + وجهة |

## بوابات حسّاسة (صريحة فقط)
| الرمز | الوصف | تحذير |
|---|---|---|
| `APPROVE_AUDIT_READER_GRANT_AND_DEPLOY` | منح قارئ التدقيق + endpoint | نشر كود |
| `APPROVE_ACCOUNTING_POSTING_ENABLEMENT` | تفعيل قيود المحاسبة | **عالية — يبقى OFF افتراضاً؛ بوابة مخصّصة منفصلة** |
| `APPROVE_R17_BETA_REVIEW_ONLY` | مراجعة صفحات beta (R17) | read-only، لا merge |
| `APPROVE_FINAL_POST_ACCEPTANCE_ROADMAP_FREEZE` | تجميد خارطة ما بعد القبول | إغلاق |

## التوصية
ابدأ بالموجة الآمنة في التقرير 04: `APPROVE_A3_DPAPI_KEK_ESCROW_READINESS` + `APPROVE_PHASE_B_D1_MIRTH_ASSESSMENT` (و/أو `D2`). للتكاملات التنظيمية: قرار المفاتيح (Vault/KMS) أولاً. المحاسبة عند الحاجة فقط ببوابتها المخصّصة.
