# Phase B D1 — Mirth Sandbox — Runbook

> تشغيل آمن معزول. بلا أسرار. لا يلمس الإنتاج/DB/المحاسبة.

## أ) المحاكي المحلي (آمن الآن، بلا شبكة)
```
node tools/mirth-sandbox/channel_sim.js   # متوقع 7/7 PASS
```
- يستخدم dummy من `tools/fhir-sandbox/`؛ يكتب إلى مجلد مؤقت (tmp) ويُنظّفه؛ tripwire يمنع الخروج الشبكي.
- لا حاجة لأي تثبيت/شبكة/PHI.

## ب) Mirth الفعلي (بعد موافقة المالك — يتضمّن سحب صورة = شبكة)
عند `APPROVE` لاحق:
```
docker compose -f tools/mirth-sandbox/docker-compose.candidate.yml up -d
```
- يربط loopback فقط (`127.0.0.1:8443`/`6661`) — **لا تعرّضه عاماً، لا firewall rule، لا port-forward**.
- أنشئ قنوات `SBX_*` (dummy)، اربط `SBX_FHIR_BUNDLE_IN` بمخرجات D2.
- **لا PHI حقيقي، لا شهادات** في الـsandbox.
- التحقّق: حالة القنوات في Admin (loopback)، تدفّق رسالة dummy، DLQ على رسالة مشوّهة.

## التراجع (rollback)
- المحاكي: لا حالة دائمة (tmp يُنظّف).
- Mirth الفعلي: `docker compose -f tools/mirth-sandbox/docker-compose.candidate.yml down -v` (يزيل الحاوية + الحجم). لا أثر على الإنتاج/DB.

## ما لا يُفعل
لا تعريض منافذ عامة؛ لا PHI/شهادات حقيقية؛ لا ربط route إنتاجي؛ لا NPHIES/ZATCA/PACS؛ لا تفعيل محاسبة؛ لا force push؛ لا merge R17.
