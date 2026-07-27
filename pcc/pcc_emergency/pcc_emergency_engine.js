// P3-CD pcc_emergency_engine.js — 10 pure functions
const Engine = {
  Triage: function (i) {
    const level = (i.level || 3);
    if (level === 1) return { plan: 'resus-bay' };
    if (level === 2) return { plan: 'acute-bay' };
    if (level === 3) return { plan: 'fast-track' };
    return { plan: 'urgent-care' };
  },
  Resus: function (i) {
    const algo = (i.algo || 'ACLS');
    if (algo === 'ACLS') return { plan: 'ACLS-protocol' };
    if (algo === 'PALS') return { plan: 'PALS-protocol' };
    if (algo === 'ATLS') return { plan: 'ATLS-protocol' };
    return { plan: 'resus-typed' };
  },
  Trauma: function (i) {
    const mech = (i.mech || 'blunt');
    if (mech === 'penetrating') return { plan: 'trauma-bay-OR' };
    if (mech === 'blunt') return { plan: 'trauma-bay-imaging' };
    return { plan: 'trauma-eval' };
  },
  Sepsis: function (i) {
    const sirs = (i.sirs || 0);
    const qsofa = (i.qsofa || 0);
    if (sirs >= 2 && qsofa >= 2) return { plan: 'sepsis-bundle' };
    if (sirs >= 2) return { plan: 'lactate-and-monitor' };
    return { plan: 'monitor-and-eval' };
  },
  Stroke: function (i) {
    const nihss = (i.nihss || 5);
    const onset = (i.onset || 4);
    if (onset <= 4.5 && nihss >= 6) return { plan: 'tPA-and-eval' };
    if (onset <= 24 && nihss >= 6) return { plan: 'thrombectomy-eval' };
    return { plan: 'monitor-and-eval' };
  },
  MI: function (i) {
    const type = (i.type || 'unknown');
    if (type === 'STEMI') return { plan: 'cath-lab-activation' };
    if (type === 'NSTEMI') return { plan: 'heparin-and-cath' };
    return { plan: 'trop-and-eval' };
  },
  Anaphylaxis: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'epinephrine-and-ICU' };
    return { plan: 'epinephrine-and-monitor' };
  },
  Toxicology: function (i) {
    const type = (i.type || 'unknown');
    if (type === 'opioid') return { plan: 'narcan-and-eval' };
    if (type === 'acetaminophen') return { plan: 'nac-and-eval' };
    if (type === 'alcohol') return { plan: 'thiamine-and-eval' };
    return { plan: 'support-and-eval' };
  },
  Burn: function (i) {
    const tbsa = (i.tbsa || 5);
    if (tbsa >= 30) return { plan: 'burn-center-and-fluid' };
    if (tbsa >= 10) return { plan: 'fluid-and-burn-team' };
    return { plan: 'topical-and-FU' };
  },
  Disposition: function (i) {
    const ac = (i.ac || 0);
    if (ac === 1) return { plan: 'admit-ICU' };
    if (ac === 2) return { plan: 'admit-floor' };
    if (ac === 3) return { plan: 'discharge' };
    return { plan: 'observation' };
  },
};
module.exports = Engine;
