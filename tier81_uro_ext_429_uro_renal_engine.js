// filepath: tier81_uro_ext_429_uro_renal_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function renal_stone(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.stone_location, 'sl', ['calyx','renal_pelvis','upper_ureter','mid_ureter','lower_ureter','bladder','urethra','unknown','other']);
  ensureNum(req.stone_size_mm, 'ss');
  ensureNum(req.hounsfield_units, 'hu');
  ensureStr(req.stone_composition, 'sc');
  ensureBool(req.hydronephrosis, 'hn');
  ensureBool(req.fever_present, 'fp');
  ensureNum(req.creatinine, 'cr');
  ensureEnum(req.management, 'mg', ['observation','medical_expulsive','eswl','ureteroscopy','pcnl','open','other','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function renal_mass(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.side, 'side', ['right','left','bilateral','unknown']);
  ensureNum(req.mass_size_cm, 'ms');
  ensureEnum(req.imaging_modality, 'im', ['ct','mri','us','pet','other']);
  ensureEnum(req.renas_score, 'rs', ['low','intermediate','high','unknown','other']);
  ensureBool(req.enhancement, 'enh');
  ensureNum(req.growth_rate_per_year, 'gr');
  ensureEnum(req.management, 'mg', ['active_surveillance','ablation','partial_nephrectomy','radical_nephrectomy','other','unknown']);
  ensureBool(req.biopsy_done, 'bd');
  ensureStr(req.pathology, 'path');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function renal_failure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.creatinine, 'cr');
  ensureNum(req.gfr, 'gfr');
  ensureEnum(req.aki_stage, 'as', ['risk','injury','failure','loss','esrd','unknown','other','none']);
  ensureNum(req.urea, 'ur');
  ensureNum(req.potassium, 'k');
  ensureBool(req.oliguria, 'olu');
  ensureBool(req.dialysis_required, 'dr');
  ensureEnum(req.dialysis_type, 'dt', ['hemodialysis','peritoneal','crrt','none','other','unknown']);
  ensureStr(req.etiology, 'et');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function uti_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.infection_type, 'it', ['cystitis','pyelonephritis','prostatitis','epididymitis','orchitis','asymptomatic','recurrent','catheter_associated','other','unknown']);
  ensureStr(req.organism, 'org');
  ensureNum(req.leukocyte_count, 'lc');
  ensureNum(req.nitrite, 'nit');
  ensureBool(req.fever, 'fev');
  ensureNum(req.duration_days, 'dd');
  ensureBool(req.hospitalized, 'hosp');
  ensureEnum(req.antibiotic, 'ab', ['ciprofloxacin','nitrofurantoin','cefalexin','amoxicillin','bactrim','fosfomycin','augmentin','gentamicin','meropenem','other','unknown']);
  ensureStr(req.sensitivities, 'sens');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function prostate_biopsy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureNum(req.psa, 'psa');
  ensureNum(req.prostate_volume, 'pv');
  ensureNum(req.psad, 'psad');
  ensureBool(req.mri_done, 'mri');
  ensureEnum(req.pirads, 'pi', ['pi1','pi2','pi3','pi4','pi5','unknown']);
  ensureNum(req.cores_taken, 'ct');
  ensureNum(req.cores_positive, 'cp');
  ensureEnum(req.gleason, 'gl', ['6_3_plus_3','3_plus_4','4_plus_3','8','9_10','unknown','benign','other']);
  ensureEnum(req.complications, 'comp', ['none','infection','bleeding','urinary_retention','sepsis','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { pid: req.procedure_id };
}

function funcs() { return { renal_stone, renal_mass, renal_failure, uti_management, prostate_biopsy }; }
module.exports = { funcs, ValidationError };