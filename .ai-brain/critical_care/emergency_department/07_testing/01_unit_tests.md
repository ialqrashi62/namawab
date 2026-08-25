| fn | case | expect |
|---|---|---|
| esi_triage | happy path | ok:true |
| door_to_doctor_timer | happy path | ok:true |
| code_activation | happy path | ok:true |
| tox_ingest_assess | happy path | ok:true |
| obs_reassess | happy path | ok:true |
| esi_triage | missing tenant | 400 ValidationError |
