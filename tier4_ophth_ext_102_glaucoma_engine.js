'use strict';
// TIER4_OPHTH_EXT-102: Glaucoma type + treatment
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['AAO_Glaucoma_2020', 'EGS_Glaucoma_2017'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function classify(req) {
  ensureNumber(req.iop, 'iop');
  ensureNumber(req.cct, 'cct');
  ensureBool(req.family_history, 'family_history');
  ensureBool(req.open_angle, 'open_angle');
  ensureBool(req.angle_closure, 'angle_closure');
  ensureNumber(req.cup_to_disc, 'cup_to_disc');
  ensureBool(req.visual_field_defect, 'visual_field_defect');

  let type = 'normal';
  if (req.iop >= 21 || req.cup_to_disc >= 0.6 || req.visual_field_defect) {
    type = req.angle_closure ? 'angle_closure' : req.open_angle ? 'open_angle' : 'suspect';
  }
  return {
    iop: req.iop,
    cup_to_disc: req.cup_to_disc,
    type,
    high_risk: req.cup_to_disc >= 0.8 || req.iop >= 30 || req.family_history,
    visual_field_defect: req.visual_field_defect,
    recommendations: type === 'angle_closure' ? 'urgent_laser_peripheral_iridotomy' :
      type === 'open_angle' ? 'iop_lowering_drops_prostaglandin_first' :
        'observe_q6_months',
    citations: CITATIONS,
  };
}

function treat(req) {
  ensureNumber(req.iop, 'iop');
  ensureNumber(req.iop_target, 'iop_target');
  ensureStr(req.type, 'type'); // open_angle | angle_closure | normal_tension
  ensureBool(req.drops_compliance, 'drops_compliance');
  ensureBool(req.progression, 'progression');

  const monotherapy = req.type === 'open_angle' ? 'prostaglandin_analog_qhs' :
    req.type === 'angle_closure' ? 'lpi_then_prostaglandin_if_needed' :
      req.type === 'normal_tension' ? 'prostaglandin_qhs' : 'observe';
  const escalation = req.progression ? 'add_beta_blocker_or_alpha_agonist_or_carbonic_anhydrase_inhibitor' :
    req.iop >= req.iop_target + 4 ? 'add_second_agent' : 'continue';
  const surgery = req.iop >= req.iop_target + 6 || req.progression ? 'consider_trabeculectomy_or_migs' : 'no_surgery';
  return {
    iop: req.iop,
    iop_target: req.iop_target,
    monotherapy,
    escalation,
    surgery,
    monitoring: ['oct_q6_months', 'visual_field_q6_12_months', 'iop_q3_months'],
    citations: CITATIONS,
  };
}

module.exports = { classify, treat, CITATIONS, ValidationError };