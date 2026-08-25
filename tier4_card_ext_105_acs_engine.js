'use strict';
// TIER4_CARD_EXT-105: ACS classification + reperfusion strategy
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ACC_AHA_ACS_2022', 'ESC_ACS_2020'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureEnum(v, allowed, field) {
  if (!allowed.includes(v)) throw new ValidationError(`${field} must be one of ${allowed.join('|')}`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function classify(req) {
  ensureStr(req.type, 'type'); // stemi | nstemi | ua
  ensureNumber(req.st_elevation, 'st_elevation');
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.age, 'age');
  ensureBool(req.killip_iv, 'killip_iv');
  ensureBool(req.cardiogenic_shock, 'cardiogenic_shock');
  ensureBool(req.cardiac_arrest, 'cardiac_arrest');

  const high_risk = req.killip_iv || req.cardiogenic_shock || req.cardiac_arrest || req.sbp < 90;
  return {
    type: req.type,
    st_elevation: req.st_elevation,
    high_risk,
    killip_class: req.killip_iv ? 'IV' : 'I',
    citations: CITATIONS,
  };
}

function reperfusion(req) {
  ensureStr(req.type, 'type');
  ensureNumber(req.symptoms_minutes, 'symptoms_minutes');
  ensureBool(req.pci_available, 'pci_available');
  ensureBool(req.fibrinolysis_eligible, 'fibrinolysis_eligible');
  ensureBool(req.bleeding_contraindication, 'bleeding_contraindication');
  ensureBool(req.stemi_equivalent, 'stemi_equivalent');
  ensureNumber(req.first_medical_contact_min, 'first_medical_contact_min');

  let strategy, time_target;
  if (req.type === 'stemi' || req.stemi_equivalent) {
    if (req.pci_available && req.first_medical_contact_min <= 120) {
      strategy = 'primary_pci';
      time_target = 'door_to_balloon_less_than_90_min';
    } else if (req.fibrinolysis_eligible && req.symptoms_minutes <= 180) {
      strategy = 'fibrinolysis_then_transfer_to_pci_center';
      time_target = 'door_to_needle_less_than_30_min';
    } else {
      strategy = 'transfer_to_pci_center';
      time_target = 'first_medical_contact_to_device_less_than_120_min';
    }
  } else {
    strategy = req.pci_available ? 'early_invasive_within_24h' : 'invasive_within_72h';
    time_target = 'risk_stratified_timing';
  }
  return {
    type: req.type,
    strategy,
    time_target,
    antiplatelet: req.bleeding_contraindication ? 'aspirin_alone' : 'aspirin_plus_p2y12_inhibitor',
    anticoagulation: 'unfractionated_heparin_or_lmwh_per_protocol',
    citations: CITATIONS,
  };
}

module.exports = { classify, reperfusion, CITATIONS, ValidationError };