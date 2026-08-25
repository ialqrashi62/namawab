// tier312_oox_1493_engine.js — Orthopedic Oncology (Mirels scoring + pathway)
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

// Mirels score: site(1 UL,2 LL,3 peritrochanteric) + pain(1-3) + lesion size(<1/3=1, 1/3-2/3=2, >2/3=3) + cortical breach(intact=1,partial=2,complete=3); >=9 → prophylactic fixation
function t312_e1_lesion_risk_mirels(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.site, 'st', ['upper_limb','lower_limb','peritrochanteric']);
  ensureNum(req.pain_score, 'pn'); ensureEnum(req.lesion_size, 'ls', ['less_third','third_to_two_third','more_two_third']);
  ensureEnum(req.cortical_breach, 'cb', ['intact','partial','complete']);
  const siteScore = { upper_limb:1, lower_limb:2, peritrochanteric:3 }[req.site];
  const sizeScore = { less_third:1, third_to_two_third:2, more_two_third:3 }[req.lesion_size];
  const cbScore = { intact:1, partial:2, complete:3 }[req.cortical_breach];
  if (req.pain_score < 1 || req.pain_score > 3) throw new ValidationError('pain must be 1-3', 'pn');
  const total = siteScore + req.pain_score + sizeScore + cbScore;
  return { mirels_total: total, max: 12, recommendation: total >= 9 ? 'prophylactic_fixation' : total >= 7 ? 'close_monitoring_or_fixation' : 'nonoperative_followup' };
}

function t312_e2_biopsy_plan(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid'); ensureStr(req.lesion_site, 'ls');
  ensureEnum(req.suspicion, 'sp', ['benign','aggressive','malignant']);
  return { plan: req.suspicion === 'benign' ? 'intralesional_biopsy' : 'incisional_biopsy_orthOnc_center',
    biopsy_tract_marked: true, note: 'tract excised later if malignant', planned_by: 'ortho_oncology' };
}

function t312_e3_treatment_pathway(req) {
  ensureStr(req.tenant_id, 'tid'); ensureEnum(req.diagnosis, 'dx', ['osteosarcoma','ewing','chondrosarcoma','metastasis','GCT','other']);
  ensureBool(req.metastatic, 'mt');
  const map = { osteosarcoma:'neoadj_chemo_then_wide_resection', ewing:'chemo_radio_wide_resection',
    chondrosarcoma:'wide_resection_chemo_resistant', metastasis:'palliative_fixation_radiation', GCT:'curettage_adjuvant', other:'mdt_discussion' };
  return { diagnosis: req.diagnosis, pathway: map[req.diagnosis], mdt_required: req.diagnosis === 'other' || req.metastatic };
}

function t312_e4_followup_schedule(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.months_since_tx, 'mo'); ensureEnum(req.risk, 'rk', ['low','standard','high']);
  const interval = { low: 6, standard: 3, high: 1 }[req.risk];
  return { next_visit_months: interval, imaging: req.risk === 'high' ? 'MRI+CT_chest' : 'Xray_local', months_since_tx: req.months_since_tx };
}

function t312_e5_case_register(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.lesion_type, 'lt', ['osteosarcoma','ewing','chondrosarcoma','metastasis','GCT','benign','other']);
  ensureStr(req.site, 'st');
  return { register_id: `oox_${Date.now()}`, lesion_type: req.lesion_type, site: req.site, registered_at: new Date().toISOString() };
}

function funcs() { return { t312_e1_lesion_risk_mirels, t312_e2_biopsy_plan, t312_e3_treatment_pathway, t312_e4_followup_schedule, t312_e5_case_register }; }
module.exports = { funcs, ValidationError };
