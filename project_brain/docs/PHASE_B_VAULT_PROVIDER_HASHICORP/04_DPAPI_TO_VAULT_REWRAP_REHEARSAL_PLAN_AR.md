# DPAPI → Vault — خطة Re-wrap Rehearsal (candidate، بلا تنفيذ)

> readiness فقط. لا re-wrap حقيقي إلا ببوابة `APPROVE_DPAPI_TO_VAULT_REWRAP_REHEARSAL_ONLY` + Vault متوفّر.

## المبدأ (NM_SECURITY_DR_KEY_MANAGEMENT)
re-wrap = إعادة تغليف الـKEK عبر Vault transit، **لا** إعادة تشفير بيانات. الـDEKs ثابتة؛ يتغيّر مزوّد حماية الـKEK فقط.

## خطوات الـrehearsal (على بيئة معزولة/dummy)
1. تشغيل Vault sandbox (loopback) + تفعيل `transit` + إنشاء مفتاح `nama-kek` (dummy، في الـsandbox فقط).
2. توليد KEK اختباري dummy + تغليفه بـVault transit (نسخة v2) — بلا لمس KEK الإنتاج.
3. تشفير/فك عيّنة dummy عبر v2 + مطابقة round-trip.
4. dual-read: إثبات قراءة v1 (DPAPI) و v2 (Vault) عبر معرّف النسخة في الـheader.
5. rollback: العودة لـv1 فوراً؛ إثبات عدم فقدان.
6. هدم الـsandbox.

## نقاط موافقة المالك
1. تشغيل Vault sandbox (image pull) — بوابة.
2. rehearsal re-wrap (dummy) — بوابة.
3. re-wrap الإنتاج + نافذة صيانة — بوابة منفصلة.
4. إبطال v1 (DPAPI) بعد drill — بوابة.

## الحدود
لا KEK إنتاج يُلمَس؛ لا re-wrap إنتاجي؛ dummy فقط؛ escrow الـKEK (DR) يبقى شبكة أمان حتى اكتمال الهجرة.
```text
REWRAP_REHEARSAL: PLAN_READY (not executed) | REAL_KEK_TOUCHED: NO
NEXT: APPROVE_DPAPI_TO_VAULT_REWRAP_REHEARSAL_ONLY
```
