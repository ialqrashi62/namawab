| fn | case | expect |
|---|---|---|
| va_snellen | happy path | ok:true |
| cataract_biometry | happy path | ok:true |
| iop_tonometry | happy path | ok:true |
| retina_oct_scan | happy path | ok:true |
| lasik_candidate | happy path | ok:true |
| va_snellen | missing tenant | 400 ValidationError |
