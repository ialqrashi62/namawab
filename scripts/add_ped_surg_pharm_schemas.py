"""
Add pediatrics + surgery + pharmacy schemas.
"""
from pathlib import Path

WORKTREE = Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb_waveA_subagent\route_schemas.js")
src = WORKTREE.read_text(encoding="utf-8")

block = """
const pediatricsApgarCreate = {
    patient_id:    { type: 'id', required: true },
    encounter_id:  { type: 'id', required: false },
    time_minutes:  { type: 'int', required: false, min: 1, max: 60 },
    appearance:    { type: 'int', required: true, min: 0, max: 2 },
    pulse:         { type: 'int', required: true, min: 0, max: 2 },
    grimace:       { type: 'int', required: true, min: 0, max: 2 },
    activity:      { type: 'int', required: true, min: 0, max: 2 },
    respiration:   { type: 'int', required: true, min: 0, max: 2 }
};

const pediatricsVitalsCreate = {
    patient_id:    { type: 'id', required: true },
    encounter_id:  { type: 'id', required: false },
    age_years:     { type: 'num', required: true, min: 0, max: 18 },
    heart_rate:    { type: 'int', required: false, min: 0, max: 300 },
    rr_per_min:    { type: 'int', required: false, min: 0, max: 100 },
    systolic_bp:   { type: 'int', required: false, min: 0, max: 250 }
};

const pediatricsFluidCreate = {
    patient_id:  { type: 'id', required: true },
    encounter_id:{ type: 'id', required: false },
    weight_kg:   { type: 'num', required: true, min: 0.5, max: 150 },
    age_years:   { type: 'num', required: false, min: 0, max: 18 }
};

const pediatricsCroupCreate = {
    patient_id:    { type: 'id', required: true },
    encounter_id:  { type: 'id', required: false },
    stridor:       { type: 'int', required: true, min: 0, max: 3 },
    retractions:   { type: 'int', required: true, min: 0, max: 3 },
    air_entry:     { type: 'int', required: true, min: 0, max: 2 },
    cyanosis:      { type: 'int', required: true, min: 0, max: 4 },
    consciousness: { type: 'int', required: true, min: 0, max: 5 }
};

const pediatricsPewsCreate = {
    patient_id:     { type: 'id', required: true },
    encounter_id:   { type: 'id', required: false },
    behavior:       { type: 'int', required: true, min: 0, max: 3 },
    cardiovascular: { type: 'int', required: true, min: 0, max: 3 },
    respiratory:    { type: 'int', required: true, min: 0, max: 3 }
};

const surgeryAsaCreate = {
    patient_id:   { type: 'id', required: true },
    encounter_id: { type: 'id', required: false },
    asa_class:    { type: 'int', required: true, min: 1, max: 6 },
    emergency:    { type: 'bool', required: false }
};

const surgeryRiskCreate = {
    patient_id:        { type: 'id', required: true },
    encounter_id:      { type: 'id', required: false },
    age:               { type: 'int', required: true, min: 0, max: 120 },
    asa_class:         { type: 'int', required: true, min: 1, max: 6 },
    procedure_risk:    { type: 'enumOf', allowed: ['low','moderate','high','very_high'], required: true },
    emergency:         { type: 'bool', required: false }
};

const surgeryTimeoutCreate = {
    patient_id:      { type: 'id', required: true },
    encounter_id:    { type: 'id', required: false },
    phase:           { type: 'enumOf', allowed: ['sign_in','time_out','sign_out'], required: true },
    completed_items: { type: 'str', required: true, max: 5000 }
};

const surgeryCapriniCreate = {
    patient_id:               { type: 'id', required: true },
    encounter_id:             { type: 'id', required: false },
    age_41_60:                { type: 'bool', required: false },
    age_61_74:                { type: 'bool', required: false },
    age_75_plus:              { type: 'bool', required: false },
    prior_vte:                { type: 'bool', required: false },
    family_vte:               { type: 'bool', required: false },
    known_thrombophilia:      { type: 'bool', required: false },
    surgery_within_30d:       { type: 'bool', required: false },
    immobility_3d:            { type: 'bool', required: false },
    central_line:             { type: 'bool', required: false },
    malignancy:               { type: 'bool', required: false },
    chemotherapy:             { type: 'bool', required: false },
    bmi_above_40:             { type: 'bool', required: false },
    smoking:                  { type: 'bool', required: false },
    oral_contraceptives:      { type: 'bool', required: false },
    hrt:                      { type: 'bool', required: false },
    pregnancy_postpartum:     { type: 'bool', required: false }
};

const pharmacyInteractionsCreate = {
    patient_id:   { type: 'id', required: true },
    encounter_id: { type: 'id', required: false },
    drugs:        { type: 'str', required: true, max: 4000 }
};

const pharmacyRenalDoseCreate = {
    patient_id:                { type: 'id', required: true },
    encounter_id:              { type: 'id', required: false },
    drug_name:                 { type: 'str', required: true, max: 200 },
    standard_dose_mg:          { type: 'num', required: true, min: 0.01, max: 5000 },
    frequency_per_day:         { type: 'int', required: true, min: 1, max: 24 },
    age:                       { type: 'int', required: true, min: 0, max: 120 },
    weight_kg:                 { type: 'num', required: true, min: 0.5, max: 300 },
    serum_creatinine_mg_dl:    { type: 'num', required: true, min: 0.1, max: 30 },
    sex:                       { type: 'enumOf', allowed: ['male','female'], required: true }
};

const pharmacyPregnancyCreate = {
    patient_id:   { type: 'id', required: true },
    encounter_id: { type: 'id', required: false },
    drugs:        { type: 'str', required: true, max: 4000 }
};

"""

idx = src.find("module.exports = {")
src = src[:idx] + block + "\n" + src[idx:]

exports_open = src.find("module.exports = {", idx)
brace_open = src.find("{", exports_open)
depth = 0
i = brace_open
while i < len(src):
    c = src[i]
    if c == "{": depth += 1
    elif c == "}":
        depth -= 1
        if depth == 0: break
    i += 1

exports_body = src[brace_open+1:i]
new_body = exports_body.replace(
    "invoiceCreate,",
    "invoiceCreate,\n    pediatricsApgarCreate, pediatricsVitalsCreate, pediatricsFluidCreate, pediatricsCroupCreate, pediatricsPewsCreate, surgeryAsaCreate, surgeryRiskCreate, surgeryTimeoutCreate, surgeryCapriniCreate, pharmacyInteractionsCreate, pharmacyRenalDoseCreate, pharmacyPregnancyCreate,",
    1
)
src = src[:brace_open+1] + new_body + src[i:]
WORKTREE.write_text(src, encoding="utf-8")
print("OK - 12 new schemas added (pediatrics 5 + surgery 4 + pharmacy 3)")
