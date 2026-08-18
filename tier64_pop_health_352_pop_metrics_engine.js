// filepath: tier64_pop_health_352_pop_metrics_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function hEDIS_measure(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.measure, 'mea');
  ensureNum(req.denominator, 'den');
  ensureNum(req.numerator, 'num');
  ensureNum(req.rate, 'rate');
  ensureNum(req.target, 'tg');
  ensureNum(req.benchmark, 'bm');
  ensureEnum(req.gap, 'gap', ['meets_target','needs_improvement','significant_gap','declining','improving']);
  return { measure: req.measure };
}
function quality_pay_performance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.program, 'prog', ['MIPS_2026','MIPS_2025','MIPS_2024','ACO_REACH','Medicare_Stars','Medicaid_CHP','commercial_p4p','hospital_vbp']);
  ensureNum(req.composite_score, 'cs');
  ensureNum(req.target, 'tg');
  ensureEnum(req.incentive, 'inc', ['positive_adjustment','neutral','negative_adjustment','exceptional_performance_bonus','penalty','pending']);
  ensureNum(req.measures_passed, 'mp');
  ensureNum(req.measures_failed, 'mf');
  ensureNum(req.estimated_payout, 'ep');
  return { program: req.program };
}
function metric_trend(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.metric, 'met');
  ensureNum(req.periods, 'per');
  ensureEnum(req.direction, 'dir', ['improving','declining','stable','variable','insufficient_data']);
  ensureNum(req.change_pct, 'cp');
  ensureBool(req.statistical_significance, 'ss');
  ensureNum(req.latest_value, 'lv');
  ensureNum(req.baseline_value, 'bv');
  return { metric: req.metric };
}
function benchmark_comparison(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.metric, 'met');
  ensureNum(req.our_value, 'ov');
  ensureNum(req.p25, 'p25');
  ensureNum(req.p50, 'p50');
  ensureNum(req.p75, 'p75');
  ensureNum(req.p90, 'p90');
  ensureNum(req.national_top_10, 'nt10');
  return { metric: req.metric };
}
function intervention_roi(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.intervention_id, 'iid');
  ensureNum(req.cost_per_patient, 'cpp');
  ensureNum(req.savings_per_patient, 'spp');
  ensureNum(req.roi, 'roi');
  ensureNum(req.patients_enrolled, 'pe');
  ensureNum(req.total_savings, 'ts');
  ensureEnum(req.conclusion, 'con', ['highly_recommended','recommended','neutral','marginal','not_recommended','re_evaluate']);
  return { intervention: req.intervention_id };
}

function funcs() { return { hEDIS_measure, quality_pay_performance, metric_trend, benchmark_comparison, intervention_roi }; }
module.exports = { funcs, ValidationError };