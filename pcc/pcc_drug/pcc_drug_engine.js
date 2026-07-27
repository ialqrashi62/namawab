// P3-CC pcc_drug_engine.js — 10 pure functions
const Engine = {
  Dose: function (i) {
    const wt = (i.wt || 70);
    const dose = (i.dose || 500);
    if (wt < 50 && dose > 500) return { plan: 'reduce-dose' };
    if (wt > 100 && dose < 500) return { plan: 'increase-dose' };
    return { plan: 'standard-dose' };
  },
  Interaction: function (i) {
    const sev = (i.sev || 'none');
    if (sev === 'major') return { plan: 'avoid-combo' };
    if (sev === 'moderate') return { plan: 'monitor-closely' };
    if (sev === 'minor') return { plan: 'monitor' };
    return { plan: 'no-interaction' };
  },
  Allergy: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'contraindicated' };
    if (severity === 'moderate') return { plan: 'use-alternative' };
    return { plan: 'monitor-and-use' };
  },
  Renal: function (i) {
    const gfr = (i.gfr || 60);
    if (gfr < 30) return { plan: 'reduce-dose-or-avoid' };
    if (gfr < 60) return { plan: 'adjust-dose' };
    return { plan: 'standard-dose' };
  },
  Hepatic: function (i) {
    const child = (i.child || 'A');
    if (child === 'C') return { plan: 'avoid-or-adjust' };
    if (child === 'B') return { plan: 'adjust-dose' };
    return { plan: 'standard-dose' };
  },
  Level: function (i) {
    const peak = (i.peak || 10);
    if (peak > 20) return { plan: 'toxic-level' };
    if (peak > 10) return { plan: 'therapeutic-high' };
    if (peak > 5) return { plan: 'therapeutic' };
    return { plan: 'sub-therapeutic' };
  },
  Pregnancy: function (i) {
    const cat = (i.cat || 'B');
    if (cat === 'X') return { plan: 'contraindicated' };
    if (cat === 'D') return { plan: 'avoid-or-benefit' };
    if (cat === 'C') return { plan: 'caution' };
    return { plan: 'safe-or-limited-data' };
  },
  Route: function (i) {
    const route = (i.route || 'PO');
    if (route === 'IV') return { plan: 'iv-administration' };
    if (route === 'IM') return { plan: 'im-administration' };
    if (route === 'SC') return { plan: 'sc-administration' };
    return { plan: 'po-administration' };
  },
  Frequency: function (i) {
    const freq = (i.freq || 'q6h');
    if (freq === 'q4h') return { plan: 'q4h' };
    if (freq === 'q6h') return { plan: 'q6h' };
    if (freq === 'q8h') return { plan: 'q8h' };
    return { plan: 'q12h-or-bid' };
  },
  Duration: function (i) {
    const days = (i.days || 7);
    if (days > 30) return { plan: 'long-course' };
    if (days > 7) return { plan: 'standard-course' };
    if (days > 1) return { plan: 'short-course' };
    return { plan: 'single-dose' };
  },
};
module.exports = Engine;
