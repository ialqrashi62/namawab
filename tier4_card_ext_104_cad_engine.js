'use strict';
// TIER4_CARD_EXT-104: CAD risk + SYNTAX-like revascularization
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACC_AHA_CAD_2018', 'ESC_Revasc_2018'];

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

function risk(req) {
  ensureNumber(req.age, 'age');
  ensureNumber(req.total_cholesterol, 'total_cholesterol');
  ensureNumber(req.hdl, 'hdl');
  ensureNumber(req.sbp, 'sbp');
  ensureBool(req.htn_treated, 'htn_treated');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.smoker, 'smoker');
  ensureBool(req.family_history, 'family_history');

  const age_points = req.age >= 75 ? 7 : req.age >= 65 ? 5 : req.age >= 55 ? 3 : req.age >= 45 ? 1 : 0;
  const chol_points = req.total_cholesterol >= 280 ? 3 : req.total_cholesterol >= 230 ? 2 : req.total_cholesterol >= 200 ? 1 : 0;
  const hdl_points = req.hdl >= 60 ? -1 : req.hdl < 40 ? 2 : 0;
  const sbp_points = req.sbp >= 160 ? 3 : req.sbp >= 140 ? 2 : req.sbp >= 130 ? 1 : 0;
  const total = age_points + chol_points + hdl_points + sbp_points +
    (req.htn_treated ? 1 : 0) +
    (req.diabetes ? 2 : 0) +
    (req.smoker ? 2 : 0) +
    (req.family_history ? 1 : 0);
  const ten_year_risk = total >= 18 ? 'high_greater_than_30' :
    total >= 12 ? 'high_20_30' :
    total >= 7 ? 'intermediate_10_20' :
    total >= 4 ? 'low_intermediate_5_10' : 'low_less_than_5';
  return {
    risk_points: total,
    ten_year_risk,
    recommendation: total >= 7 ? 'statin_and_lifestyle_intensive' : 'lifestyle_intensive_reassess_in_5y',
    citations: CITATIONS,
  };
}

function syntax(req) {
  ensureNumber(req.syntax_score, 'syntax_score');
  ensureNumber(req.lvef, 'lvef');
  ensureNumber(req.age, 'age');
  ensureBool(req.diabetes, 'diabetes');
  ensureBool(req.creatinine_elevated, 'creatinine_elevated');
  ensureBool(req.lm_disease, 'lm_disease');

  const low = req.syntax_score <= 22;
  const intermediate = req.syntax_score > 22 && req.syntax_score <= 32;
  const high = req.syntax_score > 32;
  const cabg = (req.syntax_score > 22 && (req.diabetes || req.lm_disease || req.lvef <= 50)) || req.syntax_score > 32;
  const pci = req.syntax_score <= 22;
  return {
    syntax_score: req.syntax_score,
    risk_category: high ? 'high' : intermediate ? 'intermediate' : 'low',
    recommended_strategy: cabg ? 'cabg_preferred' : pci ? 'pci_acceptable' : 'heart_team_decision',
    citations: CITATIONS,
  };
}

module.exports = { risk, syntax, CITATIONS, ValidationError };