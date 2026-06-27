# Vault — Deployment Candidate (لم يُشغَّل)

> readiness فقط. الـcompose في `tools/vault-sandbox/docker-compose.candidate.yml` — **غير مُشغَّل** (سحب الصورة = استدعاء خارجي؛ تشغيل مخزن مفاتيح = بوابة موافقة).

## طوبولوجيا
- **Sandbox/dev**: حاوية Vault loopback `127.0.0.1:8200`، تخزين مؤقت، لإثبات المسارات/السياسات بـdummy فقط.
- **Production (بوابة لاحقة)**: تخزين **Integrated Storage (raft)** أو ملف، **TLS listener** (لا HTTP)، **unseal** (Shamir أو auto-unseal بـHSM/KMS)، **audit device** مُفعّل، نسخ احتياطي لحالة Vault، HA إن لزم.

## الإقلاع/Unseal (production)
- مفاتيح unseal مُوزّعة (Shamir) أو auto-unseal؛ root token يُلغى بعد الإعداد؛ وصول عبر AppRole/policies لا root.
- **break-glass**: إجراء استرداد موثّق (unseal keys في حضانة منفصلة + موافقة مزدوجة) — يتكامل مع KEK escrow.

## التكامل مع التطبيق
- Provider B في `crypto_envelope.js`: واجهة KEK تستدعي Vault `transit` (wrap/unwrap) بدل DPAPI؛ لا يُصدَّر المفتاح.
- اعتماد التطبيق على Vault: AppRole + token قصير العمر (خارج git/.env داخل المستودع).

## الحدود (هذه البوابة)
لا تشغيل/init/unseal فعلي، لا مفاتيح، لا token حقيقي مُلتزَم، loopback فقط عند التشغيل لاحقاً.
```text
DEPLOYMENT_STATUS: CANDIDATE_READY (not run; image not pulled this gate)
LOOPBACK_ONLY: YES | TLS_IN_PRODUCTION: REQUIRED | AUDIT_DEVICE: REQUIRED
```
