// filepath: tier36_infectious_disease_ext_217_stewardship_engine.js
// TIER36_INFX-217: Antimicrobial stewardship
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function culture_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.culture_result, 'res', ['ecoli','klebsiella','pseudomonas','staph_aureus','mrsa','strep_pneumoniae','enterococcus','candida','mixed','no_growth','other']);
  ensureEnum(req.specimen, 'spec', ['blood','urine','sputum','wound','csf','sterile_fluid','tissue','catheter','other']);
  ensureEnum(req.sensitivities, 'sens', ['multiple','single','resistant_only','pending','not_done','other']);
  ensureEnum(req.antibiotic_appropriateness, 'app', ['appropriate','inappropriate','narrower_needed','broader_needed','unknown']);
  ensureBool(req.de_escalation_needed, 'deesc');
  let status;
  if (req.antibiotic_appropriateness === 'inappropriate' && !req.de_escalation_needed) status = 'inappropriate_antibiotic_change';
  else if (req.culture_result === 'mrsa' && req.sensitivities === 'single') status = 'mrsa_vancomycin_daptomycin';
  else if (req.de_escalation_needed && req.antibiotic_appropriateness === 'appropriate') status = 'narrower_spectrum_available_de_esc';
  else if (req.culture_result === 'no_growth') status = 'no_growth_review_empiric_continue';
  else status = 'culture_review_appropriate';
  return { status, org: req.culture_result };
}

function antibiotic_review(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.antibiotic, 'ab', ['vancomycin','daptomycin','linezolid','meropenem','pip_tazo','cefepime','ceftriaxone','levofloxacin','other']);
  ensureEnum(req.indication, 'ind', ['culture_positive','empiric','prophylaxis','colonization','unknown','other']);
  ensureBool(req.dose_appropriate, 'dose');
  ensureBool(req.levels_monitored, 'levels');
  ensureBool(req.renal_dose_adjustment, 'renal');
  let status;
  if (req.antibiotic === 'vancomycin' && !req.levels_monitored) status = 'vancomycin_levels_required';
  else if (!req.dose_appropriate) status = 'dose_inappropriate_adjust';
  else if (req.indication === 'colonization') status = 'colonization_no_treatment_stop';
  else if (req.indication === 'prophylaxis' && req.renal_dose_adjustment) status = 'prophylaxis_renal_adjust_appropriate';
  else status = 'antibiotic_review_appropriate';
  return { status, ab: req.antibiotic };
}

function iv_to_po(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.antibiotic, 'ab', ['levofloxacin','ciprofloxacin','moxifloxacin','metronidazole','linezolid','clindamycin','amoxicillin','other']);
  ensureBool(req.afebrile_24h, 'afeb');
  ensureBool(req.oral_tolerance, 'po_tol');
  ensureBool(req.switch_to_po, 'switch');
  ensureBool(req.iv_line_discontinued, 'iv_dc');
  let status;
  if (!req.afebrile_24h) status = 'still_febrile_continue_iv';
  else if (!req.oral_tolerance) status = 'no_oral_tolerance_continue_iv';
  else if (req.afebrile_24h && req.oral_tolerance && req.switch_to_po) status = 'iv_to_po_appropriate';
  else if (req.switch_to_po && !req.iv_line_discontinued) status = 'switched_po_remove_iv_line';
  else status = 'iv_to_po_review';
  return { status, ab: req.antibiotic };
}

function de_escalation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.empiric, 'emp', ['pip_tazo','meropenem','cefepime','vancomycin','combination','other']);
  ensureEnum(req.culture, 'cx', ['ecoli_sensitive_narrow','ecoli_sensitive_broad','klebsiella','pseudomonas','mrsa','mixed','no_growth','other']);
  ensureEnum(req.de_escalate_to, 'de', ['ceftriaxone','cefazolin','ciprofloxacin','oral_combination','none','other']);
  ensureBool(req.narrower_spectrum, 'narrow');
  let status;
  if (req.culture === 'no_growth' && req.de_escalate_to !== 'none') status = 'no_growth_review_empiric_dur';
  else if (req.narrower_spectrum && req.de_escalate_to === 'ceftriaxone') status = 'de_escalation_ceftriaxone_appropriate';
  else if (req.culture === 'ecoli_sensitive_narrow' && req.empiric === 'meropenem') status = 'de_escalate_meropenem_to_narrow';
  else if (req.de_escalate_to === 'none') status = 'no_de_escalation_review_appropriate';
  else status = 'de_escalation_review';
  return { status, de: req.de_escalate_to };
}

function prospective_audit(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.audit_type, 'type', ['daily_review','weekly_review','per_prescription','targeted','other']);
  ensureNumber(req.antibiotic_days, 'days');
  ensureBool(req.intervention_needed, 'int_need');
  ensureEnum(req.intervention, 'int', ['none','dose_optimization','route_change','de_escalation','escalation','discontinuation','addition','other']);
  ensureEnum(req.outcome, 'out', ['resolved','improving','stable','worsening','failed','unknown']);
  let status;
  if (req.antibiotic_days >= 14 && req.outcome !== 'resolved') status = 'long_antibiotic_course_review_ivpo';
  else if (req.intervention_needed && req.intervention === 'none') status = 'intervention_needed_review_action';
  else if (req.outcome === 'resolved' && req.intervention !== 'none') status = 'audit_intervention_successful';
  else if (req.audit_type === 'daily_review' && req.outcome === 'improving') status = 'daily_audit_improving_continue';
  else status = 'audit_review_appropriate';
  return { status, out: req.outcome };
}

function funcs() { return { culture_review, antibiotic_review, iv_to_po, de_escalation, prospective_audit }; }
module.exports = { funcs, ValidationError };