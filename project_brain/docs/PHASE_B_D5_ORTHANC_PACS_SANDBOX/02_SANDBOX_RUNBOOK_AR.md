# Phase B D5 — Orthanc PACS Sandbox — Runbook

> تشغيل آمن معزول. بلا أسرار/PHI. لا يلمس الإنتاج/DB/المحاسبة.

## أ) المحاكي المحلي (آمن الآن)
```
node tools/orthanc-sandbox/dicom_sim.js   # متوقع 7/7 PASS
```
metadata تركيبية فقط؛ يكتب لمجلد tmp ويُنظّفه؛ tripwires لـPHI/الشبكة.

## ب) Orthanc الفعلي (بعد موافقة المالك — image pull خارجي)
```
docker compose -f tools/orthanc-sandbox/docker-compose.candidate.yml up -d
```
- loopback فقط (`127.0.0.1:8042`/`4242`)؛ **لا تعريض عام، لا nginx، لا firewall rule**.
- ارفع dummy DICOM عبر STOW-RS محلي؛ استرجع WADO-RS؛ تحقّق من العزل.
- **التطبيق هو الواجهة الوحيدة للعميل** عبر `/api/phi-files/:id`؛ لا تعرّض Orthanc للمتصفّح.
- لا PHI/صور حقيقية في الـsandbox.

## التراجع (rollback)
- المحاكي: لا حالة دائمة.
- Orthanc الفعلي: `docker compose -f tools/orthanc-sandbox/docker-compose.candidate.yml down -v`.

## ما لا يُفعل
لا صور أشعة حقيقية/PHI؛ لا تعريض منافذ عامة؛ لا ربط route إنتاجي؛ لا nginx؛ لا تفعيل محاسبة؛ لا force push؛ لا merge R17.
