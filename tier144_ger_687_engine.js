// filepath: tier144_ger_687_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cga(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureNum(req.adl_score, 'al');
  ensureNum(req.iadl_score, 'il');
  ensureNum(req.mmse_score, 'mm');
  ensureNum(req.moca_score, 'mo');
  ensureNum(req.gds_score, 'gd');
  ensureNum(req.mna_score, 'mn');
  ensureNum(req.tinetti_score, 'ti');
  ensureNum(req.charlson, 'ch');
  ensureStr(req.provider, 'pr');
  return { cg_id: `cga_${Date.now()}`, patient_id: req.patient_id, adl: req.adl_score, mmse: req.mmse_score, mna: req.mna_score };
}
function frailty(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.fried_score, 'fr');
  ensureEnum(req.rockwood_stage, 'rs', ['very_fit','well','managing','vulnerable','mildly_frail','moderately_frail','severely_frail','very_severely_frail','terminally_ill','unknown']);
  ensureNum(req.efs_score, 'ef');
  ensureEnum(req.cfs_stage, 'cs', ['1','2','3','4','5','6','7','8','9']);
  ensureNum(req.grip_kg, 'gk');
  ensureNum(req.gait_speed, 'gs');
  ensureNum(req.weight_loss_kg, 'wl');
  ensureStr(req.provider, 'pr');
  return { fr_id: `frl_${Date.now()}`, patient_id: req.patient_id, fried: req.fried_score, efs: req.efs_score };
}
function polypharm(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.med_count, 'mc');
  ensureNum(req.beers_count, 'bc');
  ensureNum(req.stopp_count, 'sc');
  ensureEnum(req.chads, 'ch', ['none','low','moderate','high','very_high']);
  ensureNum(req.ddi_count, 'dd');
  ensureNum(req.anti_cholinergic_burden, 'ab');
  ensureBool(req.renal_dose_adj, 'rd');
  ensureNum(req.warfarin_dose, 'wd');
  ensureStr(req.provider, 'pr');
  return { pp_id: `pph_${Date.now()}`, patient_id: req.patient_id, med_count: req.med_count, beers: req.beers_count };
}
function geriatric_syn(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.syndrome, 'sy', ['frailty','delirium','falls','incontinence','pressure_ulcer','malnutrition','dehydration','cognitive_decline','polypharm','sarcopenia','osteoporosis','other']);
  ensureNum(req.severity, 'sv');
  ensureStr(req.intervention, 'iv');
  ensureNum(req.response_days, 'rd');
  ensureBool(req.resolved, 'rs');
  ensureStr(req.provider, 'pr');
  return { gs_id: `gsn_${Date.now()}`, patient_id: req.patient_id, syndrome: req.syndrome, severity: req.severity };
}
function goals(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.goal_type, 'gt', ['advance_directive','POLST','code_status','living_will','durable_poa','healthcare_proxy','surrogate','goals_of_care','lt_relationship','other']);
  ensureStr(req.summary, 'sm');
  ensureEnum(req.code_status, 'cs', ['full','DNR','DNI','DNR_DNI','comfort','limited','trial','uncertain','other']);
  ensureNum(req.discussion_minutes, 'dm');
  ensureStr(req.provider, 'pr');
  ensureBool(req.family_present, 'fp');
  return { go_id: `goc_${Date.now()}`, patient_id: req.patient_id, goal_type: req.goal_type, code_status: req.code_status };
}

function funcs() { return { cga, frailty, polypharm, geriatric_syn, goals }; }
module.exports = { funcs, ValidationError };
