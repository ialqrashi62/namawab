// filepath: tier88_id_syndromes_464_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function endocarditis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.duke_criteria_met, 'dcm');
  ensureEnum(req.echo_findings, 'ef', ['vegetation','abscess','valve_dysfunction','perivalvular_complication','normal','other','unknown']);
  ensureEnum(req.organism, 'org', ['staph_aureus','strep_viridans','enterococcus','staph_epidermidis','hacek','culture_negative','other','unknown']);
  ensureEnum(req.antibiotic_type, 'ab', ['broad_spectrum','narrow_spectrum','culture_guided','combination','other','unknown']);
  ensureNum(req.duration_weeks, 'dw');
  ensureBool(req.valve_surgery_consult, 'vsc');
  ensureEnum(req.complications, 'comp', ['none','heart_failure','embolization','mycotic_aneurysm','death','other','unknown']);
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function meningitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.gcs_score, 'gcs');
  ensureEnum(req.cerebrospinal_fluid, 'csf_appearance', ['clear','cloudy','purulent','blood_tinted','unknown','other']);
  ensureNum(req.csf_cell_count, 'ccc');
  ensureNum(req.csf_glucose, 'cg');
  ensureNum(req.csf_protein, 'cp');
  ensureBool(req.blood_culture_positive, 'bcp');
  ensureEnum(req.organism, 'org', ['strep_pneumoniae','n_meningitidis','h_influenzae','listeria','cryptococcus','viral','bacterial_unspecified','culture_negative','unknown','other']);
  ensureEnum(req.antibiotic_type, 'ab', ['broad_spectrum','narrow_spectrum','combination','targeted','other','unknown']);
  ensureBool(req.steroids_given, 'sg');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function osteomyelitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.bone_involved, 'bi', ['spine','pelvis','femur','tibia','foot','humerus','mandible','other','unknown']);
  ensureEnum(req.organism, 'org', ['staph_aureus','strep_pyogenes','e_coli','pseudomonas','salmonella','mrsa','culture_negative','other','unknown']);
  ensureEnum(req.source, 'src', ['hematogenous','contiguous','diabetic_foot','post_trauma','post_surgical','unknown','other']);
  ensureEnum(req.imaging_done, 'img', ['none','mri','ct','bone_scan','xray','other']);
  ensureBool(req.debridement_done, 'dd');
  ensureEnum(req.antibiotic_type, 'ab', ['broad_spectrum','narrow_spectrum','targeted','combination','other','unknown']);
  ensureNum(req.duration_weeks, 'dw');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function skin_infection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.infection_type, 'it', ['cellulitis','erysipelas','necrotizing','folliculitis','abscess','mrsa_colonized','necrotizing_fasciitis','impetigo','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','localized','spreading','systemic']);
  ensureEnum(req.location, 'loc', ['face','neck','arm','leg','torso','perineum','foot','hand','multiple','other']);
  ensureEnum(req.organism, 'org', ['strep_pyogenes','staph_aureus','mrsa','mixed','culture_negative','unknown','other']);
  ensureEnum(req.antibiotic_type, 'ab', ['broad_spectrum','narrow_spectrum','mrsa_active','combination','topical','other','unknown']);
  ensureBool(req.oral_switched, 'os');
  ensureNum(req.follow_up_days, 'fud');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function uti_id(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.uti_type, 'ut', ['uncomplicated_cystitis','complicated_cystitis','pyelonephritis','catheter_associated','asymptomatic_bacteriuria','urosepsis','unknown','other']);
  ensureEnum(req.organism, 'org', ['e_coli','klebsiella','proteus','enterococcus','pseudomonas','candida','other','unknown']);
  ensureNum(req.urine_culture_count, 'ucc');
  ensureBool(req.blood_culture_positive, 'bcp');
  ensureEnum(req.antibiotic_type, 'ab', ['broad_spectrum','narrow_spectrum','pseudomonas_active','mrsa_active','combination','other','unknown']);
  ensureBool(req.source_control, 'sc');
  ensureBool(req.imaging_done, 'id');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}

function funcs() { return { endocarditis, meningitis, osteomyelitis, skin_infection, uti_id }; }
module.exports = { funcs, ValidationError };