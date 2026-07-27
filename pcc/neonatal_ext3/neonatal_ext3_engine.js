// P3-BU neonatal_ext3_engine.js — 10 pure functions
const Engine = {
  Apnea: function (i) {
    const type = (i.type || 'central');
    const preemie = (i.preemie || 'no');
    if (preemie === 'yes') return { plan: 'caffeine-and-monitor' };
    if (type === 'obstructive') return { plan: 'position-and-CPAP' };
    if (type === 'central') return { plan: 'caffeine-and-monitor' };
    return { plan: 'monitor-and-typed' };
  },
  Jaundice: function (i) {
    const bili = (i.bili || 10);
    const age = (i.age || 3);
    if (bili >= 20) return { plan: 'exchange-and-eval' };
    if (bili >= 15 && age < 3) return { plan: 'phototherapy-and-typed' };
    if (bili >= 10) return { plan: 'phototherapy-and-monitor' };
    return { plan: 'monitor-and-FU' };
  },
  SepsisScreen: function (i) {
    const sirs = (i.sirs || 0);
    if (sirs >= 2) return { plan: 'ABx-and-lactate' };
    if (sirs === 1) return { plan: 'monitor-and-typed' };
    return { plan: 'monitor-and-eval' };
  },
  NEC: function (i) {
    const stage = (i.stage || 'I');
    if (stage === 'III') return { plan: 'OR-and-resection' };
    if (stage === 'II') return { plan: 'NPO-and-ABx' };
    if (stage === 'I') return { plan: 'NPO-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  BPD: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'steroids-and-vent' };
    if (severity === 'moderate') return { plan: 'diuretics-and-eval' };
    if (severity === 'mild') return { plan: 'monitor-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  IVH: function (i) {
    const grade = (i.grade || 'I');
    if (grade === 'IV' || grade === 'III') return { plan: 'neurosurg-and-eval' };
    if (grade === 'II') return { plan: 'serial-US-and-eval' };
    if (grade === 'I') return { plan: 'monitor-and-typed' };
    return { plan: 'monitor-and-eval' };
  },
  ROP: function (i) {
    const stage = (i.stage || 'I');
    const plus = (i.plus || 'no');
    if (stage === 'III' && plus === 'yes') return { plan: 'laser-and-eval' };
    if (stage === 'III') return { plan: 'anti-VEGF-and-eval' };
    if (stage === 'II') return { plan: 'FU-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Cooling: function (i) {
    const hours = (i.hours || 3);
    if (hours <= 6) return { plan: 'cooling-and-eval' };
    if (hours <= 12) return { plan: 'rewarm-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Feed: function (i) {
    const day = (i.day || 1);
    const route = (i.route || 'OG');
    if (day < 1) return { plan: 'TPN-and-monitor' };
    if (day < 3 && route === 'OG') return { plan: 'trophic-and-eval' };
    if (day >= 3 && route === 'OG') return { plan: 'advance-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Discharge: function (i) {
    const weight = (i.weight || 2000);
    const temp = (i.temp || 36);
    if (weight < 1800) return { plan: 'monitor-and-FU' };
    if (temp < 36) return { plan: 'warmer-and-eval' };
    return { plan: 'discharge-and-FU' };
  },
};
module.exports = Engine;
