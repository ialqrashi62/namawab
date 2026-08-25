| fn | case | expect |
|---|---|---|
| device_pm_due | happy path | ok:true |
| calibration_record | happy path | ok:true |
| pacs_downtime_toggle | happy path | ok:true |
| translate_request | happy path | ok:true |
| epidemic_forecast | happy path | ok:true |
| device_pm_due | missing tenant | 400 ValidationError |
