// filepath: tier40_ophthalmology_ext_234_retina_engine.js
// TIER40_OPHTHALMOLOGY-234: Retina
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function amd(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['dry','wet','mixed','unknown','other']);
  ensureNumber(req.visual_acuity_right, 'va_r');
  ensureStr(req.visual_acuity, 'va');
  ensureBool(req.oct_done, 'oct');
  ensureEnum(req.anti_vegf_initiated, 'anti', ['aflibercept','ranibizumab','bevacizumab','faricimab','none','other']);
  ensureEnum(req.treatment_response, 'resp', ['excellent','good','stable','partial','worsening','unknown']);
  let status;
  if (req.type === 'wet' && req.anti_vegf_initiated === 'none') status = 'wet_amd_anti_vegf_urgent';
  else if (req.type === 'dry' && req.treatment_response === 'worsening') status = 'dry_amd_progression_areds2';
  else if (req.treatment_response === 'excellent') status = 'wet_amd_responding_continue';
  else status = 'amd_review';
  return { status, t: req.type };
}

function diabetic_retinopathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.stage, 'stage', ['no_dr','mild_npdr','moderate_npdr','severe_npdr','pdr','pdr_high_risk','other']);
  ensureStr(req.visual_acuity, 'va');
  ensureBool(req.oct_macular_edema, 'oct_me');
  ensureBool(req.follow_up_6_months, 'fup');
  ensureEnum(req.glycemic_control, 'gly', ['poor','fair','good','excellent','unknown']);
  let status;
  if (req.stage === 'pdr_high_risk') status = 'pdr_high_risk_panretinal_laser_anti_vegf';
  else if (req.stage === 'severe_npdr') status = 'severe_npdr_close_follow_up';
  else if (req.oct_macular_edema && req.stage !== 'no_dr') status = 'diabetic_me_anti_vegf';
  else if (req.stage === 'mild_npdr' && req.follow_up_6_months) status = 'mild_dr_annual_review';
  else status = 'dr_review';
  return { status, st: req.stage };
}

function retinal_detachment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['rhegmatogenous','tractional','exudative','combined','unknown','other']);
  ensureBool(req.macula_off, 'macula_off');
  ensureEnum(req.surgery, 'sx', ['vitrectomy_with_buckle','vitrectomy_alone','scleral_buckle_alone','pneumatic_retinopexy','observation','laser_barrier','other']);
  ensureBool(req.urgent, 'urg');
  ensureEnum(req.visual_prognosis, 'prog', ['excellent','good','guarded','poor','unknown','other']);
  let status;
  if (req.macula_off && req.urgent) status = 'mac_off_rd_emergency_surgery';
  else if (req.type === 'rhegmatogenous' && req.macula_off === false && req.surgery === 'pneumatic_retinopexy') status = 'mac_on_pneumatic_appropriate';
  else if (req.type === 'tractional' && req.surgery === 'vitrectomy_alone') status = 'trd_vitrectomy_alone_appropriate';
  else if (req.visual_prognosis === 'poor' && req.surgery === 'observation') status = 'observation_inappropriate_review';
  else status = 'rd_review';
  return { status, t: req.type };
}

function macular_edema(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'type', ['diabetic','retinal_vein_occlusion','uveitic','post_surgical','pseudophakic_cme','idiopathic','other']);
  ensureNumber(req.oct_cmt, 'cmt');
  ensureStr(req.visual_acuity, 'va');
  ensureEnum(req.anti_vegf, 'av', ['aflibercept','ranibizumab','bevacizumab','faricimab','none','other']);
  ensureEnum(req.response, 'resp', ['excellent','good','partial','stable','worsening','none','unknown']);
  let status;
  if (req.type === 'diabetic' && req.anti_vegf === 'none' && req.oct_cmt >= 400) status = 'dme_anti_vegf_indicated';
  else if (req.response === 'worsening' && req.anti_vegf !== 'none') status = 'dme_worsening_switch_anti_vegf';
  else if (req.oct_cmt < 300 && req.anti_vegf !== 'none') status = 'oct_improving_dme_responding';
  else status = 'me_review';
  return { status, t: req.type };
}

function intravitreal_injection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.drug, 'drug', ['aflibercept','ranibizumab','bevacizumab','faricimab','steroid','none','other']);
  ensureEnum(req.eye, 'eye', ['left','right','both','other']);
  ensureNumber(req.pre_iop, 'pre');
  ensureNumber(req.post_iop, 'post');
  ensureEnum(req.complications, 'comp', ['none','endophthalmitis','vitreous_hemorrhage','retinal_detachment','lens_trauma','subconjunctival_hemorrhage','elevated_iop','other']);
  ensureBool(req.consent_obtained, 'consent');
  let status;
  if (req.complications === 'endophthalmitis') status = 'endophthalmitis_vitreous_tap';
  else if (req.complications === 'retinal_detachment') status = 'ivi_induced_rd_urgent_surgery';
  else if (req.post_iop >= 30) status = 'transient_elevated_iop_review';
  else if (req.consent_obtained === false) status = 'consent_required_pre_injection';
  else status = 'ivi_review_appropriate';
  return { status, d: req.drug };
}

function funcs() { return { amd, diabetic_retinopathy, retinal_detachment, macular_edema, intravitreal_injection }; }
module.exports = { funcs, ValidationError };