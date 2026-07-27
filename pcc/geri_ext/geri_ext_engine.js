// P3-BS geri_ext_engine.js — 10 pure functions
const Engine = {
  Frailty: function (i) {
    const score = (i.score || 3);
    const falls = (i.falls || 'no');
    if (score >= 6) return { plan: 'CGA-and-multidisciplinary' };
    if (score >= 4 || falls === 'yes') return { plan: 'PT-and-prehab' };
    if (score >= 2) return { plan: 'monitor-and-exercise' };
    return { plan: 'monitor-annually' };
  },
  Polypharm: function (i) {
    const count = (i.count || 5);
    const beers = (i.beers || 'no');
    if (count >= 10) return { plan: 'deprescribe-and-review' };
    if (beers === 'yes') return { plan: 'deprescribe-Beers' };
    if (count >= 5) return { plan: 'review-and-simplify' };
    return { plan: 'monitor-annually' };
  },
  Delirium: function (i) {
    const cam = (i.cam || 'negative');
    const cause = (i.cause || 'unknown');
    if (cam === 'positive') return { plan: 'find-cause-and-nonpharm' };
    if (cause === 'infection') return { plan: 'infection-workup-and-treat' };
    if (cause === 'metabolic') return { plan: 'metabolic-workup-and-correct' };
    return { plan: 'workup-and-supportive' };
  },
  Falls: function (i) {
    const recurrent = (i.recurrent || 'no');
    const cause = (i.cause || 'unknown');
    if (recurrent === 'yes') return { plan: 'multifactorial-and-PT' };
    if (cause === 'orthostatic') return { plan: 'fluids-and-ortho-eval' };
    if (cause === 'med') return { plan: 'review-and-taper' };
    if (cause === 'vision') return { plan: 'vision-eval-and-correct' };
    return { plan: 'workup-and-prevent' };
  },
  Dementia: function (i) {
    const stage = (i.stage || 'mild');
    const caregiver = (i.caregiver || 'yes');
    if (stage === 'severe' && caregiver === 'no') return { plan: 'placement-and-support' };
    if (stage === 'moderate') return { plan: 'caregiver-support-and-safety' };
    if (stage === 'mild') return { plan: 'monitor-and-stimulate' };
    return { plan: 'screen-annually' };
  },
  Nutrition: function (i) {
    const mna = (i.mna || 12);
    const weight = (i.weight || 'stable');
    if (mna < 7) return { plan: 'supplements-and-eval' };
    if (weight === 'losing') return { plan: 'calories-and-eval-cause' };
    if (mna < 11) return { plan: 'supplements-and-monitor' };
    return { plan: 'monitor-annually' };
  },
  PressureUlcer: function (i) {
    const stage = (i.stage || 'I');
    const braden = (i.braden || 18);
    if (stage === 'IV' || stage === 'III') return { plan: 'debridement-and-flap' };
    if (braden < 13) return { plan: 'aggressive-prevention' };
    if (stage === 'II') return { plan: 'dressing-and-offload' };
    if (stage === 'I') return { plan: 'reposition-and-monitor' };
    return { plan: 'stage-and-treat' };
  },
  Depression: function (i) {
    const phq = (i.phq || 5);
    const suicidal = (i.suicidal || 'no');
    if (suicidal === 'yes') return { plan: 'urgent-psych-and-safety' };
    if (phq >= 10) return { plan: 'SSRI-and-CBT' };
    if (phq >= 5) return { plan: 'monitor-and-CBT' };
    return { plan: 'screen-annually' };
  },
  Advance: function (i) {
    const status = (i.status || 'none');
    const proxy = (i.proxy || 'no');
    if (status === 'none') return { plan: 'goals-of-care-discussion' };
    if (proxy === 'no') return { plan: 'designate-and-document' };
    if (status === 'DNR') return { plan: 'document-and-respect' };
    if (status === 'full') return { plan: 'document-and-respect' };
    return { plan: 'goals-and-document' };
  },
  Sarcopenia: function (i) {
    const speed = (i.speed || 1);
    const grip = (i.grip || 25);
    if (speed < 0.8) return { plan: 'PT-and-protein' };
    if (grip < 20) return { plan: 'PT-and-nutrition' };
    if (speed < 1) return { plan: 'exercise-and-monitor' };
    return { plan: 'monitor-annually' };
  },
};
module.exports = Engine;
