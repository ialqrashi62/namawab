# Phase 2 — البنية الموصى (طبقتان + مزوّدون)

> توصية هندسية. لا إنشاء مفاتيح. القرار النهائي للمالك.

## البنية
```
Layer 1: طبقة تشفير envelope في التطبيق (AES-256-GCM، DEK لكل مجال) — موجودة (crypto_envelope.js)
Layer 2: واجهة مزوّد KEK مجرّدة (getKEK / wrap / unwrap / sign)
   Provider A: DPAPI (الحالي، المرحلة 1)
   Provider B: Vault / Cloud KMS (المرحلة 2 — حضانة مستقلة عن الجهاز)
   Provider C: HSM / private-key custody (للمفاتيح الخاصة التنظيمية: ZATCA CSID, NPHIES mTLS)
```

## التوصية
- **العام at-rest (mfa_secret/PHI/backups)**: Hybrid — يبقى DPAPI (Provider A) حتى تتوفّر بنية، ثم **Vault on-prem (Provider B)** عبر re-wrap (الأنسب on-prem سعودي بلا تبعية سحابة)؛ KMS سحابي بديل إن قُبلت السحابة وإقامة البيانات.
- **المفاتيح الخاصة التنظيمية (ZATCA CSID / NPHIES)**: **Vault PKI/transit أو HSM (Provider C)** — المفتاح الخاص لا يُصدَّر؛ التوقيع يتم داخل الحدّ الآمن. **لا DPAPI لها في الإنتاج.**

## القدرات المطلوبة (يدعمها التصميم)
| القدرة | كيف |
|---|---|
| re-wrap بلا إعادة تشفير البيانات | تبديل KEK في Layer 2 ⟹ إعادة تغليف الـDEK فقط |
| key versioning | معرّف نسخة KEK يُحفظ مع الـDEK المغلّف (header) |
| key rotation | توليد KEK جديد ⟹ re-wrap الـDEKs ⟹ إبطال القديم (مع escrow) |
| mfa_secret / phi_vault / backup encryption | كلها عبر Layer 1 DEKs |
| ZATCA CSID / NPHIES mTLS custody | Provider C (Vault PKI/HSM) — sign-in-place |
| audit events | مزوّد B/C يسجّل كل استخدام مفتاح |
| break-glass | إجراء استرداد موثّق (escrow KEK + موافقة مزدوجة) — انظر 04 |

## ملاحظة على الحالة الحالية
طبقة Layer 1 منفّذة فعلاً (`crypto_envelope.js`) وتدعم passthrough للنص القديم؛ إضافة Provider B/C = تنفيذ واجهة KEK جديدة دون لمس بيانات مشفّرة (re-wrap فقط). الترقية لا تتطلّب إعادة تشفير الـDEKs للبيانات.
```text
RECOMMENDED: Hybrid envelope; KEK Provider A=DPAPI now -> B=Vault on-prem (general) ; C=Vault-PKI/HSM (regulatory private keys)
```
