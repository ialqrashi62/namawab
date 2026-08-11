"""
Add 5 cardiology schemas to route_schemas.js in the worktree.
"""
import re
from pathlib import Path

WORKTREE = Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb_waveA_subagent\route_schemas.js")

src = WORKTREE.read_text(encoding="utf-8")

block = """
const cardiologyGraceCreate = {
    patient_id:                  { type: 'id', required: true },
    encounter_id:                { type: 'id', required: false },
    age:                         { type: 'int', required: true, min: 18, max: 120 },
    heart_rate:                  { type: 'int', required: true, min: 20, max: 250 },
    systolic_bp:                 { type: 'int', required: true, min: 30, max: 280 },
    creatinine_mg_dl:            { type: 'num', required: true, min: 0.1, max: 20 },
    killip_class:                { type: 'int', required: true, min: 1, max: 4 },
    cardiac_arrest_at_admission: { type: 'bool', required: false },
    st_deviation:                { type: 'bool', required: false },
    elevated_enzymes:            { type: 'bool', required: false }
};

const cardiologyCha2ds2vascCreate = {
    patient_id:        { type: 'id', required: true },
    encounter_id:      { type: 'id', required: false },
    age:               { type: 'int', required: true, min: 18, max: 120 },
    sex:               { type: 'enumOf', allowed: ['male','female'], required: true },
    chf:               { type: 'bool', required: false },
    hypertension:      { type: 'bool', required: false },
    diabetes:          { type: 'bool', required: false },
    stroke_history:    { type: 'bool', required: false },
    vascular_disease:  { type: 'bool', required: false }
};

const cardiologyHasbledCreate = {
    patient_id:               { type: 'id', required: true },
    encounter_id:             { type: 'id', required: false },
    uncontrolled_hypertension:{ type: 'bool', required: false },
    abnormal_renal:           { type: 'bool', required: false },
    abnormal_liver:           { type: 'bool', required: false },
    stroke_history:           { type: 'bool', required: false },
    bleeding_history:         { type: 'bool', required: false },
    labile_inr:               { type: 'bool', required: false },
    age:                      { type: 'int', required: true, min: 18, max: 120 },
    concomitant_drugs:        { type: 'bool', required: false },
    alcohol_use:              { type: 'bool', required: false }
};

const cardiologyHfClassCreate = {
    patient_id:               { type: 'id', required: true },
    encounter_id:             { type: 'id', required: false },
    nyha_class:               { type: 'int', required: true, min: 1, max: 4 },
    lvef_pct:                 { type: 'num', required: false, min: 5, max: 80 },
    structural_heart_disease: { type: 'bool', required: false }
};

const cardiologyTroponinInterpretCreate = {
    patient_id:        { type: 'id', required: true },
    encounter_id:      { type: 'id', required: false },
    troponin_value:    { type: 'num', required: true, min: 0, max: 100000 },
    cutoff:            { type: 'num', required: true, min: 0, max: 100000 },
    delta_pct:         { type: 'num', required: true, min: -100, max: 1000 },
    hours_since_onset: { type: 'num', required: false, min: 0, max: 168 }
};

"""

idx = src.find("module.exports = {")
if idx < 0:
    raise RuntimeError("module.exports not found")

src = src[:idx] + block + "\n" + src[idx:]

# Now add to exports list
# Find the opening of exports, then walk to closing brace
exports_open = src.find("module.exports = {", idx)
brace_open = src.find("{", exports_open)
# Match brace
depth = 0
i = brace_open
while i < len(src):
    c = src[i]
    if c == "{":
        depth += 1
    elif c == "}":
        depth -= 1
        if depth == 0:
            break
    i += 1

exports_body = src[brace_open+1:i]

# Insert the new names right after invoiceCreate
insert_after = "invoiceCreate,"
if insert_after in exports_body:
    new_body = exports_body.replace(
        insert_after,
        insert_after + "\n    cardiologyGraceCreate, cardiologyCha2ds2vascCreate, cardiologyHasbledCreate, cardiologyHfClassCreate, cardiologyTroponinInterpretCreate,",
        1
    )
    src = src[:brace_open+1] + new_body + src[i:]
    WORKTREE.write_text(src, encoding="utf-8")
    print("OK - 5 cardiology schemas added to route_schemas.js")
else:
    print("ERROR: 'invoiceCreate,' not found in exports body")
    print("First 200 chars of body:")
    print(exports_body[:200])
