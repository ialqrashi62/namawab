// P3-BW onco_ext3_engine.js — 10 pure functions
const Engine = {
  Staging: function (i) {
    const stage = (i.stage || 'I');
    if (stage === 'IV') return { plan: 'systemic-and-palliative' };
    if (stage === 'III') return { plan: 'multimodal-and-eval' };
    if (stage === 'II') return { plan: 'surgery-and-adjuvant' };
    return { plan: 'surgery-and-FU' };
  },
  Chemo: function (i) {
    const regimen = (i.regimen || 'standard');
    if (regimen === 'high-dose') return { plan: 'transplant-and-eval' };
    if (regimen === 'targeted') return { plan: 'targeted-and-eval' };
    return { plan: 'standard-and-eval' };
  },
  Radiation: function (i) {
    const dose = (i.dose || 50);
    if (dose >= 70) return { plan: 'rad-and-eval' };
    if (dose >= 50) return { plan: 'rad-and-typed' };
    return { plan: 'rad-and-FU' };
  },
  Target: function (i) {
    const marker = (i.marker || 'unknown');
    if (marker === 'HER2') return { plan: 'trastuzumab-and-eval' };
    if (marker === 'BRAF') return { plan: 'vemurafenib-and-eval' };
    if (marker === 'EGFR') return { plan: 'erlotinib-and-eval' };
    if (marker === 'PDL1') return { plan: 'pembrolizumab-and-eval' };
    return { plan: 'screen-and-decide' };
  },
  Immuno: function (i) {
    const agent = (i.agent || 'PD1');
    if (agent === 'PD1') return { plan: 'pembrolizumab-and-eval' };
    if (agent === 'CTLA4') return { plan: 'ipilimumab-and-eval' };
    return { plan: 'combination-and-eval' };
  },
  Surgery: function (i) {
    const type = (i.type || 'curative');
    if (type === 'palliative') return { plan: 'palliative-and-support' };
    if (type === 'debulking') return { plan: 'debulk-and-eval' };
    return { plan: 'resection-and-typed' };
  },
  Complication: function (i) {
    const comp = (i.comp || 'none');
    if (comp === 'neutropenic-fever') return { plan: 'ABx-and-GCSF' };
    if (comp === 'thrombosis') return { plan: 'anticoag-and-eval' };
    if (comp === 'hypercalcemia') return { plan: 'bisphosphonate-and-eval' };
    if (comp === 'spinal-cord') return { plan: 'steroids-and-radiation' };
    return { plan: 'monitor-and-typed' };
  },
  Survivorship: function (i) {
    const years = (i.years || 1);
    const sx = (i.sx || 'none');
    if (years < 1) return { plan: 'surveillance-and-support' };
    if (years >= 5) return { plan: 'annual-surveillance' };
    if (sx !== 'none') return { plan: 'workup-and-support' };
    return { plan: 'surveillance-and-FU' };
  },
  Palliative: function (i) {
    const urgency = (i.urgency || 'stable');
    if (urgency === 'urgent') return { plan: 'symptom-control-and-hospice' };
    if (urgency === 'moderate') return { plan: 'support-and-comfort' };
    return { plan: 'monitor-and-typed' };
  },
  Screening: function (i) {
    const type = (i.type || 'colon');
    if (type === 'mammogram' && i.age >= 50) return { plan: 'annual-mammo' };
    if (type === 'colon' && i.age >= 45) return { plan: 'colon-and-FIT' };
    if (type === 'lung' && i.smoker === 'yes') return { plan: 'low-dose-CT' };
    if (type === 'cervical') return { plan: 'pap-and-HPV' };
    return { plan: 'screen-and-FU' };
  },
};
module.exports = Engine;
