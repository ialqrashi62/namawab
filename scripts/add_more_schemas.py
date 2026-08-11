"""
Add schemas for pulmonology, GI, rheumatology, orthopedics, neurology.
"""
from pathlib import Path

WORKTREE = Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb_waveA_subagent\route_schemas.js")
src = WORKTREE.read_text(encoding="utf-8")

block = """
const pulmonologyAsthmaCreate = {
    patient_id:               { type: 'id', required: true },
    encounter_id:             { type: 'id', required: false },
    current_step:             { type: 'int', required: true, min: 1, max: 6 },
    fev1_pct:                 { type: 'num', required: true, min: 5, max: 150 },
    symptoms_per_week:        { type: 'int', required: false, min: 0, max: 50 },
    night_awakenings_per_month:{ type: 'int', required: false, min: 0, max: 60 },
    SABA_use_per_week:        { type: 'int', required: false, min: 0, max: 50 },
    activity_limitation:      { type: 'bool', required: false },
    exacerbations_last_12m:   { type: 'int', required: false, min: 0, max: 20 },
    act_score:                { type: 'int', required: false, min: 0, max: 25 }
};

const pulmonologyCopdCreate = {
    patient_id:           { type: 'id', required: true },
    encounter_id:         { type: 'id', required: false },
    fev1_pct_predicted:   { type: 'num', required: true, min: 5, max: 150 },
    mMRC_grade:           { type: 'int', required: true, min: 0, max: 4 },
    exacerbations_last_year: { type: 'int', required: false, min: 0, max: 20 },
    hospitalization_last_year:{ type: 'int', required: false, min: 0, max: 10 }
};

const giBleedCreate = {
    patient_id:           { type: 'id', required: true },
    encounter_id:         { type: 'id', required: false },
    bun_mmol_l:           { type: 'num', required: true, min: 0, max: 100 },
    hemoglobin_g_dl:      { type: 'num', required: true, min: 1, max: 25 },
    systolic_bp:          { type: 'num', required: true, min: 30, max: 280 },
    pulse_bpm:            { type: 'num', required: true, min: 0, max: 250 },
    melena:               { type: 'bool', required: false },
    syncope:              { type: 'bool', required: false },
    hepatic_disease:      { type: 'bool', required: false },
    cardiac_failure:      { type: 'bool', required: false }
};

const giIbdCreate = {
    patient_id:           { type: 'id', required: true },
    encounter_id:         { type: 'id', required: false },
    ibd_type:             { type: 'enumOf', allowed: ['uc','crohn'], required: true },
    stool_frequency:      { type: 'int', required: true, min: 0, max: 30 },
    abdominal_pain:       { type: 'int', required: true, min: 0, max: 3 },
    general_wellbeing:    { type: 'int', required: true, min: 0, max: 4 },
    temperature:          { type: 'num', required: false, min: 30, max: 45 },
    hct:                  { type: 'num', required: false, min: 5, max: 60 },
    esr:                  { type: 'num', required: false, min: 0, max: 200 },
    albumin:              { type: 'num', required: false, min: 0.5, max: 10 },
    endoscopic_findings:  { type: 'int', required: false, min: 0, max: 3 }
};

const rheumatologyDas28Create = {
    patient_id:           { type: 'id', required: true },
    encounter_id:         { type: 'id', required: false },
    tender_joint_count:   { type: 'int', required: true, min: 0, max: 28 },
    swollen_joint_count:  { type: 'int', required: true, min: 0, max: 28 },
    patient_global_mm:    { type: 'num', required: true, min: 0, max: 100 },
    crp_mg_l:             { type: 'num', required: false, min: 0, max: 500 },
    esr_mm_h:             { type: 'num', required: false, min: 0, max: 200 }
};

const orthopedicsBoneDensityCreate = {
    patient_id:                    { type: 'id', required: true },
    encounter_id:                  { type: 'id', required: false },
    age:                           { type: 'int', required: true, min: 0, max: 120 },
    sex:                           { type: 'enumOf', allowed: ['male','female'], required: true },
    weight_kg:                     { type: 'num', required: false, min: 0.5, max: 300 },
    height_cm:                     { type: 'num', required: false, min: 30, max: 250 },
    prior_fracture:                { type: 'bool', required: false },
    parent_fracture_hip:           { type: 'bool', required: false },
    current_smoking:               { type: 'bool', required: false },
    glucocorticoids:              { type: 'bool', required: false },
    ra:                            { type: 'bool', required: false },
    secondary_osteoporosis:        { type: 'bool', required: false },
    alcohol_3_units_day:           { type: 'bool', required: false },
    femoral_neck_bmd_tscore:       { type: 'num', required: false, min: -10, max: 10 }
};

const neurologyNihssCreate = {
    patient_id:           { type: 'id', required: true },
    encounter_id:         { type: 'id', required: false },
    consciousness:        { type: 'int', required: true, min: 0, max: 3 },
    gaze:                 { type: 'int', required: true, min: 0, max: 2 },
    visual_fields:        { type: 'int', required: true, min: 0, max: 3 },
    facial_palsy:         { type: 'int', required: true, min: 0, max: 3 },
    motor_arm:            { type: 'int', required: true, min: 0, max: 4 },
    motor_leg:            { type: 'int', required: true, min: 0, max: 4 },
    ataxia:               { type: 'int', required: true, min: 0, max: 2 },
    sensory:              { type: 'int', required: true, min: 0, max: 2 },
    language:             { type: 'int', required: true, min: 0, max: 3 },
    dysarthria:           { type: 'int', required: true, min: 0, max: 2 },
    extinction:           { type: 'int', required: true, min: 0, max: 2 }
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
    "invoiceCreate,\n    pulmonologyAsthmaCreate, pulmonologyCopdCreate, giBleedCreate, giIbdCreate, rheumatologyDas28Create, orthopedicsBoneDensityCreate, neurologyNihssCreate,",
    1
)
src = src[:brace_open+1] + new_body + src[i:]
WORKTREE.write_text(src, encoding="utf-8")
print("OK - 7 new schemas added")
