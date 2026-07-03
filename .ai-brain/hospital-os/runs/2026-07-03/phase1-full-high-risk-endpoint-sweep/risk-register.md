# Risk Register

| الخطر | الحالة | التعامل |
|---|---|---|
| DB schema drift | مفتوح | يحتاج isolated DB validation |
| webhooks/callbacks الخارجية | مفتوح | تحتاج gateway signature/verification policy |
| Production deploy | غير منفذ | مؤجل بقرار منفصل |
| UI/Stitch | غير مطبق | لا UI جديد في هذه المرحلة |
| بيانات مرضى/أسرار | مغلق | لم تتم طباعة أسرار أو PHI |
