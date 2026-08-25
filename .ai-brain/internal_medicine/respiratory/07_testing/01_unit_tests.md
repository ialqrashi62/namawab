| fn | case | expect |
|---|---|---|
| spirometry_interpret | happy path | ok:true |
| inhaler_optimize | happy path | ok:true |
| sleep_study_order | happy path | ok:true |
| oxygen_titrate | happy path | ok:true |
| exacerbation_plan | happy path | ok:true |
| spirometry_interpret | missing tenant | 400 ValidationError |
