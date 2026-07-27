// P3-BX cardio_ext3_engine.js — 10 pure functions
const Engine = {
  ACS: function (i) {
    const type = (i.type || 'unknown');
    const trop = (i.trop || 0);
    if (type === 'STEMI') return { plan: 'cath-lab-activation' };
    if (type === 'NSTEMI' || trop > 0.5) return { plan: 'heparin-and-cath' };
    if (trop > 0.04) return { plan: 'serial-trop-and-eval' };
    return { plan: 'observation-and-stress' };
  },
  HF: function (i) {
    const ef = (i.ef || 50);
    const sx = (i.sx || 'none');
    if (ef < 30 && sx === 'severe') return { plan: 'inotrope-and-transplant-eval' };
    if (ef < 40) return { plan: 'GDMT-and-device-eval' };
    if (sx === 'yes') return { plan: 'diuretic-and-GDMT' };
    return { plan: 'monitor-and-typed' };
  },
  AF: function (i) {
    const rate = (i.rate || 80);
    const onset = (i.onset || 'unknown');
    if (onset === 'acute' && rate >= 130) return { plan: 'cardioversion' };
    if (onset === 'acute' && rate < 130) return { plan: 'rate-control-and-eval' };
    if (rate >= 100) return { plan: 'rate-control-and-anticoag' };
    return { plan: 'anticoag-and-eval' };
  },
  Valve: function (i) {
    const type = (i.type || 'AS');
    const severity = (i.severity || 'mild');
    if (type === 'AS' && severity === 'severe') return { plan: 'TAVR-or-SAVR' };
    if (type === 'MR' && severity === 'severe') return { plan: 'MVR-or-repair' };
    if (severity === 'moderate') return { plan: 'monitor-and-FU' };
    return { plan: 'monitor-annually' };
  },
  HTN: function (i) {
    const bp = (i.bp || 130);
    if (bp >= 180) return { plan: 'urgent-eval-and-treatment' };
    if (bp >= 160) return { plan: 'multi-drug-and-eval' };
    if (bp >= 140) return { plan: 'lifestyle-and-drug-eval' };
    if (bp >= 130) return { plan: 'lifestyle-and-eval' };
    return { plan: 'monitor-annually' };
  },
  Lipid: function (i) {
    const ldl = (i.ldl || 100);
    if (ldl >= 190) return { plan: 'high-intensity-statin' };
    if (ldl >= 130) return { plan: 'moderate-statin' };
    return { plan: 'lifestyle-and-monitor' };
  },
  Anticoag: function (i) {
    const ind = (i.ind || 'AF');
    const cha2ds2 = (i.cha2ds2 || 1);
    if (ind === 'AF' && cha2ds2 >= 2) return { plan: 'anticoag-and-eval' };
    if (ind === 'DVT' || ind === 'PE') return { plan: 'anticoag-3mo' };
    if (ind === 'mech-valve') return { plan: 'warfarin-and-INR' };
    return { plan: 'monitor-and-typed' };
  },
  EP: function (i) {
    const finding = (i.finding || 'unknown');
    if (finding === 'VT') return { plan: 'ICD-and-eval' };
    if (finding === 'SVT') return { plan: 'ablation-and-eval' };
    if (finding === 'WPW') return { plan: 'ablation-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Pericardial: function (i) {
    const finding = (i.finding || 'unknown');
    if (finding === 'tamponade') return { plan: 'pericardiocentesis-and-eval' };
    if (finding === 'constrictive') return { plan: 'pericardiectomy-and-eval' };
    if (finding === 'effusion') return { plan: 'echo-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  PAD: function (i) {
    const abi = (i.abi || 1);
    if (abi < 0.5) return { plan: 'revascularize-and-eval' };
    if (abi < 0.9) return { plan: 'risk-factor-and-eval' };
    if (abi > 1.3) return { plan: 'imaging-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
};
module.exports = Engine;
