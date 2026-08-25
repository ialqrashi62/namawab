| fn | case | expect |
|---|---|---|
| egfr_calculate | happy path | ok:true |
| dialysis_prescribe | happy path | ok:true |
| ktv_measure | happy path | ok:true |
| transplant_workup | happy path | ok:true |
| phosphate_manage | happy path | ok:true |
| egfr_calculate | missing tenant | 400 ValidationError |
