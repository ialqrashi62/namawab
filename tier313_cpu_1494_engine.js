// tier313_cpu_1494_engine.js — Chest Pain Unit (HEART score pathway)
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

// HEART score: History(0-2), ECG(0-2), Age(0-2), RiskFactors(0-2), Troponin(0-2); 0-3 low discharge, 4-6 obs/serial, >=7 early invasive
function t313_e1_heart_score(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.history_score, 'hx'); ensureNum(req.ecg_score, 'ecg'); ensureNum(req.age_score, 'ag');
  ensureNum(req.risk_factor_score, 'rf'); ensureNum(req.troponin_score, 'trop');
  const parts = [req.history_score, req.ecg_score, req.age_score, req.risk_factor_score, req.troponin_score];
  if (parts.some(p => p < 0 || p > 2)) throw new ValidationError('each HEART component must be 0-2', 'scores');
  const total = parts.reduce((a, b) => a + b, 0);
  const pathway = total <= 3 ? 'discharge_with_gp_followup' : total <= 6 ? 'observation_serial_troponin' : 'early_invasive_strategy';
  return { heart_total: total, max: 10, mace_risk: total <= 3 ? '1.7%' : total <= 6 ? '16.6%' : '50.1%', pathway };
}

function t313_e2_serial_troponin_track(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  if (!Array.isArray(req.values) || req.values.length < 2) throw new ValidationError('values[] (>=2 troponins) required', 'values');
  const delta = req.values[req.values.length - 1] - req.values[0];
  return { series: req.values, delta, rising: delta > 0, significant_rise: Math.abs(delta) >= (req.threshold || 5), next_draw_hours: 3 };
}

function t313_e3_disposition_decision(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.heart_total, 'ht'); ensureBool(req.dynamic_ecg_changes, 'dec'); ensureBool(req.hemodynamically_stable, 'stable');
  if (req.heart_total < 0 || req.heart_total > 10) throw new ValidationError('heart_total must be 0-10', 'ht');
  if (!req.stable || req.dynamic_ecg_changes && req.heart_total >= 4) return { disposition: 'ccu_admission', urgent_cath_consider: true };
  if (req.heart_total <= 3 && !req.dynamic_ecg_changes) return { disposition: 'discharge', followup_days: 3 };
  return { disposition: 'cpu_observation_unit', serial_troponin_hours: [0, 3, 6] };
}

function t313_e4_observation_episode_record(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.unit, 'un', ['CPU','CCU','ward']); ensureNum(req.hours_in_unit, 'hrs');
  ensureBool(req.rule_out_complete, 'ro');
  return { episode_id: `cpu_${Date.now()}`, unit: req.unit, hours_in_unit: req.hours_in_unit, rule_out_complete: req.rule_out_complete, closed_at: req.rule_out_complete ? new Date().toISOString() : null };
}

function t313_e5_grace_risk_estimate(req) {
  ensureStr(req.tenant_id, 'tid'); ensureNum(req.age, 'ag'); ensureNum(req.heart_rate, 'hr');
  ensureNum(req.sbp, 'sbp'); ensureNum(req.creatinine, 'cr');
  if (req.sbp <= 0) throw new ValidationError('sbp must be > 0', 'sbp');
  const simplified = Math.round(req.age * 0.4 + req.heart_rate * 0.1 + (140 - req.sbp) * 0.15 + req.creatinine * 2);
  return { grace_proxy_score: simplified, risk_band: simplified > 140 ? 'high' : simplified > 108 ? 'intermediate' : 'low', note: 'proxy — full GRACE uses killip/cardiac arrest biomarkers' };
}

function funcs() { return { t313_e1_heart_score, t313_e2_serial_troponin_track, t313_e3_disposition_decision, t313_e4_observation_episode_record, t313_e5_grace_risk_estimate }; }
module.exports = { funcs, ValidationError };
