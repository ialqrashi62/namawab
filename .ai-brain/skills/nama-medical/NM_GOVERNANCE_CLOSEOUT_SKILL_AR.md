# NM_GOVERNANCE_CLOSEOUT_SKILL

**الغرض**: الحوكمة + نظافة الإغلاق + التقارير. **التفعيل**: نهاية كل بوابة + بوابات الحوكمة.

## نظافة ما قبل الـcommit (إلزامي)
```bash
git status --short ; git -C namaweb status --short
git diff --check ; git -C namaweb diff --check
# mojibake audit: grep -rlE "Ø|Ù|ï»¿|�" <docs>   (يجب: none)
# secrets scan: لا .env/credentials/keys/DPAPI blob/PHI/.pem/.dcm staged
git diff --cached --name-only   # تأكّد أنها فقط ملفات البوابة المقصودة
```
- التقارير: عربية UTF-8 فقط؛ لا mojibake (Ø Ù ï»¿ �).
- Push FF فقط؛ تأكيد `drift 0/0` بعد الدفع.
- لا تُجهّز ملفات خارج النطاق (STITCH/UI/migrate القديمة = تغييرات سابقة، لا تُلتزَم).

## مخرجات الحوكمة المتكرّرة
owner decision menu · risk register · roadmap freeze · client acceptance checklist · operation handover · support runbook · CBAHI/HIMSS readiness · Saudi compliance delta.

## حقول الإغلاق القياسية
`FINAL_STATUS · PRODUCTION_CHANGES · DDL/DATA/CODE · ACCOUNTING(OFF) · JOURNAL(0) · SECRETS_PRINTED(NO) · KEYS_COMMITTED(NO) · FORCE_PUSH_USED(NO) · GIT_COMMIT · GIT_PUSH(FF) · R17(UNTOUCHED) · NEXT_RECOMMENDED_ACTION`.

## العبارة النهائية
كل بوابة تُختم بعبارة عربية موجزة تلخّص ما تم + تأكيد عدم المساس بالمحاسبة/الأسرار.
