# Risk Register

| الخطر | الحالة | التعامل |
|---|---|---|
| Provider/raw-body compatibility | مفتوح | يحتاج staging/provider integration test |
| Missing production webhook secret | fail-closed | سيرفض webhook في الإنتاج حتى ضبط env |
| DB/server validation | blocked | يحتاج DB معزولة |
| Production deploy | غير منفذ | قرار منفصل |
