// filepath: tier30_hematology_ext_187_coag_ext_engine.js
// TIER30_HEMATOLOGY-187: Coagulation extended
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function factor_replacement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.factor, 'factor', ['factor_viii','factor_ix','factor_vii','factor_xiii','vwd_factor','fibrinogen','other']);
  ensureNumber(req.baseline_pct, 'baseline');
  ensureNumber(req.post_pct, 'post');
  ensureNumber(req.dosing_units, 'dose');
  ensureNumber(req.half_life_h, 'half_life');
  ensureEnum(req.indication, 'indication', ['prophylactic','on_demand','perioperative','breakthrough','inhibitor_era','other']);
  let status;
  if (req.factor === 'factor_viii' && req.half_life_h > 24) status = 'extended_half_life_product_use';
  else if (req.post_pct < 50 && req.indication === 'prophylactic') status = 'inadequate_trough_review_dose';
  else if (req.post_pct >= req.baseline_pct + 50) status = 'factor_replacement_adequate';
  else status = 'factor_replacement_completed';
  return { status, trough: req.post_pct };
}

function inh_concentrate(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.inhibitor_titer, 'titer');
  ensureEnum(req.product, 'product', ['feiba','novoseven','recombinant_vii','bypassing_agent','emicizumab','other']);
  ensureEnum(req.response, 'response', ['excellent','good','partial','poor','none']);
  ensureBool(req.bleeding_controlled, 'controlled');
  ensureBool(req.complication, 'comp');
  let status;
  if (req.inhibitor_titer > 5 && req.product === 'novoseven' && !req.bleeding_controlled) status = 'thrombosis_risk_high_review_alternative';
  else if (req.complication) status = 'thrombotic_complication_stop_agent';
  else if (req.response === 'poor' || req.response === 'none') status = 'inadequate_response_review_dose';
  else if (req.response === 'excellent' && req.bleeding_controlled) status = 'inhibitor_bypass_excellent_response';
  else status = 'inhibitor_bypass_adequate';
  return { status, ctrl: req.bleeding_controlled };
}

function antithrombin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.baseline_at_pct, 'baseline');
  ensureNumber(req.target_pct, 'target');
  ensureNumber(req.dose_units, 'dose');
  ensureNumber(req.post_at_pct, 'post');
  ensureEnum(req.indication, 'indication', ['heparin_resistance','d_ic','liver_failure','pregnancy','sepsis','other']);
  let status;
  if (req.post_at_pct < req.target_pct) status = 'inadequate_at_repeat_dose';
  else if (req.indication === 'heparin_resistance' && req.post_at_pct >= 80) status = 'at_replacement_adequate_continue_heparin';
  else status = 'at_replacement_completed';
  return { status, post: req.post_at_pct };
}

function protein_c_pathway(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.protein_c_pct, 'pc');
  ensureNumber(req.protein_s_pct, 'ps');
  ensureBool(req.thrombosis_history, 'thrombosis');
  ensureEnum(req.replacement, 'replace', ['protein_c_concentrate','plasma','warfarin_transition','observation','other']);
  ensureNumber(req.post_pc_pct, 'post_pc');
  let status;
  if (req.thrombosis_history && req.protein_c_pct < 30 && req.replacement === 'observation') status = 'high_risk_thrombosis_active_replacement';
  else if (req.post_pc_pct < 50) status = 'inadequate_replacement_repeat';
  else if (req.thrombosis_history && req.post_pc_pct >= 60) status = 'protein_c_replacement_adequate_thromboprophylaxis';
  else status = 'protein_c_management_stable';
  return { status, pc_post: req.post_pc_pct };
}

function dic_management(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.istg_score, 'istg');
  ensureNumber(req.plt_count, 'plt');
  ensureNumber(req.pt, 'pt');
  ensureNumber(req.fibrinogen, 'fib');
  ensureNumber(req.ddimer, 'dd');
  ensureEnum(req.treatment, 'treatment', ['plasma_platelet','plasma_only','platelet_only','cryoprecipitate','combination','observation','other']);
  let status;
  if (req.istg_score >= 5) status = 'overt_dic_active_treatment_continue';
  else if (req.fibrinogen < 1.0) status = 'cryoprecipitate_needed_low_fibrinogen';
  else if (req.plt_count < 20) status = 'platelet_transfusion_threshold_met';
  else if (req.pt > 14 && req.treatment !== 'observation') status = 'plasma_replacement_review';
  else if (req.istg_score < 5 && req.treatment === 'observation') status = 'non_overt_dic_monitor';
  else status = 'dic_management_appropriate';
  return { status, istg: req.istg_score };
}

function funcs() { return { factor_replacement, inh_concentrate, antithrombin, protein_c_pathway, dic_management }; }
module.exports = { funcs, ValidationError };