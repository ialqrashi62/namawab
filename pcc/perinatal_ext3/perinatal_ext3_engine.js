// P3-BU perinatal_ext3_engine.js — 10 pure functions
const Engine = {
  Anomaly: function (i) {
    const finding = (i.finding || 'unknown');
    if (finding === 'cardiac') return { plan: 'echo-and-peds-card' };
    if (finding === 'neural') return { plan: 'fetal-MRI-and-NSGY' };
    if (finding === 'renal') return { plan: 'peds-neph-and-eval' };
    if (finding === 'skeletal') return { plan: 'genetic-and-eval' };
    return { plan: 'MFM-and-typed' };
  },
  Triploidy: function (i) {
    const screen = (i.screen || 'low-risk');
    if (screen === 'high-risk') return { plan: 'CVS-and-genetic' };
    if (screen === 'intermediate') return { plan: 'NIPT-and-decide' };
    return { plan: 'monitor-and-FU' };
  },
  Twins: function (i) {
    const chorion = (i.chorion || 'dichorionic');
    const ttts = (i.ttts || 'no');
    if (ttts === 'yes') return { plan: 'laser-and-eval' };
    if (chorion === 'monochorionic') return { plan: 'serial-US-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Previa: function (i) {
    const distance = (i.distance || 1);
    if (distance < 2) return { plan: 'C-section-and-typed' };
    if (distance < 3) return { plan: 'repeat-US-and-decide' };
    return { plan: 'monitor-and-eval' };
  },
  Accreta: function (i) {
    const risk = (i.risk || 'low');
    if (risk === 'high') return { plan: 'multidisciplinary-and-OR' };
    if (risk === 'intermediate') return { plan: 'MRI-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Preterm: function (i) {
    const gest = (i.gest || 32);
    if (gest < 24) return { plan: 'counsel-and-steroids' };
    if (gest < 34) return { plan: 'steroids-and-mag' };
    if (gest < 37) return { plan: 'monitor-and-decide' };
    return { plan: 'monitor-and-typed' };
  },
  ROM: function (i) {
    const hours = (i.hours || 5);
    const gest = (i.gest || 35);
    if (hours >= 24) return { plan: 'ABx-and-delivery' };
    if (gest < 34) return { plan: 'ABx-and-latency' };
    if (gest < 37) return { plan: 'expectant-and-eval' };
    if (gest >= 37) return { plan: 'induction' };
    return { plan: 'monitor-and-typed' };
  },
  Induction: function (i) {
    const reason = (i.reason || 'elective');
    if (reason === 'urgent') return { plan: 'cervidil-and-AROM' };
    if (reason === 'postdates') return { plan: 'cervical-ripening' };
    return { plan: 'cervical-ripening' };
  },
  Postdates: function (i) {
    const weeks = (i.weeks || 41);
    if (weeks >= 42) return { plan: 'induction-and-AROM' };
    if (weeks >= 41) return { plan: 'BPP-and-decide' };
    return { plan: 'monitor-and-FU' };
  },
  Postpartum: function (i) {
    const day = (i.day || 1);
    const issue = (i.issue || 'none');
    if (issue === 'hemorrhage' && day === 1) return { plan: 'massive-transfusion' };
    if (issue === 'depression' && day > 7) return { plan: 'EPDS-and-CBT' };
    if (day <= 3) return { plan: 'monitor-and-discharge' };
    return { plan: 'monitor-and-FU' };
  },
};
module.exports = Engine;
