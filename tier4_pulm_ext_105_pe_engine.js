'use strict';
// TIER4_PULM_EXT-105: PE risk stratification and treatment (sub-massive vs massive)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ESC_PE_2019', 'AHA_PE_2011', 'CHEST_2019'];

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
  ensureNumber(req.wells, 'wells');
  ensureNumber(req.hr, 'hr');
  ensureNumber(req.sbp, 'sbp');
  ensureBool(req.shock, 'shock');
  ensureBool(req.luftembolus, 'luftembolus'); // 'luftembolus'— keep var name as in original code (field validation)
  ensureNumber(req.troponin, 'troponin');
  ensureNumber(req.bnp, 'bnp');
  ensureNumber(req.spo2, 'spo2');

  const massive = req.shock || req.sbp < 90;
  const sub_massive = !massive && (req.troponin > 0.1 || req.bnp > 900 || req.spo2 < 90);
  const low_risk = !massive && !sub_massive && req.wells < 4;
  return {
    wells: req.wells,
    classification: massive ? 'massive' : sub_massive ? 'sub_massive' : low_risk ? 'low_risk' : 'intermediate_risk',
    massive,
    sub_massive,
    rv_dysfunction: sub_massive,
    treatment_intensity: massive ? 'systemic_thrombolysis_or_thrombectomy' :
      sub_massive ? 'anticoagulation_with_close_monitoring_consider_thrombolysis' :
        low_risk ? 'anticoagulation_outpatient_eligible' : 'anticoagulation_inpatient',
    citations: CITATIONS,
  };
}

function treatment(req) {
  ensureStr(req.classification, 'classification');
  ensureBool(req.bleeding_contraindication, 'bleeding_contraindication');
  ensureBool(req.pregnant, 'pregnant');
  ensureNumber(req.egfr, 'egfr');
  ensureBool(req.malignancy, 'malignancy');
  ensureBool(req.intolerance_to_doac, 'intolerance_to_doac');

  let anticoagulation;
  if (req.pregnant) anticoagulation = 'lmwh_throughout_pregnancy';
  else if (req.malignancy) anticoagulation = 'lmwh';
  else if (req.egfr >= 30) anticoagulation = req.intolerance_to_doac ? 'warfarin_with_inr_monitoring' : 'doac_apixaban_or_rivaroxaban';
  else anticoagulation = 'apixaban_or_warfarin_with_inr_monitoring';
  if (req.bleeding_contraindication) anticoagulation = 'consider_ivc_filter_with_consultation';
  const duration = req.malignancy || req.classification === 'massive' ? 'indefinite_or_until_risk_resolved' : '3_months_minimum_reassess';
  return {
    anticoagulation,
    duration,
    monitoring: req.egfr < 30 ? 'inr_q1_2_weeks_then_q4_weeks' : 'renal_labs_q3_months',
    citations: CITATIONS,
  };
}

module.exports = { risk, treatment, CITATIONS, ValidationError };