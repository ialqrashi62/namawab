// filepath: tier38_dermatology_ext_226_acne_engine.js
// TIER38_DERMATOLOGY-226: Acne
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function acne_severity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.acne_type, 'type', ['comedonal','papulopustular','nodulocystic','conglobate','fulminans','mechanical','drug_induced','hormonal','other']);
  ensureNumber(req.lesion_count, 'lc');
  ensureNumber(req.comedone_count, 'cc');
  ensureNumber(req.cysts, 'cy');
  ensureBool(req.scar_present, 'scar');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','very_severe','other']);
  let status;
  if (req.severity === 'very_severe' || req.cysts >= 5) status = 'severe_acne_isotretinoin_indicated';
  else if (req.severity === 'severe' && req.scar_present) status = 'severe_acne_scar_prevention_aggressive';
  else if (req.severity === 'moderate' && req.scar_present) status = 'moderate_with_scarring_isotretinoin_consider';
  else if (req.severity === 'mild') status = 'mild_acne_topical';
  else status = 'acne_severity_review';
  return { status, sev: req.severity };
}

function acne_topical(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.topical, 'top', ['benzoyl_peroxide','retinoid','benzoyl_peroxide_retinoid','retinoid_topical_antibiotic','azelaic_acid','salicylic_acid','clindamycin','erythromycin','dapsone','none','other']);
  ensureNumber(req.duration_weeks, 'dur');
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','partial','poor','none','unknown']);
  ensureEnum(req.side_effects, 'se', ['none','mild_irritation','moderate_irritation','severe_irritation','dryness','allergic','other']);
  ensureEnum(req.adherence, 'adh', ['excellent','good','suboptimal','poor','unknown']);
  let status;
  if (req.response === 'poor' && req.adherence === 'good' && req.duration_weeks >= 8) status = 'topical_failure_systemic';
  else if (req.side_effects === 'severe_irritation') status = 'severe_irritation_alternative_topical';
  else if (req.topical.includes('retinoid') && req.response === 'good') status = 'topical_response_maintain';
  else status = 'topical_review';
  return { status, top: req.topical };
}

function acne_systemic(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.systemic, 'sys', ['doxycycline','minocycline','azithromycin','erythromycin','trimethoprim','none','other']);
  ensureNumber(req.dose_mg, 'dose');
  ensureNumber(req.duration_weeks, 'dur');
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','partial','poor','none','unknown']);
  ensureEnum(req.pregnancy_test, 'preg', ['positive','negative','not_applicable','pending','unknown']);
  ensureBool(req.phototoxicity_education, 'photo_ed');
  let status;
  if (req.systemic === 'doxycycline' && req.phototoxicity_education === false) status = 'doxycycline_phototoxic_counsel';
  else if (req.pregnancy_test === 'positive' && req.systemic === 'doxycycline') status = 'doxycycline_pregnancy_contraindicated';
  else if (req.response === 'excellent') status = 'antibiotic_response_complete_3_month';
  else if (req.response === 'poor' && req.duration_weeks >= 8) status = 'antibiotic_failure_isotretinoin';
  else status = 'systemic_review';
  return { status, s: req.systemic };
}

function isotretinoin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.dose_mg_per_kg, 'dose');
  ensureNumber(req.cumulative_dose_mg, 'cum');
  ensureEnum(req.lipids, 'lip', ['normal','mild_elevation','moderate_elevation','severe_elevation','worsened','stable','unknown']);
  ensureEnum(req.lfts, 'lft', ['normal','mild_elevation','moderate_elevation','severe_elevation','unknown']);
  ensureBool(req.i_pledge_enrolled, 'ipledge');
  ensureEnum(req.depression_screen, 'dep', ['negative','positive','not_done','declined','unknown']);
  let status;
  if (req.depression_screen === 'positive') status = 'depression_positive_psych_refer';
  else if (req.i_pledge_enrolled === false) status = 'i_pledge_required_isotretinoin';
  else if (req.lipids === 'severe_elevation') status = 'severe_lipid_response_hypertriglyceridemia_review';
  else if (req.cumulative_dose_mg >= 5000) status = 'cumulative_target_met_consider_discontinue';
  else status = 'isotretinoin_review_appropriate';
  return { status, cum: req.cumulative_dose_mg };
}

function acne_scar(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.scar_type, 'type', ['atrophic','hypertrophic','keloid','ice_pick','boxcar','rolling','multiple','other']);
  ensureEnum(req.location, 'loc', ['face','chest','back','shoulders','arms','multiple','other']);
  ensureEnum(req.treatment, 'rx', ['laser_resurfacing','microneedling','chemical_peel','subcision','filler','silicone_sheet','injection','combination','none','other']);
  ensureNumber(req.number_sessions, 'sessions');
  ensureEnum(req.response, 'resp', ['excellent','good','moderate','partial','poor','none','unknown']);
  let status;
  if (req.scar_type === 'hypertrophic' && req.treatment === 'laser_resurfacing') status = 'hypertrophic_scar_laser_suboptimal_review';
  else if (req.number_sessions >= 3 && req.response === 'poor') status = 'multiple_sessions_failure_alternative';
  else if (req.response === 'moderate' || req.response === 'good') status = 'scar_responding_continue';
  else status = 'scar_review';
  return { status, t: req.scar_type };
}

function funcs() { return { acne_severity, acne_topical, acne_systemic, isotretinoin, acne_scar }; }
module.exports = { funcs, ValidationError };