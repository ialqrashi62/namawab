// P3-BS trauma_ext_engine.js — 10 pure functions
const Engine = {
  Triage: function (i) {
    const acuity = (i.acuity || 3);
    const airway = (i.airway || 'patent');
    if (acuity === 1 || airway === 'compromised') return { plan: 'resus-bay-and-immediate' };
    if (acuity === 2) return { plan: 'trauma-bay-and-team' };
    if (acuity === 3) return { plan: 'fast-track-and-imaging' };
    if (acuity === 4) return { plan: 'urgent-care-and-FU' };
    return { plan: 'eval-and-disposition' };
  },
  Primary: function (i) {
    const gcs = (i.gcs || 15);
    const airway = (i.airway || 'patent');
    if (gcs <= 8 || airway === 'compromised') return { plan: 'intubate-and-ventilate' };
    if (gcs <= 12) return { plan: 'close-monitor-and-eval' };
    if (airway === 'threatened') return { plan: 'airway-eval-and-OR-prep' };
    return { plan: 'primary-survey-and-eval' };
  },
  Secondary: function (i) {
    const stable = (i.stable || 'yes');
    if (stable === 'no') return { plan: 'pan-scan-and-OR' };
    if (stable === 'yes') return { plan: 'head-to-toe-and-targeted' };
    return { plan: 'secondary-survey-and-decide' };
  },
  FAST: function (i) {
    const positive = (i.positive || 'no');
    if (positive === 'yes') return { plan: 'CT-angio-and-OR' };
    if (positive === 'no') return { plan: 'serial-exam-and-eval' };
    return { plan: 'FAST-and-imaging' };
  },
  Head: function (i) {
    const gcs = (i.gcs || 15);
    const pupils = (i.pupils || 'equal');
    if (gcs <= 8) return { plan: 'intubate-and-CT-ICP-monitor' };
    if (pupils === 'unequal' && gcs <= 12) return { plan: 'urgent-CT-and-NSGY' };
    if (gcs <= 12) return { plan: 'CT-head-and-eval' };
    if (pupils === 'unequal') return { plan: 'CT-head-and-eval' };
    return { plan: 'observe-and-FU' };
  },
  Chest: function (i) {
    const finding = (i.finding || 'none');
    if (finding === 'tension-ptx') return { plan: 'needle-decomp-and-chest-tube' };
    if (finding === 'massive-hemothorax') return { plan: 'chest-tube-and-OR' };
    if (finding === 'flail') return { plan: 'intubate-and-CT' };
    if (finding === 'ptx') return { plan: 'chest-tube-and-eval' };
    if (finding === 'rib-fx') return { plan: 'pain-control-and-FU' };
    return { plan: 'CXR-and-eval' };
  },
  Abdomen: function (i) {
    const fast = (i.fast || 'negative');
    const stable = (i.stable || 'yes');
    if (fast === 'positive' && stable === 'no') return { plan: 'OR-and-ex-lap' };
    if (fast === 'positive' && stable === 'yes') return { plan: 'CT-abd-and-eval' };
    if (stable === 'no') return { plan: 'OR-and-eval' };
    return { plan: 'serial-exam-and-eval' };
  },
  Pelvis: function (i) {
    const stable = (i.stable || 'yes');
    if (stable === 'no') return { plan: 'binder-and-IR' };
    if (stable === 'yes') return { plan: 'CT-pelvis-and-eval' };
    return { plan: 'binder-and-imaging' };
  },
  Spine: function (i) {
    const neuro = (i.neuro || 'intact');
    if (neuro === 'deficit') return { plan: 'MRI-and-spine-consult' };
    if (neuro === 'intact') return { plan: 'CT-spine-and-clear' };
    return { plan: 'CT-and-eval' };
  },
  MTP: function (i) {
    const active = (i.active || 'no');
    if (active === 'yes') return { plan: '1:1:1-and-MTP' };
    if (active === 'no') return { plan: 'monitor-and-typed-screen' };
    return { plan: 'eval-and-typed' };
  },
};
module.exports = Engine;
