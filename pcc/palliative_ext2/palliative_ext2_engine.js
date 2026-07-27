// P3-BG palliative_ext2_engine.js — 10 pure functions
const Engine = {
  SymptomBurden: function (i) {
    const pain = (i.pain || 0);
    const dyspnea = (i.dyspnea || 0);
    const fatigue = (i.fatigue || 0);
    const nausea = (i.nausea || 0);
    const score = pain + dyspnea + fatigue + nausea;
    let plan;
    if (score >= 30) plan = 'severe-symptom-burden-and-escalate-palliative-care';
    else if (score >= 20) plan = 'moderate-symptom-burden-and-multimodal';
    else if (score >= 10) plan = 'mild-symptom-burden-and-monitoring';
    else plan = 'minimal-symptom-burden-and-routine-care';
    return { score: score, plan: plan };
  },
  PrognosisEst: function (i) {
    const ecog = (i.ecog || 0);
    const albumin = (i.albumin || 4);
    const delirium = (i.delirium || 'no');
    const months = (delirium === 'yes' ? 1 : 6) - ecog * 1 - Math.max(0, 3 - albumin) * 0.5;
    let plan;
    if (months < 2) plan = 'end-of-life-and-hospice-eligible';
    else if (months < 4) plan = 'palliative-care-and-hospice-eval';
    else if (months < 6) plan = 'palliative-care-and-advanced-care-planning';
    else plan = 'palliative-care-and-disease-directed';
    return { monthsEstimate: months, plan: plan };
  },
  AdvanceDirective: function (i) {
    const codeStatus = (i.codeStatus || 'full-code');
    const proxy = (i.proxy || 'no');
    const wishes = (i.wishes || 'documented');
    if (codeStatus === 'full-code' && proxy === 'no') return { plan: 'AD-discussion-and-complete-form' };
    if (codeStatus === 'dnr' && proxy === 'yes' && wishes === 'documented') return { plan: 'AD-complete-and-on-file' };
    if (codeStatus === 'dnr' && proxy === 'no') return { plan: 'designate-health-care-proxy' };
    if (wishes === 'not-documented') return { plan: 'goals-of-care-conversation' };
    return { plan: 'AD-review-and-update-annually' };
  },
  HospiceEval: function (i) {
    const lifeLimit = (i.lifeLimit || 'unknown');
    const functionalDecline = (i.functionalDecline || 'no');
    const caregiver = (i.caregiver || 'no');
    if (lifeLimit === '<6mo' && functionalDecline === 'yes' && caregiver === 'yes') return { plan: 'hospice-eligible-and-refer' };
    if (lifeLimit === '<6mo' && caregiver === 'no') return { plan: 'hospice-eligible-and-arrange-caregiver' };
    if (functionalDecline === 'yes' && lifeLimit === 'unknown') return { plan: 'prognosis-assessment-and-hospice-prep' };
    return { plan: 'continue-palliative-care' };
  },
  PainRefractory: function (i) {
    const opDose = (i.opDose || 0);
    const adjuvants = (i.adjuvants || 'no');
    const sideEffects = (i.sideEffects || 'mild');
    if (opDose > 200 && adjuvants === 'yes' && sideEffects === 'severe') return { plan: 'palliative-sedation-and-ethics-consult' };
    if (opDose > 200 && adjuvants === 'no') return { plan: 'add-adjuvants-and-rotate-opioid' };
    if (sideEffects === 'severe') return { plan: 'opioid-rotation-and-side-effect-management' };
    if (opDose > 100) return { plan: 'high-dose-opioid-and-consider-palliative-radiation' };
    return { plan: 'titrate-opioid-and-monitor' };
  },
  DyspneaMgmt: function (i) {
    const oxygen = (i.oxygen || 'no');
    const anxiety = (i.anxiety || 'mild');
    const cause = (i.cause || 'unknown');
    if (oxygen === 'yes' && anxiety === 'severe') return { plan: 'opiate-and-anxiolytic-and-blow-fan' };
    if (oxygen === 'no' && cause === 'COPD') return { plan: 'trial-of-opiate-and-evaluate' };
    if (oxygen === 'yes' && anxiety === 'mild') return { plan: 'opiate-and-positioning-and-fan' };
    if (cause === 'CHF') return { plan: 'diuresis-and-morphine' };
    return { plan: 'oxygen-and-positioning' };
  },
  DeliriumTerminal: function (i) {
    const reversible = (i.reversible || 'no');
    const agitation = (i.agitation || 'mild');
    const family = (i.family || 'present');
    if (reversible === 'yes') return { plan: 'workup-and-treat-cause' };
    if (agitation === 'severe' && family === 'present') return { plan: 'haloperidol-and-family-support' };
    if (agitation === 'severe' && family === 'absent') return { plan: 'haloperidol-and-reorient-and-family-call' };
    if (agitation === 'mild') return { plan: 'reorient-and-environment-and-monitor' };
    return { plan: 'supportive-care' };
  },
  NutritionHydration: function (i) {
    const intake = (i.intake || 'normal');
    const prognosis = (i.prognosis || 'months');
    const wishes = (i.wishes || 'oral');
    if (intake === 'minimal' && prognosis === 'days') return { plan: 'comfort-feeds-and-ice-chips' };
    if (intake === 'minimal' && prognosis === 'months' && wishes === 'oral') return { plan: 'appetite-stimulant-and-meal-assistance' };
    if (wishes === 'tube') return { plan: 'PEG-or-NGT-eval' };
    if (wishes === 'iv') return { plan: 'IV-fluids-discussion' };
    return { plan: 'oral-intake-and-monitor' };
  },
  GriefBereavement: function (i) {
    const stage = (i.stage || 'normal');
    const duration = (i.duration || 0);
    const support = (i.support || 'present');
    if (stage === 'complicated' && duration > 6) return { plan: 'bereavement-counseling-and-refer' };
    if (stage === 'complicated' && support === 'absent') return { plan: 'peer-support-and-resources' };
    if (stage === 'normal' && duration > 12) return { plan: 'follow-up-and-screen-depression' };
    if (support === 'absent') return { plan: 'connect-with-bereavement-services' };
    return { plan: 'support-and-monitor' };
  },
  CaregiverBurnout: function (i) {
    const hours = (i.hours || 8);
    const stress = (i.stress || 'mild');
    const respite = (i.respite || 'no');
    if (hours > 16 && stress === 'severe') return { plan: 'respite-care-and-emergency-relief' };
    if (hours > 16 && respite === 'no') return { plan: 'home-health-and-respite-arrange' };
    if (stress === 'severe') return { plan: 'support-group-and-counseling' };
    if (hours > 8) return { plan: 'respite-discussion' };
    return { plan: 'support-and-monitor' };
  },
};
module.exports = Engine;
