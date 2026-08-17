// filepath: tier38_dermatology_ext_227_hair_nails_engine.js
// TIER38_DERMATOLOGY-227: Hair & nails
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function alopecia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.alopecia_type, 'type', ['androgenic','alopecia_areata','telogen_effluvium','anagen_effluvium','trichotillomania','scarring_discoid','scarring_lichen_planopilaris','frontal_fibrosing','traction','other']);
  ensureEnum(req.pattern, 'pat', ['ludwig_i','ludwig_ii','ludwig_iii','norwood_ii','norwood_iii','norwood_iv','norwood_v','patchy','diffuse','totalis','universalis','other']);
  ensureNumber(req.duration_years, 'yrs');
  ensureBool(req.family_history, 'fhx');
  ensureBool(req.scarring, 'scar');
  let status;
  if (req.scarring && req.type.includes('scarring')) status = 'scarring_alopecia_permanent_review';
  else if (req.alopecia_type === 'alopecia_areata' && req.pattern === 'universalis') status = 'alopecia_universalis_jak_inhibitor_consider';
  else if (req.alopecia_type === 'androgenic' && req.family_history) status = 'androgenic_aga_treatments_offered';
  else if (req.alopecia_type === 'telogen_effluvium' && req.duration_years < 1) status = 'telogen_workup_stress_iron_thyroid';
  else status = 'alopecia_review';
  return { status, t: req.alopecia_type };
}

function hair_loss_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.tsh, 'tsh');
  ensureNumber(req.ferritin, 'fer');
  ensureNumber(req.vit_d, 'vit_d');
  ensureBool(req.biopsy_done, 'bx');
  ensureEnum(req.biopsy, 'bx_res', ['androgenic_pattern','alopecia_areata','telogen_effluvium','scarring','trichotillomania','normal','pending','other']);
  ensureBool(req.lab_complete, 'lab');
  let status;
  if (req.ferritin < 30 && req.tsh > 4.5) status = 'iron_low_tsh_high_comprehensive_replace';
  else if (!req.lab_complete) status = 'lab_workup_complete_tsh_iron_vit_d';
  else if (req.biopsy === 'androgenic_pattern') status = 'androgenic_biopsy_confirmed';
  else if (req.vit_d < 20) status = 'vit_d_low_replace';
  else status = 'hair_loss_workup_review';
  return { status, fer: req.ferritin };
}

function onychomycosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.nail, 'nail', ['toe_hallux','toe_other','finger_thumb','finger_index','finger_middle','finger_ring','finger_little','multiple','other']);
  ensureEnum(req.confirmed_mycology, 'myc', ['positive_koh','positive_culture','positive_pcr','negative','pending','other']);
  ensureEnum(req.treatment, 'rx', ['terbinafine','itraconazole','fluconazole','topical_ciclopirox','topical_efinaconazole','topical_tavaborole','combination','none','other']);
  ensureNumber(req.duration_weeks, 'dur');
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','slow','partial','poor','none','unknown']);
  let status;
  if (req.confirmed_mycology.includes('positive') && req.treatment === 'none') status = 'confirmed_onychomycosis_treat';
  else if (req.nail === 'toe_hallux' && req.duration_weeks < 12 && req.treatment === 'terbinafine') status = 'toe_hallux_terbinafine_extend_12_weeks';
  else if (req.treatment === 'topical_ciclopirox' && req.nail === 'toe_hallux') status = 'topical_thick_nail_likely_failure';
  else if (req.response === 'slow' && req.treatment === 'terbinafine') status = 'slow_response_expected_extend';
  else status = 'onychomycosis_review';
  return { status, n: req.nail };
}

function paronychia(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.acuity, 'acuity', ['acute','chronic','recurrent','unknown']);
  ensureEnum(req.digit, 'digit', ['thumb','index','middle','ring','little','toe_hallux','toe_other','multiple','other']);
  ensureBool(req.drainage_done, 'drain');
  ensureEnum(req.antibiotic, 'abx', ['augmentin','dicloxacillin','clindamycin','cephalexin','mupirocin','none','other']);
  ensureBool(req.culture_done, 'cx');
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','partial','poor','none','improving','unknown']);
  let status;
  if (req.acuity === 'chronic' && req.drainage_done) status = 'chronic_paronychia_drainage_not_appropriate';
  else if (req.culture_done === false && req.antibiotic !== 'none') status = 'culture_recommended_for_directed_therapy';
  else if (req.acuity === 'acute' && req.drainage_done && req.response === 'improving') status = 'acute_paronychia_responding';
  else if (req.acuity === 'chronic' && req.antibiotic === 'none') status = 'chronic_paronychia_culture_anti_yeast_consider';
  else status = 'paronychia_review';
  return { status, a: req.acuity };
}

function autoimmune_skin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.condition, 'cond', ['vitiligo','alopecia_areata','lichen_planus','morphea','psoriasis','dermatomyositis','bullous_pemphigoid','pemphigus','lupus_cutaneous','other']);
  ensureNumber(req.bsa_pct, 'bsa');
  ensureBool(req.active, 'active');
  ensureBool(req.nb_uvb, 'uvb');
  ensureBool(req.topical_tacrolimus, 'tac');
  ensureBool(req.monitoring_6_month, 'mon');
  let status;
  if (req.active && req.bsa_pct >= 30 && req.nb_uvb === false) status = 'active_extensive_nb_uvb_indicated';
  else if (!req.monitoring_6_month) status = 'autoimmune_skin_monitoring_required';
  else if (req.condition === 'vitiligo' && req.topical_tacrolimus && !req.nb_uvb) status = 'vitiligo_tacrolimus_refer_uvb';
  else if (req.condition === 'pemphigus' || req.condition === 'bullous_pemphigoid') status = 'autoimmune_blistering_biopsy_systemic';
  else status = 'autoimmune_skin_review';
  return { status, c: req.condition };
}

function funcs() { return { alopecia, hair_loss_workup, onychomycosis, paronychia, autoimmune_skin }; }
module.exports = { funcs, ValidationError };