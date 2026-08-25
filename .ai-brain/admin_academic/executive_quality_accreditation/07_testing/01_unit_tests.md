| fn | case | expect |
|---|---|---|
| sentinel_event_open | happy path | ok:true |
| credential_verify | happy path | ok:true |
| audit_cycle | happy path | ok:true |
| complaint_triage | happy path | ok:true |
| kpi_dashboard_data | happy path | ok:true |
| sentinel_event_open | missing tenant | 400 ValidationError |
