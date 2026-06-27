# Vault — Secret Paths & Policies (تصميم)

> أسماء مسارات/سياسات فقط، بلا أي سرّ/مفتاح حقيقي.

## محرّكات الأسرار (mounts)
| المحرّك | المسار | الغرض |
|---|---|---|
| transit | `transit/keys/nama-kek` | KEK wrap/unwrap لتشفير at-rest (Provider B) |
| pki (regulatory) | `pki-zatca/`, `pki-nphies/` | إصدار/حضانة شهادات mTLS + توقيع (Provider C) |
| kv-v2 | `secret/nama/integration/*` | اعتمادات تكاملات (sandbox/prod منفصلان) |

## السياسات (least-privilege، أسماء فقط)
- `nama-app-kek`: `update` على `transit/encrypt/nama-kek` + `transit/decrypt/nama-kek` فقط (لا قراءة المفتاح الخام).
- `nama-zatca-sign`: `update` على `transit/sign/...` أو `pki-zatca/sign/...` فقط.
- `nama-nphies-cert`: قراءة شهادة العميل + توقيع mTLS فقط.
- `nama-integration-ro`: قراءة `secret/nama/integration/<env>/*` للبيئة المحدّدة فقط.
- فصل **sandbox vs production** عبر mounts/namespaces/policies منفصلة.

## مبادئ
AppRole لكل خدمة؛ tokens قصيرة العمر؛ تدوير مفاتيح transit (versioned)؛ audit device يسجّل كل عملية؛ لا root في التشغيل؛ لا سرّ في git/.env داخل المستودع.

## الحدود
أسماء/تصميم فقط؛ لا إنشاء mounts/keys/policies فعلية في هذه البوابة.
```text
SECRET_PATHS_DESIGN: READY | REAL_SECRETS_CREATED: NO
```
