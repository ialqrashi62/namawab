// P3-BP vasc_ext_engine.js — 10 pure functions
const Engine = {
  AAA: function (i) {
    const size = (i.size || 4);
    const growth = (i.growth || 0);
    if (size >= 5.5 || (size >= 4.5 && growth >= 0.5)) return { plan: 'urgent-EVAR-or-open-repair' };
    if (size >= 5) return { plan: 'EVAR-eval-and-FU' };
    if (size >= 4) return { plan: 'surveillance-every-6-12mo' };
    if (size < 4) return { plan: 'surveillance-every-2-3y' };
    return { plan: 'monitor-and-eval' };
  },
  Carotid: function (i) {
    const stenosis = (i.stenosis || 30);
    const symptom = (i.symptom || 'no');
    if (symptom === 'yes' && stenosis >= 70) return { plan: 'CEA-or-CAS' };
    if (symptom === 'yes' && stenosis >= 50) return { plan: 'CEA-eval' };
    if (symptom === 'no' && stenosis >= 60) return { plan: 'CEA-eval' };
    if (stenosis >= 50) return { plan: 'medical-and-surveillance' };
    return { plan: 'medical-and-monitor' };
  },
  PAD: function (i) {
    const abi = (i.abi || 1);
    const symptom = (i.symptom || 'claudication');
    if (abi < 0.4 && symptom === 'rest-pain') return { plan: 'urgent-revascularization' };
    if (abi < 0.4) return { plan: 'revascularization-eval' };
    if (abi < 0.7 && symptom === 'claudication') return { plan: 'supervised-exercise-and-statin' };
    if (abi < 0.9) return { plan: 'risk-factor-modification' };
    if (abi > 1.4) return { plan: 'calcification-and-medial-test' };
    return { plan: 'normal-ABI' };
  },
  DVT: function (i) {
    const location = (i.location || 'distal');
    const trigger = (i.trigger || 'provoked');
    if (location === 'proximal') return { plan: 'anticoagulate-3-6mo' };
    if (location === 'distal' && trigger === 'unprovoked') return { plan: 'anticoagulate-3mo' };
    if (location === 'distal') return { plan: 'serial-US-and-treat-if-extension' };
    if (trigger === 'cancer') return { plan: 'LMWH-3-6mo' };
    return { plan: 'anticoagulate-3-6mo' };
  },
  VaricoseVein: function (i) {
    const symptom = (i.symptom || 'mild');
    const complication = (i.complication || 'no');
    if (complication === 'ulcer' || complication === 'bleeding') return { plan: 'ablation-or-sclerotherapy' };
    if (complication === 'thrombophlebitis') return { plan: 'ablation-and-NSAID' };
    if (symptom === 'severe') return { plan: 'ablation-or-surgery' };
    if (symptom === 'moderate') return { plan: 'compression-and-eval' };
    return { plan: 'compression-and-lifestyle' };
  },
  AorticDissect: function (i) {
    const type = (i.type || 'B');
    const complication = (i.complication || 'no');
    if (type === 'A') return { plan: 'emergent-surgical-repair' };
    if (type === 'B' && complication === 'malperfusion') return { plan: 'TEVAR-and-medical' };
    if (type === 'B' && complication === 'rupture') return { plan: 'TEVAR-emergent' };
    if (type === 'B') return { plan: 'medical-BP-control' };
    return { plan: 'eval-and-treat' };
  },
  MesentericIsch: function (i) {
    const acuteness = (i.acuteness || 'chronic');
    if (acuteness === 'acute') return { plan: 'emergent-CTA-and-vascular' };
    if (acuteness === 'chronic' && i.severe === 'yes') return { plan: 'mesenteric-revascularization' };
    if (acuteness === 'chronic') return { plan: 'medical-and-monitor' };
    return { plan: 'eval-and-treat' };
  },
  ThoracicAortic: function (i) {
    const size = (i.size || 4);
    const symptom = (i.symptom || 'no');
    if (size >= 6 && symptom === 'yes') return { plan: 'TEVAR-or-open-repair' };
    if (size >= 6) return { plan: 'TEVAR-eval' };
    if (size >= 5) return { plan: 'surveillance-every-6mo' };
    if (size < 5) return { plan: 'surveillance-every-1-2y' };
    return { plan: 'monitor-and-eval' };
  },
  DialysisAccess: function (i) {
    const type = (i.type || 'AVF');
    const flow = (i.flow || 600);
    if (type === 'AVG' && flow < 300) return { plan: 'declot-and-angiogram' };
    if (flow < 200) return { plan: 'urgent-angiogram' };
    if (flow < 400) return { plan: 'surveillance-US-and-eval' };
    if (flow > 2000) return { plan: 'flow-reduction-eval' };
    return { plan: 'continue-and-monitor' };
  },
  Lymphedema: function (i) {
    const stage = (i.stage || 'I');
    const cause = (i.cause || 'primary');
    if (stage === 'III') return { plan: 'complete-decongestive-therapy' };
    if (stage === 'II' && cause === 'cancer') return { plan: 'CDT-and-compression' };
    if (stage === 'II') return { plan: 'CDT-and-compression' };
    if (stage === 'I') return { plan: 'compression-and-exercise' };
    if (cause === 'cancer') return { plan: 'CDT-and-lymphatic-surgeon' };
    return { plan: 'monitor-and-compression' };
  },
};
module.exports = Engine;
