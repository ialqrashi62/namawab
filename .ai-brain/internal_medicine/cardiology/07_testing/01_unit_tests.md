| fn | case | expect |
|---|---|---|
| risk_stratify | happy path | ok:true |
| ecg_interpret | happy path | ok:true |
| echo_order | happy path | ok:true |
| med_titrate | happy path | ok:true |
| followup_plan | happy path | ok:true |
| risk_stratify | missing tenant | 400 ValidationError |
