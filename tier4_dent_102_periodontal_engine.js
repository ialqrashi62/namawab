'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { ada_perio: 'AAP/EFP Classification of Periodontal Diseases 2017' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function periodontalStage(input) {
  ensureObj(input, 'input');
  const attachment_loss_mm = ensureNumber(input.attachment_loss_mm, 'attachment_loss_mm');
  const probing_depth_mm = ensureNumber(input.probing_depth_mm, 'probing_depth_mm');
  const bone_loss_pct = ensureNumber(input.bone_loss_pct, 'bone_loss_pct');
  const tooth_loss_due_to_perio = ensureNumber(input.tooth_loss_due_to_perio, 'tooth_loss_due_to_perio');
  let stage;
  if (attachment_loss_mm < 2) { stage = 'stage_i_initial'; }
  else if (attachment_loss_mm < 4) { stage = 'stage_i_or_ii'; }
  else if (attachment_loss_mm < 6) { stage = 'stage_iii_moderate'; }
  else { stage = 'stage_iv_severe_complex_rehab'; }
  const grade = bone_loss_pct / Math.max(attachment_loss_mm, 1) > 1.5 ? 'grade_c_fast' : 'grade_b_moderate';
  return { attachment_loss_mm, probing_depth_mm, bone_loss_pct, tooth_loss_due_to_perio, stage, grade, therapy: 'scaling_root_planing_surgery_consider', citations:['ada_perio'] };
}

function gingivitis(input) {
  ensureObj(input, 'input');
  const bleeding_on_probing = !!input.bleeding_on_probing;
  const redness = !!input.redness;
  const plaque = ensureEnum(input.plaque, ['none','low','moderate','high'], 'plaque');
  const pregnancy = !!input.pregnancy;
  const diabetes = !!input.diabetes;
  const inflammation_signs = (bleeding_on_probing ? 1 : 0) + (redness ? 1 : 0);
  const plaque_factor = plaque === 'high' ? 2 : plaque === 'moderate' ? 1 : 0;
  const systemic = (pregnancy || diabetes) ? 1 : 0;
  const total = inflammation_signs + plaque_factor + systemic;
  if (total >= 3) { return { bleeding_on_probing, redness, plaque, pregnancy, diabetes, severity: 'severe_gingivitis', therapy: 'oral_hygiene_instruction_scaling_chlorhexidine' }; }
  if (total >= 2) { return { bleeding_on_probing, redness, plaque, pregnancy, diabetes, severity: 'moderate_gingivitis', therapy: 'oral_hygiene_instruction_scaling' }; }
  return { bleeding_on_probing, redness, plaque, pregnancy, diabetes, severity: 'mild_or_health', therapy: 'no_treatment_or_prophylaxis' };
}

module.exports = { periodontalStage, gingivitis, CITATIONS, ValidationError };
