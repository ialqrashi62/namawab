"""
Add endocrinology + ER schemas and a small migration for ER/endocrinology.
"""
from pathlib import Path
import re

WORKTREE = Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb_waveA_subagent\route_schemas.js")
src = WORKTREE.read_text(encoding="utf-8")

block = """
const glycemicAssessCreate = {
    patient_id:        { type: 'id', required: true },
    encounter_id:      { type: 'id', required: false },
    patient_type:      { type: 'enumOf', allowed: ['type1','type2','pregnancy','elderly','frail','pediatric'], required: true },
    age:               { type: 'int', required: true, min: 0, max: 120 },
    tir_pct:           { type: 'num', required: true, min: 0, max: 100 },
    gmi_pct:           { type: 'num', required: false, min: 3, max: 20 },
    hba1c:             { type: 'num', required: true, min: 3, max: 20 },
    time_below_70:     { type: 'num', required: false, min: 0, max: 100 },
    time_below_54:     { type: 'num', required: false, min: 0, max: 100 },
    notes:             { type: 'str', required: false, max: 2000 }
};

const insulinDoseCreate = {
    patient_id:           { type: 'id', required: true },
    encounter_id:         { type: 'id', required: false },
    current_glucose_mg_dl:{ type: 'num', required: true, min: 0, max: 1500 },
    target_glucose_mg_dl: { type: 'num', required: false, min: 70, max: 200 },
    total_daily_dose_units:{ type: 'num', required: false, min: 0, max: 300 },
    sensitivity_factor:   { type: 'num', required: false, min: 1, max: 1000 },
    notes:                { type: 'str', required: false, max: 1000 }
};

const thyroidInterpretCreate = {
    patient_id:   { type: 'id', required: true },
    encounter_id: { type: 'id', required: false },
    tsh_uIuml:    { type: 'num', required: true, min: 0, max: 1000 },
    ft4_ngdl:     { type: 'num', required: false, min: 0, max: 10 },
    ft3_pgml:     { type: 'num', required: false, min: 0, max: 20 },
    notes:        { type: 'str', required: false, max: 1000 }
};

const erTriageCreate = {
    patient_id:     { type: 'id', required: false },
    chief_complaint:{ type: 'str', required: true, max: 500 },
    age:            { type: 'int', required: false, min: 0, max: 130 },
    sex:            { type: 'enumOf', allowed: ['male','female','unknown'], required: false },
    heart_rate:     { type: 'int', required: false, min: 0, max: 300 },
    systolic_bp:    { type: 'int', required: false, min: 0, max: 300 },
    spo2_pct:       { type: 'num', required: false, min: 0, max: 100 },
    rr_per_min:     { type: 'int', required: false, min: 0, max: 80 },
    temp_c:         { type: 'num', required: false, min: 20, max: 46 },
    pain_score:     { type: 'int', required: false, min: 0, max: 10 },
    gcs_total:      { type: 'int', required: false, min: 3, max: 15 },
    arrival_mode:   { type: 'enumOf', allowed: ['walk-in','ambulance','wheelchair','transfer'], required: false },
    notes:          { type: 'str', required: false, max: 2000 }
};

"""

idx = src.find("module.exports = {")
src = src[:idx] + block + "\n" + src[idx:]

# Insert into exports
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
# Insert after invoiceCreate
new_body = exports_body.replace(
    "invoiceCreate,",
    "invoiceCreate,\n    glycemicAssessCreate, insulinDoseCreate, thyroidInterpretCreate, erTriageCreate,",
    1
)
src = src[:brace_open+1] + new_body + src[i:]
WORKTREE.write_text(src, encoding="utf-8")
print("OK - 4 schemas added")
