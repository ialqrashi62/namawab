| fn | case | expect |
|---|---|---|
| audiogram_read | happy path | ok:true |
| sinus_ct_lund | happy path | ok:true |
| cochlear candidacy | happy path | ok:true |
| voice_vhi_score | happy path | ok:true |
| tonsillectomy_indication | happy path | ok:true |
| audiogram_read | missing tenant | 400 ValidationError |
