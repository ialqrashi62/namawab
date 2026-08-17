// filepath: tier30_hematology_ext_184_apheresis_engine.js
// TIER30_HEMATOLOGY-184: Apheresis procedures
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function plasmapheresis(req) {
  ensureStr(req.session_id, 'session_id');
  ensureEnum(req.procedure, 'proc', ['plasmapheresis','cascade_plasmapheresis','immunoadsorption','other']);
  ensureNumber(req.volume_exchanged_ml, 'vol_ex');
  ensureEnum(req.replacement, 'replace', ['albumin','plasma','saline','combination','other']);
  ensureBool(req.calcium_replacement, 'ca_replace');
  ensureEnum(req.symptoms, 'symptoms', ['none','paresthesias','muscle_cramps','hypotension','citrate_reaction','other']);
  let status;
  if (req.symptoms === 'citrate_reaction' && !req.calcium_replacement) status = 'citrate_reaction_add_calcium';
  else if (req.symptoms === 'hypotension') status = 'hypotension_fluid_resuscitation_review';
  else if (req.volume_exchanged_ml < 2000) status = 'inadequate_exchange_review';
  else status = 'plasmapheresis_completed';
  return { status, vol: req.volume_exchanged_ml };
}

function plateletpheresis(req) {
  ensureStr(req.session_id, 'session_id');
  ensureEnum(req.procedure, 'proc', ['plateletpheresis','single_needle','double_needle','continuous_flow','other']);
  ensureNumber(req.yield, 'yield_plt');
  ensureNumber(req.target_yield, 'target_plt');
  ensureNumber(req.product_count, 'products');
  ensureBool(req.citrate_reaction, 'citrate');
  let status;
  if (req.citrate_reaction) status = 'citrate_reaction_review_calcium';
  else if (req.yield < req.target_yield * 0.8) status = 'low_yield_recruit_donor';
  else if (req.yield >= req.target_yield) status = 'plateletpheresis_target_achieved';
  else status = 'plateletpheresis_completed';
  return { status, achieved_pct: Math.round(req.yield / req.target_yield * 100) };
}

function rbc_exchange(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.patient_hgb, 'hgb_pre');
  ensureNumber(req.target_hgb, 'hgb_target');
  ensureNumber(req.volume_exchanged, 'vol');
  ensureNumber(req.end_hct, 'hct_post');
  ensureBool(req.complication, 'comp');
  let status;
  if (req.complication) status = 'rbc_exchange_complication_review';
  else if (req.end_hct < 25) status = 'low_post_hct_review';
  else if (req.end_hct > 35) status = 'high_post_hct_overtransfusion_risk';
  else if (req.end_hct >= req.target_hgb - 1 && req.end_hct <= req.target_hgb + 2) status = 'rbc_exchange_target_achieved';
  else status = 'rbc_exchange_completed';
  return { status, hct_post: req.end_hct };
}

function leukapheresis(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.wbc_pre, 'wbc_pre');
  ensureNumber(req.target_wbc, 'wbc_target');
  ensureNumber(req.product_volume, 'vol_ml');
  ensureBool(req.citrate_reaction, 'citrate');
  ensureBool(req.procedure_complete, 'complete');
  let status;
  if (req.citrate_reaction) status = 'citrate_reaction_review_calcium';
  else if (!req.procedure_complete) status = 'procedure_incomplete_review_difficult_access';
  else if (req.wbc_pre > 100 && req.target_wbc >= req.wbc_pre * 0.5) status = 'leukapheresis_cytoreduction_achieved';
  else if (req.target_wbc < req.wbc_pre * 0.5) status = 'suboptimal_cytoreduction_repeat_session';
  else status = 'leukapheresis_completed';
  return { status, reduction_pct: Math.round((1 - req.target_wbc / req.wbc_pre) * 100) };
}

function lipid_apheresis(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.ldl_pre, 'ldl_pre');
  ensureNumber(req.ldl_post, 'ldl_post');
  ensureNumber(req.lpa_pre, 'lpa_pre');
  ensureEnum(req.symptoms, 'symptoms', ['none','hypotension','chest_pain','nausea','hypocalcemia','other']);
  ensureNumber(req.duration_min, 'duration');
  let status;
  const reduction = (1 - req.ldl_post / req.ldl_pre) * 100;
  if (req.symptoms === 'hypocalcemia') status = 'hypocalcemia_replacement_needed';
  else if (req.symptoms === 'hypotension') status = 'hypotension_fluid_resuscitation';
  else if (reduction < 60) status = 'suboptimal_reduction_review';
  else if (reduction >= 70) status = 'lipid_apheresis_target_achieved';
  else status = 'lipid_apheresis_completed';
  return { status, reduction_pct: Math.round(reduction) };
}

function funcs() { return { plasmapheresis, plateletpheresis, rbc_exchange, leukapheresis, lipid_apheresis }; }
module.exports = { funcs, ValidationError };