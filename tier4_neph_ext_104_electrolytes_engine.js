'use strict';
// TIER4_NEPH_EXT-104: Electrolytes (Na, K, Ca, Mg, Phos)
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['KDIGO_Electrolytes_2023', 'UpToDate_Electrolytes'];

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

function sodium(req) {
  ensureNumber(req.na, 'na');
  ensureBool(req.symptoms_severe, 'symptoms_severe');
  ensureNumber(req.change_rate, 'change_rate');
  ensureBool(req.acute, 'acute'); // <48h
  ensureNumber(req.serum_osm, 'serum_osm');

  let interpretation, management;
  if (req.na < 120) {
    interpretation = 'severe_hyponatremia';
    management = req.symptoms_severe ? 'hypertonic_saline_3_percent_with_care' : 'fluid_restriction_and_tolvaptan_or_urea';
  } else if (req.na < 135) {
    interpretation = 'hyponatremia';
    management = req.acute ? 'fluid_restriction_assess_volume_status' : 'fluid_restriction_daily_weights_tolvaptan_consider';
  } else if (req.na > 145 && req.na < 155) {
    interpretation = 'mild_hypernatremia';
    management = 'free_water_replacement_correct_over_48_72_hours';
  } else if (req.na >= 155) {
    interpretation = 'severe_hypernatremia';
    management = 'iv_d5w_with_na_replacement_slow_correction';
  } else {
    interpretation = 'normal';
    management = 'maintain_fluid_balance';
  }
  const overcorrection = req.change_rate > 12;
  return {
    na: req.na,
    interpretation,
    management,
    overcorrection_warning: overcorrection,
    citations: CITATIONS,
  };
}

function potassium(req) {
  ensureNumber(req.k, 'k');
  ensureBool(req.ecg_changes, 'ecg_changes');
  ensureBool(req.dialysis, 'dialysis');

  let interpretation, management;
  if (req.k < 2.5) {
    interpretation = 'severe_hypokalemia';
    management = req.ecg_changes ? 'iv_kcl_central_with_monitoring' : 'iv_kcl_with_mg_repletion';
  } else if (req.k < 3.5) {
    interpretation = 'hypokalemia';
    management = 'oral_potassium_and_magnesium_repletion';
  } else if (req.k > 6.5) {
    interpretation = 'severe_hyperkalemia';
    management = req.ecg_changes ? 'calcium_gluconate_insulin_dextrose_kayexalate_emergent' : 'insulin_dextrose_kayexalate_patience_kayexalate';
  } else if (req.k > 5.0) {
    interpretation = 'hyperkalemia';
    management = req.dialysis ? 'urgent_dialysis' : 'kayexalate_lactulose_insulin_as_needed';
  } else {
    interpretation = 'normal';
    management = 'maintain';
  }
  return {
    k: req.k,
    interpretation,
    management,
    citations: CITATIONS,
  };
}

function calcium(req) {
  ensureNumber(req.ca_total, 'ca_total');
  ensureNumber(req.albumin, 'albumin');
  ensureNumber(req.mg, 'mg');
  ensureNumber(req.phos, 'phos');

  const ca_corrected = req.ca_total + 0.8 * Math.max(0, (4 - req.albumin));
  let interpretation, management;
  if (ca_corrected < 8) {
    interpretation = 'hypocalcemia';
    management = req.mg < 1.8 ? 'replete_magnesium_first' : 'iv_calcium_gluconate_then_oral';
  } else if (ca_corrected > 10.5) {
    interpretation = req.phos > 4.5 ? 'hypercalcemia_renal_dysfunction_or_tertiary_hpth' : 'hypercalcemia';
    management = req.phos > 4.5 ? 'avoid_calcium_vitamin_d_reduce_phosphate' : 'iv_fluids_then_bisphosphonates';
  } else {
    interpretation = 'normal';
    management = 'maintain';
  }
  return {
    ca_corrected,
    interpretation,
    management,
    citations: CITATIONS,
  };
}

function phosphorus(req) {
  ensureNumber(req.phos, 'phos');
  ensureNumber(req.egfr, 'egfr');
  ensureNumber(req.ca_total, 'ca_total');
  ensureNumber(req.pth, 'pth');

  let interpretation, management;
  if (req.phos < 2) {
    interpretation = 'severe_hypophosphatemia';
    management = 'iv_sodium_phosphate_or_potassium_phosphate_with_monitoring';
  } else if (req.phos < 2.5) {
    interpretation = 'hypophosphatemia';
    management = 'oral_phosphate_replacement_treat_underlying';
  } else if (req.phos > 4.5) {
    interpretation = req.egfr < 30 ? 'hyperphosphatemia_ckd_related' : 'hyperphosphatemia';
    management = req.egfr < 30 ? 'phosphate_binders_meal_time_and_dietary_restriction' : 'evaluate_renal_function_and_diet';
  } else {
    interpretation = 'normal';
    management = 'maintain';
  }
  return {
    phos: req.phos,
    pth: req.pth,
    interpretation,
    management,
    citations: CITATIONS,
  };
}

function magnesium(req) {
  ensureNumber(req.mg, 'mg');
  ensureBool(req.symptoms, 'symptoms');

  let interpretation, management;
  if (req.mg < 1) {
    interpretation = 'severe_hypomagnesemia';
    management = 'iv_mg_sulfate_2g_with_monitoring';
  } else if (req.mg < 1.7) {
    interpretation = 'hypomagnesemia';
    management = req.symptoms ? 'iv_mg_sulfate' : 'oral_mg_repletion';
  } else if (req.mg > 2.5) {
    interpretation = 'hypermagnesemia';
    management = 'iv_calcium_gluconate_consider_dialysis_if_severe';
  } else {
    interpretation = 'normal';
    management = 'maintain';
  }
  return {
    mg: req.mg,
    interpretation,
    management,
    citations: CITATIONS,
  };
}

module.exports = { sodium, potassium, calcium, phosphorus, magnesium, CITATIONS, ValidationError };