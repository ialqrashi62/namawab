# التحقق من تشغيل المالك لأداة KEK Escrow

> 2026-06-23 | تحقّق قراءة فقط. لم يُقرأ/يُطبع أي مفتاح أو passphrase أو محتوى ملف escrow. لا تغيير إنتاجي.

## النتيجة: لم يُشغّل المالك الأداة بعد
فحص (للقراءة فقط) للمسارات الافتراضية والمرجّحة لملف الـescrow **لم يجد أي حزمة escrow**:
- `C:\Users\ice\nama_kek_escrow.enc` — غير موجود
- `C:\Users\ice\Desktop\...` و `Documents\...` — غير موجود
- لا أي `*.enc` / `*.kek.escrow` في جذر ملف تعريف المستخدم

⟶ **الـescrow الفعلي لم يُنشأ بعد.** فجوة DR (ربط DPAPI بالمستخدم/الجهاز) **لا تزال مفتوحة**. الأداة جاهزة وآمنة؛ تنفيذها إجراء مالك.

> التزاماً بالتقرير الأمين، لم تُعلَن حالة "VERIFIED" لأن الحدث لم يقع. الحالة الصحيحة = pending owner run.

## ما تم التحقق منه (سلامة + هيجين)
| البند | النتيجة |
|---|---|
| حزمة escrow موجودة | **لا** (لم تُنشأ) |
| حزمة escrow في المستودع | لا |
| حزمة escrow staged/tracked | لا (لا `*.enc` متتبَّع) |
| الأداة `ops/security/nama_kek_escrow.ps1` متتبَّعة | نعم (الأداة فقط — بلا مفتاح؛ صحيح أن تُلتزَم) |
| DPAPI blob خارج المستودع | نعم ✓ (`C:\Users\ice\nama_kek.dpapi`، غير متتبَّع) |
| .env / credentials / keys staged | لا |
| مفتاح/passphrase/blob/محتوى escrow مطبوع | **لا** (لم يُقرأ شيء منها) |
| hash/size للحزمة | غير متاح (لا حزمة بعد) |

## إجراء المالك لإغلاق فجوة DR (تعليمات)
1. **التشغيل** (كنفس المستخدم الذي يشغّل التطبيق):
   ```
   powershell -NoProfile -File ops\security\nama_kek_escrow.ps1 -Mode escrow -OutFile C:\Users\ice\nama_kek_escrow.enc
   ```
   أدخل passphrase قوياً (≥12 محرفاً) مرتين. (الأداة لا تطبع المفتاح/الـpassphrase.)
2. **النقل offline**: انقل `nama_kek_escrow.enc` إلى تخزين آمن **خارج هذا الجهاز** (USB مشفّر/خزنة)، ولا تتركه على نفس الصندوق مع البيانات.
3. **تخزين الـpassphrase منفصلاً** (مدير أسرار/ظرف مغلق) — بدونه لا استرداد.
4. **استثناء** الـDPAPI blob من مجموعة النسخ الاحتياطي.
5. **الاسترداد** (على جهاز جديد عند الكارثة):
   ```
   powershell -NoProfile -File ops\security\nama_kek_escrow.ps1 -Mode recover -EscrowFile <path>\nama_kek_escrow.enc -BlobPath C:\Users\ice\nama_kek.dpapi
   ```
   ثم تأكّد أن `NAMA_KEK_PATH` يشير إليه وأعد تشغيل التطبيق.
6. أعد إصدار `VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP` بعد التشغيل وسأتحقّق (existence/size/hash فقط، بلا محتوى).

## الحقول
```text
FINAL_STATUS: OWNER_RUN_KEK_ESCROW_NOT_YET_DETECTED_PENDING_OWNER_RUN
ESCROW_PACKAGE_CREATED: NO
ESCROW_PACKAGE_PATH: (none found)
ESCROW_PACKAGE_SIZE: N/A
ESCROW_PACKAGE_HASH_RECORDED: N/A (no package)
ESCROW_PACKAGE_IN_REPO: NO
ESCROW_PACKAGE_STAGED: NO
KEY_PRINTED: NO
PASSPHRASE_PRINTED: NO
DPAPI_BLOB_PRINTED: NO
SECRETS_PRINTED: NO
PRODUCTION_CHANGES: NONE
DDL_EXECUTED: NO
DATA_CHANGED: NO
CODE_DEPLOYED: NO
ACCOUNTING_POSTING_ENABLED: OFF
JOURNAL_COUNT: 0
FORCE_PUSH_USED: NO
DR_GAP_STATUS: STILL_OPEN (DPAPI machine/user-bound; no offline escrow yet)
NEXT_RECOMMENDED_ACTION: OWNER_RUN_ESCROW_TOOL then re-issue VERIFY_OWNER_RUN_KEK_ESCROW_AND_CLOSE_DR_GAP
```

تم التحقق من escrow الخاص بالـKEK دون كشف مفاتيح أو passphrase أو تغيير إنتاجي — والنتيجة أن الأداة لم تُشغَّل بعد، وفجوة DR ما زالت مفتوحة بانتظار تشغيل المالك
