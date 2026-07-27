// P3-BS gen_med_ext_engine.js — 10 pure functions
const Engine = {
  Triage: function (i) {
    const acuity = (i.acuity || 3);
    if (acuity === 1) return { plan: 'resus-and-team' };
    if (acuity === 2) return { plan: 'acute-bay-and-eval' };
    if (acuity === 3) return { plan: 'fast-track-and-workup' };
    if (acuity === 4) return { plan: 'urgent-care-and-FU' };
    return { plan: 'eval-and-decide' };
  },
  Sepsis: function (i) {
    const qsofa = (i.qsofa || 0);
    const lactate = (i.lactate || 1);
    if (qsofa >= 2 || lactate > 4) return { plan: 'bundle-1hr-and-ABx' };
    if (qsofa >= 1 && lactate > 2) return { plan: 'lactate-clear-and-ABx' };
    if (lactate > 2) return { plan: 'recheck-and-decide' };
    return { plan: 'monitor-and-eval' };
  },
  ChestPain: function (i) {
    const acs = (i.acs || 'no');
    const trop = (i.trop || 0);
    if (acs === 'STEMI') return { plan: 'cath-lab-activation' };
    if (acs === 'NSTEMI' || trop > 0.5) return { plan: 'heparin-and-cath' };
    if (trop > 0.04) return { plan: 'serial-trop-and-eval' };
    if (acs === 'no') return { plan: 'observation-and-stress' };
    return { plan: 'eval-and-decide' };
  },
  ShortBreath: function (i) {
    const spO2 = (i.spO2 || 95);
    const cause = (i.cause || 'unknown');
    if (spO2 < 90) return { plan: 'O2-and-eval' };
    if (cause === 'PE') return { plan: 'CTPA-and-anticoag' };
    if (cause === 'CHF') return { plan: 'diuretic-and-eval' };
    if (cause === 'COPD') return { plan: 'bronchodilator-and-eval' };
    return { plan: 'CXR-and-eval' };
  },
  AbdPain: function (i) {
    const surgical = (i.surgical || 'no');
    if (surgical === 'yes') return { plan: 'surgery-consult-and-OR' };
    if (surgical === 'no') return { plan: 'CT-and-eval' };
    return { plan: 'eval-and-decide' };
  },
  Fever: function (i) {
    const source = (i.source || 'unknown');
    const sepsis = (i.sepsis || 'no');
    if (sepsis === 'yes') return { plan: 'bundle-1hr-and-ABx' };
    if (source === 'pneumonia') return { plan: 'CXR-and-ABx' };
    if (source === 'UTI') return { plan: 'UA-and-ABx' };
    if (source === 'cellulitis') return { plan: 'ABx-and-eval' };
    return { plan: 'workup-and-typed-ABx' };
  },
  Syncope: function (i) {
    const cause = (i.cause || 'unknown');
    if (cause === 'cardiac') return { plan: 'echo-and-telemetry' };
    if (cause === 'orthostatic') return { plan: 'fluids-and-ortho' };
    if (cause === 'vasovagal') return { plan: 'monitor-and-FU' };
    return { plan: 'telemetry-and-eval' };
  },
  BackPain: function (i) {
    const redFlag = (i.redFlag || 'no');
    if (redFlag === 'yes') return { plan: 'MRI-and-spine-consult' };
    if (redFlag === 'no') return { plan: 'NSAID-and-PT' };
    return { plan: 'eval-and-decide' };
  },
  Headache: function (i) {
    const redFlag = (i.redFlag || 'no');
    if (redFlag === 'yes') return { plan: 'CT-and-LP' };
    if (redFlag === 'no') return { plan: 'NSAID-and-FU' };
    return { plan: 'eval-and-decide' };
  },
  Dizzy: function (i) {
    const cause = (i.cause || 'unknown');
    if (cause === 'central') return { plan: 'MRI-and-eval' };
    if (cause === 'BPPV') return { plan: 'Epley-and-FU' };
    if (cause === 'peripheral') return { plan: 'meclizine-and-eval' };
    return { plan: 'HINTS-and-eval' };
  },
};
module.exports = Engine;
