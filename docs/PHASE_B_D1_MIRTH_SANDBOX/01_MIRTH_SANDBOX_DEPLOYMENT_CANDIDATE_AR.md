# Phase B D1 — Mirth/NextGen Connect — مرشّح نشر Sandbox (candidate فقط)

> 2026-06-23 | تصميم نشر sandbox محلي معزول. **لا endpoints خارجية، لا تكامل إنتاجي، لا PHI، لا تنفيذ.** هذا candidate يُنفَّذ ببوابة لاحقة.

## الطوبولوجيا (sandbox معزول)
```
[NamaMedical app :3000] --(واجهة محكومة/قناة محلية)--> [Mirth sandbox] --(loopback فقط)--> [محاكيات محلية / ملفات dummy]
                                                              |
                                                       [PostgreSQL: قناة sandbox منفصلة أو DB throwaway]
```
- خدمة Mirth **معزولة عن المونوليث** (عملية/حاوية مستقلة)، على نفس الصندوق (loopback) أو مضيف منفصل.
- **لا منفذ خارجي مفتوح**؛ كل القنوات على `127.0.0.1` في الـsandbox. لا اتصال بـZATCA/NPHIES/PACS/أجهزة حقيقية.
- بيانات dummy فقط؛ **لا PHI حقيقي**؛ لا قراءة من DB الإنتاج (DB throwaway أو schema sandbox).

## خيار النشر
| الخيار | إيجابيات | سلبيات |
|---|---|---|
| **Docker (موصى للـsandbox)** | عزل نظيف، حذف سهل، لا يلوّث الصندوق | تبعية Docker daemon (لوحظ سابقاً أنه قد يتوقّف) |
| Native (Mirth Connect service) | لا تبعية Docker | تثبيت/تنظيف أثقل |
> توصية sandbox: Docker (مؤقت، يُحذف بعد التجربة)؛ لأي إنتاج لاحق يُعاد تقييم Native vs Docker مع استرداد daemon.

## المنافذ (sandbox، loopback فقط)
- Mirth Administrator/API: محلي فقط (لا تعريض خارجي).
- قنوات HL7 MLLP: `127.0.0.1:<port>` تجريبي.
- قنوات HTTP/FHIR: `127.0.0.1:<port>` تجريبي.
- **لا port forwarding، لا firewall rule خارجي.**

## Persistence
- قاعدة Mirth الداخلية (تخزين الرسائل/القنوات) على وحدة sandbox منفصلة؛ تُحذف مع الـsandbox.
- لا كتابة في DB الإنتاج؛ أي تفاعل DB عبر schema/DB throwaway.

## نموذج الطابور/إعادة المحاولة
- قنوات Mirth توفّر persistence + retry + dead-letter مدمجة.
- ضمانات مستهدفة: at-least-once + idempotency key لكل رسالة؛ ترتيب لكل مريض/طلب؛ حدّ إعادة محاولة + dead-letter + تنبيه.

## التدقيق/المراقبة
- سجلّ رسائل Mirth (بلا PHI في السجلّات في الـsandbox — dummy فقط).
- في الإنتاج لاحقاً: ربط أحداث التكامل بـ`audit_trail` (action/module بلا حمولة PHI)، لوحة حالة القنوات، تنبيه على التراكم/الفشل.

## نموذج الأسرار/الشهادات
- **لا أسرار/شهادات حقيقية في الـsandbox.** أي mTLS/توقيع (NPHIES/ZATCA لاحقاً) يُدار عبر **نموذج المفاتيح (D0 / المرحلة 2 Vault/HSM)** بالمرجع — لا داخل Mirth config في Git.
- إعدادات Mirth لا تُلتزَم بأسرار؛ القيم الحسّاسة من مخزن خارجي.

## حدود صريحة (candidate)
```text
NO_EXTERNAL_ENDPOINTS: YES
NO_PRODUCTION_INTEGRATION: YES
NO_REAL_PHI: YES
NO_REAL_CERTIFICATES: YES
SANDBOX_ONLY: YES
```

## خطوات التنفيذ (عند بوابة `APPROVE_PHASE_B_D1_MIRTH_SANDBOX_DEPLOYMENT`)
1. تشغيل Mirth sandbox (Docker مؤقت، loopback).
2. قناة HL7 echo تجريبية (dummy ADT) → تحويل → تخزين sandbox.
3. قناة HTTP/FHIR تجريبية (dummy) ← تتكامل مع مرشّح D2.
4. إثبات queue/retry/dead-letter بـrسائل dummy.
5. توثيق + حذف الـsandbox (لا أثر إنتاجي).

## الحقول
```text
FINAL_STATUS: PHASE_B_D1_MIRTH_SANDBOX_DEPLOYMENT_CANDIDATE_READY
EXTERNAL_CALLS: NO
PRODUCTION_CHANGES: NONE
REAL_PHI_USED: NO
NEXT_GATE: APPROVE_PHASE_B_D1_MIRTH_SANDBOX_DEPLOYMENT
```
