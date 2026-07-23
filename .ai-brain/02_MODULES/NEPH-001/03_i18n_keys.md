# NEPH-001 — i18n + Helpdesk + ADRs

## i18n
```json
{
  "neph.title": {"en": "Nephrology", "ar": "أمراض الكلى"},
  "neph.aki": {"en": "AKI", "ar": "إصابة كلوية حادة"},
  "neph.ckd": {"en": "CKD", "ar": "مرض كلوي مزمن"},
  "neph.egfr": {"en": "eGFR", "ar": "معدل الترشيح الكبيبي"},
  "neph.dialysis": {"en": "Dialysis", "ar": "غسيل الكلى"},
  "neph.hd": {"en": "Hemodialysis", "ar": "غسيل دموى"},
  "neph.pd": {"en": "Peritoneal Dialysis", "ar": "غسيل بريتوني"},
  "neph.transplant": {"en": "Transplant", "ar": "زرع"},
  "neph.k": {"en": "Potassium", "ar": "البوتاسيوم"},
  "neph.cr": {"en": "Creatinine", "ar": "الكرياتينين"},
  "neph.action.save": {"en": "Save", "ar": "حفظ"}
}
```

## Helpdesk
- L1: login, slow
- L2: eGFR, dialysis order
- L3: RLS, PHI

## ADRs
- tenant_id + RLS
- Renal dose adjustment mandatory
- Dialyzer = double-check
- HD water quality (per AAMI)
- Living donor = ethics + consent
- Transplant = MDT
- AI = assist
- Audit 7 years
- Transplant registry
- Patient education
