// P3-BY sleep_ext2_engine.js — 10 pure functions
const Engine = {
  Insomnia: function (i) {
    const chronic = (i.chronic || 'no');
    if (chronic === 'yes') return { plan: 'CBT-I-and-eval' };
    return { plan: 'sleep-hygiene-and-eval' };
  },
  OSA: function (i) {
    const ahi = (i.ahi || 10);
    if (ahi >= 30) return { plan: 'CPAP-and-FU' };
    if (ahi >= 15) return { plan: 'CPAP-and-eval' };
    if (ahi >= 5) return { plan: 'weight-loss-and-FU' };
    return { plan: 'monitor-and-eval' };
  },
  RLS: function (i) {
    const ferritin = (i.ferritin || 50);
    if (ferritin < 75) return { plan: 'iron-and-eval' };
    return { plan: 'gabapentin-and-eval' };
  },
  Narcolepsy: function (i) {
    const cataplexy = (i.cataplexy || 'no');
    if (cataplexy === 'yes') return { plan: 'modafinil-and-eval' };
    return { plan: 'modafinil-and-eval' };
  },
  Parasomnia: function (i) {
    const type = (i.type || 'unknown');
    if (type === 'REM') return { plan: 'clonazepam-and-eval' };
    if (type === 'sleep-walking') return { plan: 'safety-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  Circadian: function (i) {
    const phase = (i.phase || 'unknown');
    if (phase === 'advanced') return { plan: 'light-and-melatonin' };
    if (phase === 'delayed') return { plan: 'light-and-melatonin' };
    return { plan: 'hygiene-and-eval' };
  },
  CPAP: function (i) {
    const adherence = (i.adherence || 4);
    if (adherence >= 4) return { plan: 'continue-and-FU' };
    if (adherence >= 2) return { plan: 'mask-fit-and-eval' };
    return { plan: 'alternative-and-eval' };
  },
  Daytime: function (i) {
    const cause = (i.cause || 'unknown');
    if (cause === 'narcolepsy') return { plan: 'modafinil-and-eval' };
    if (cause === 'OSA') return { plan: 'CPAP-and-eval' };
    if (cause === 'idiopathic') return { plan: 'stimulant-and-eval' };
    return { plan: 'workup-and-typed' };
  },
  Pediatric: function (i) {
    const issue = (i.issue || 'unknown');
    if (issue === 'night-terrors') return { plan: 'reassure-and-FU' };
    if (issue === 'apnea') return { plan: 'tonsillectomy-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  SleepStudy: function (i) {
    const type = (i.type || 'PSG');
    if (type === 'home') return { plan: 'home-test-and-eval' };
    if (type === 'PSG') return { plan: 'PSG-and-eval' };
    return { plan: 'MSLT-and-eval' };
  },
};
module.exports = Engine;
