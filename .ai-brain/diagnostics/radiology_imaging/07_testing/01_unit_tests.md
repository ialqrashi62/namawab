| fn | case | expect |
|---|---|---|
| order_study | happy path | ok:true |
| contrast_safety_check | happy path | ok:true |
| report_structured | happy path | ok:true |
| radiation_dose_log | happy path | ok:true |
| critical_result_notify | happy path | ok:true |
| order_study | missing tenant | 400 ValidationError |
