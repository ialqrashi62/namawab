"""
Add schemas for oncology + nephrology + obgyn.
"""
from pathlib import Path

WORKTREE = Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb_waveA_subagent\route_schemas.js")
src = WORKTREE.read_text(encoding="utf-8")

block = """
const oncologyTnmCreate = {
    patient_id:    { type: 'id', required: true },
    encounter_id:  { type: 'id', required: false },
    T:             { type: 'int', required: true, min: 0, max: 4 },
    N:             { type: 'int', required: true, min: 0, max: 3 },
    M:             { type: 'int', required: true, min: 0, max: 1 },
    cancer_type:   { type: 'str', required: false, max: 100 }
};

const oncologyBsaCreate = {
    patient_id:    { type: 'id', required: true },
    encounter_id:  { type: 'id', required: false },
    height_cm:     { type: 'num', required: true, min: 30, max: 250 },
    weight_kg:     { type: 'num', required: true, min: 0.5, max: 300 }
};

const oncologyChemoDoseCreate = {
    patient_id:    { type: 'id', required: true },
    encounter_id:  { type: 'id', required: false },
    drug_name:     { type: 'str', required: true, max: 200 },
    dose_per_m2:   { type: 'num', required: true, min: 0.01, max: 5000 },
    auc:           { type: 'num', required: false, min: 1, max: 10 },
    height_cm:     { type: 'num', required: true, min: 30, max: 250 },
    weight_kg:     { type: 'num', required: true, min: 0.5, max: 300 },
    dose_unit:     { type: 'enumOf', allowed: ['mg_per_m2','auc'], required: true }
};

const nephrologyCkdStageCreate = {
    patient_id:              { type: 'id', required: true },
    encounter_id:            { type: 'id', required: false },
    age:                     { type: 'int', required: true, min: 0, max: 120 },
    sex:                     { type: 'enumOf', allowed: ['male','female'], required: true },
    serum_creatinine_mg_dl:  { type: 'num', required: true, min: 0.1, max: 30 },
    albuminuria_category:    { type: 'enumOf', allowed: ['A1','A2','A3'], required: true }
};

const nephrologyHdAdequacyCreate = {
    patient_id:    { type: 'id', required: true },
    encounter_id:  { type: 'id', required: false },
    pre_bun_mg_dl: { type: 'num', required: true, min: 1, max: 200 },
    post_bun_mg_dl:{ type: 'num', required: true, min: 1, max: 200 },
    session_minutes:{ type: 'int', required: false, min: 30, max: 600 }
};

const obgynPartographCreate = {
    patient_id:            { type: 'id', required: true },
    encounter_id:          { type: 'id', required: false },
    current_dilation_cm:   { type: 'num', required: true, min: 0, max: 10 },
    hours_since_4cm:       { type: 'num', required: true, min: 0, max: 72 },
    parity:                { type: 'enumOf', allowed: ['nulliparous','multiparous'], required: true },
    contractions_per_10min:{ type: 'int', required: true, min: 0, max: 10 },
    descent_station:       { type: 'num', required: true, min: -5, max: 5 }
};

const obgynBishopCreate = {
    patient_id:      { type: 'id', required: true },
    encounter_id:    { type: 'id', required: false },
    dilation_cm:     { type: 'num', required: true, min: 0, max: 10 },
    effacement_pct:  { type: 'num', required: true, min: 0, max: 100 },
    station:         { type: 'num', required: true, min: -5, max: 5 },
    consistency:     { type: 'enumOf', allowed: ['firm','medium','soft'], required: true },
    position:        { type: 'enumOf', allowed: ['posterior','mid','anterior'], required: true }
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
    "invoiceCreate,\n    oncologyTnmCreate, oncologyBsaCreate, oncologyChemoDoseCreate, nephrologyCkdStageCreate, nephrologyHdAdequacyCreate, obgynPartographCreate, obgynBishopCreate,",
    1
)
src = src[:brace_open+1] + new_body + src[i:]
WORKTREE.write_text(src, encoding="utf-8")
print("OK - 7 new schemas added")
