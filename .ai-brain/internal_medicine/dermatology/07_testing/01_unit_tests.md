| fn | case | expect |
|---|---|---|
| lesion_triage_abcde | happy path | ok:true |
| biopsy_type | happy path | ok:true |
| phototherapy_dose | happy path | ok:true |
| acne_grade | happy path | ok:true |
| cosmetic_consult | happy path | ok:true |
| lesion_triage_abcde | missing tenant | 400 ValidationError |
