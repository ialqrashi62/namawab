// filepath: tier24_transplant_ext_155_immuno_engine.js
// TIER24_TRANSPLANT-155: Immunosuppression, induction, maintenance
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function induction(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureEnum(req.induction_agent, 'induction_agent', ['basiliximab','antithymocyte_globulin','alemtuzumab','rATG','none','steroids_only','other']);
  ensureNumber(req.dose_total, 'dose');
  ensureNumber(req.days_since_tx, 'days_post_tx');
  ensureEnum(req.rejection_risk, 'rejection_risk', ['low','moderate','high','very_high','unknown','other']);
  ensureBool(req.cni_initiated, 'cni');
  let status;
  if (req.days_since_tx > 14) status = 'induction_window_passed';
  else if (req.rejection_risk === 'very_high' && req.induction_agent === 'basiliximab') status = 'very_high_risk_use_rATG_or_alemtuzumab';
  else if (req.rejection_risk === 'high' && req.induction_agent === 'none') status = 'high_risk_induction_required';
  else status = 'induction_appropriate';
  return { status, agent: req.induction_agent };
}

function maintenance(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureEnum(req.cni, 'cni', ['tacrolimus','cyclosporine','none','other']);
  ensureNumber(req.tacrolimus_trough_ng_ml, 'trough');
  ensureEnum(req.antimetabolite, 'antimetabolite', ['mycophenolate','mycophenolic_acid','azathioprine','mizoribine','none','other']);
  ensureBool(req.steroid_maintenance, 'steroid');
  ensureNumber(req.days_post_tx, 'days_post_tx');
  let status;
  if (req.cni === 'tacrolimus' && req.tacrolimus_trough_ng_ml > 20) status = 'trough_too_high_neuro_nephro_toxic';
  else if (req.cni === 'tacrolimus' && req.tacrolimus_trough_ng_ml < 5) status = 'trough_low_under_immunosuppression';
  else if (req.cni === 'none' && req.days_post_tx < 90) status = 'no_cni_early_post_tx_add_cni';
  else status = 'maintenance_appropriate';
  return { status, cni: req.cni };
}

function rejection(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.rejection_type, 'rejection_type', ['acute_cellular','acute_antibody_mediated','chronic_antibody','chronic_cellular','chronic_allograft','borderline','mixed','other']);
  ensureEnum(req.banff_grade, 'banff_grade', ['borderline','1a','1b','2a','2b','3','unknown','other']);
  ensureNumber(req.dsa_mfi, 'mfi');
  ensureBool(req.steroid_pulse_given, 'steroid');
  ensureBool(req.plasmapheresis_done, 'plasmapheresis');
  let status;
  if (req.rejection_type === 'acute_antibody_mediated' && req.dsa_mfi > 5000 && !req.plasmapheresis_done) status = 'abmr_plasmapheresis_ivig_required';
  else if (req.banff_grade === '3' || req.banff_grade === '2b') status = 'severe_rejection_rATG_recommended';
  else if (!req.steroid_pulse_given && req.banff_grade !== 'borderline') status = 'steroid_pulse_recommended';
  else status = 'rejection_managed_appropriately';
  return { status, type: req.rejection_type };
}

function drug_level(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureEnum(req.drug, 'drug', ['tacrolimus','cyclosporine','sirolimus','everolimus','mycophenolic_acid','other']);
  ensureNumber(req.trough_ng_ml, 'trough');
  ensureNumber(req.days_post_tx, 'days_post_tx');
  ensureBool(req.adherence_concern, 'adherence');
  ensureEnum(req.adjustment, 'adjustment', ['increase','decrease','hold','maintain','switch','discontinue','none','other']);
  let status;
  if (req.drug === 'tacrolimus' && req.days_post_tx < 90 && req.trough_ng_ml < 8) status = 'subtherapeutic_early_increase';
  else if (req.drug === 'tacrolimus' && req.trough_ng_ml > 15) status = 'supratherapeutic_decrease';
  else if (req.adherence_concern && req.trough_ng_ml < 5) status = 'adherence_issue_refer_counseling';
  else status = 'drug_level_appropriate';
  return { status, drug: req.drug };
}

function prophylaxis(req) {
  ensureStr(req.recipient_id, 'recipient_id');
  ensureEnum(req.pjp_prophylaxis, 'pjp', ['tmp_smx','pentamidine','atovaquone','dapsone','none','other']);
  ensureEnum(req.cmv_prophylaxis, 'cmv', ['valganciclovir','high_dose_valacyclovir','iv_ganciclovir','none','other']);
  ensureNumber(req.days_post_tx, 'days_post_tx');
  ensureBool(req.bk_virus_detected, 'bk');
  ensureBool(req.ebv_high_risk, 'ebv_high');
  let status;
  if (req.pjp_prophylaxis === 'none' && req.days_post_tx < 365) status = 'pjp_prophylaxis_missing';
  else if (req.cmv_prophylaxis === 'none' && (req.ebv_high_risk || true)) status = 'cmv_prophylaxis_recommended_high_risk';
  else if (req.bk_virus_detected) status = 'bk_viremia_reduce_immunosuppression';
  else status = 'prophylaxis_appropriate';
  return { status, pjp: req.pjp_prophylaxis };
}

const CITATIONS = { KDIGO_IMMUNO_2024: 'KDIGO Immunosuppression 2024', AST_REJ_2024: 'AST Rejection 2024' };

function funcs() { return { induction, maintenance, rejection, drug_level, prophylaxis }; }
module.exports = { funcs, CITATIONS, ValidationError };