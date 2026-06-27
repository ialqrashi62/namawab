# Phase A3 — Full Encryption at-rest — محجوبة (BLOCKED، بلا أي تغيير إنتاجي)

> 2026-06-22 | تحقّق Gate 1 (شرط التنفيذ): **لا يوجد KMS ولا مفتاح تشغيل خارجي آمن جاهز** على هذا الصندوق المفرد. وفق قاعدة البوابة (STOP إن لم يكن KMS/المفتاح جاهزاً)، تَوقّف التنفيذ فوراً ولم يُغيَّر أي شيء في الإنتاج (لا DDL، لا كود، لا تشفير لأي بيانات).

## لماذا حُجِبت (نتيجة Gate 1 — فحص للقراءة فقط)
| الفحص | النتيجة |
|---|---|
| متغيّرات بيئة لـKMS (AWS/Azure/GCP/Vault/KEK/HSM) | **لا يوجد** |
| أسماء مفاتيح تشفير في `namaweb/.env` | **لا يوجد** |
| ملف مفتاح تشفير خارجي مخصّص (nama_phi_*_key …) | **لا يوجد** |
| وحدات npm لـKMS/DPAPI/KeyVault | **لا يوجد** |
| الأسرار الموجودة | فقط `C:\Users\ice\nama_medical_app_db_password` — وهو **اعتماد قاعدة بيانات** وليس مفتاح تشفير at-rest |

الخلاصة: `KMS_OR_EXTERNAL_RUNTIME_KEY_AVAILABLE = NO`. توليد مفتاح ذاتياً ووضعه بجوار قاعدة البيانات/النسخ على نفس الصندوق لا يوفّر حماية at-rest حقيقية ضد سرقة النسخة/القرص (المفتاح مع البيانات) — وهو ما تمنعه هذه البوابة عمداً. لذلك **لم يُولَّد ولا يُخزَّن أي مفتاح**.

## ما لم يُنفَّذ (متوقّف عند الشرط)
- لم يُشفَّر `mfa_secret` (يبقى كما هو؛ recovery codes مُجزّأة bcrypt أصلاً).
- لم تُشفَّر ملفات `phi_vault` (حالياً 0 ملف فعلي في الخزنة؛ المسار محمي بالأساس عبر A3A: auth + RLS + traversal-deny + content-type pinning).
- لا backup/rehearsal تشفيري نُفِّذ (لا داعي قبل توفّر المفتاح).

## الحقول
```text
FINAL_STATUS: BLOCKED_PENDING_KMS_OR_EXTERNAL_RUNTIME_KEY
KMS_OR_EXTERNAL_KEY_AVAILABLE: NO
KEY_PRINTED: NO
KEY_COMMITTED: NO
BACKUP_CREATED: NO (not needed — no production change)
REHEARSAL_STATUS: NOT_RUN (blocked at key gate)
MFA_SECRET_ENCRYPTED: NO (unchanged)
PHI_VAULT_ENCRYPTION: NOT_ENABLED (guarded route A3A still protects access)
FILES_ENCRYPTED_COUNT: 0
DDL_EXECUTED: NO
DATA_CHANGED: NO
CODE_DEPLOYED: NO
PM2_RESTARTED: NO
MFA_REGRESSION: N/A (no change)
PHI_FILE_GUARD_REGRESSION: N/A (no change)
HEALTH_STATUS: local 200, domain 200
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
SECRETS_PRINTED: NO
PRODUCTION_CHANGES: NONE
FORCE_PUSH_USED: NO
GIT_COMMIT: parent (docs only — this blocked-status record)
GIT_PUSH: FF (parent origin/master)
NEXT_RECOMMENDED_ACTION: OWNER_PROVISIONS_KEY (one of the options below) THEN re-issue APPROVE_PHASE_A3_FULL_ENCRYPTION_AT_REST
```

## كيف نرفع الحجب (خيارات للمالك — تُختار واحدة، خارج Git)
الكود جاهز للتنفيذ فور توفّر مفتاح؛ التصميم المقترح = **AES-256-GCM** (غلاف envelope) مع المفتاح يُقرأ بالمرجع فقط (path/id) ولا يُطبع/يُلتزَم:
1. **ملف مفتاح خارجي يضعه المالك** (أبسط، يطابق نمط هذا المشروع): المالك يولّد 32 بايت عشوائية ويكتبها في مسار خارج المستودع وخارج مجموعة النسخ الاحتياطي (مثل `C:\Users\ice\nama_phi_master_key`)، بصلاحية ACL مقيّدة. **شرط حاسم: يجب استثناء ملف المفتاح من النسخ الاحتياطي** وإلا فقدنا قيمة at-rest. التطبيق يقرأه عند الإقلاع فقط.
2. **Windows DPAPI** (`ProtectedData` عبر وحدة `win-dpapi` أو PowerShell): المفتاح الرئيس يديره نظام التشغيل (مربوط بالمستخدم/الجهاز)، لا يُخزّنه التطبيق ولا يدخل Git — مناسب للصندوق المفرد على Windows. يتطلب موافقة على إضافة وحدة أصلية أو استدعاء PowerShell وقت التشغيل.
3. **KMS سحابي** (AWS KMS / Azure Key Vault / GCP KMS): الأقوى، لكنه يتطلب اتصالاً سحابياً وحساباً — قد لا يناسب نشر on-prem المفرد.

عند توفّر أحدها: أعِد إصدار `APPROVE_PHASE_A3_FULL_ENCRYPTION_AT_REST` وسأنفّذ backup → rehearsal (decrypt round-trip + rollback) → تشفير `mfa_secret` + تشفير ملفات الخزنة الجديدة → تحقّق (MFA/PHI guard regression) → إغلاق.

## ملاحظات سلامة
- لم يُطبع أو يُولَّد أو يُلتزَم أي مفتاح. لا تغيير على المحاسبة (OFF، journal=0)، ولا DDL، ولا نشر كود، ولا مساس بـR17. التزام docs فقط.
- A3A (حارس ملفات PHI) و A2 (MFA) يبقيان نشطين كما هما؛ هذا الحجب لا يُضعف أي ضابط قائم.

تم تنفيذ أو حجب Phase A3 Full Encryption بأمان دون كشف مفاتيح أو تفعيل المحاسبة
