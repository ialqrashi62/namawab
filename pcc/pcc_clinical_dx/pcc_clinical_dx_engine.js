// P3-CC pcc_clinical_dx_engine.js — 10 pure functions
const Engine = {
  Differential: function (i) {
    const sys = (i.sys || 'unknown');
    if (sys === 'cardio') return { plan: 'dx-cardio' };
    if (sys === 'pulm') return { plan: 'dx-pulm' };
    if (sys === 'gi') return { plan: 'dx-gi' };
    if (sys === 'neuro') return { plan: 'dx-neuro' };
    return { plan: 'dx-typed' };
  },
  Workup: function (i) {
    const finding = (i.finding || 'unknown');
    if (finding === 'acute') return { plan: 'urgent-workup' };
    if (finding === 'chronic') return { plan: 'outpatient-workup' };
    return { plan: 'routine-workup' };
  },
  Imaging: function (i) {
    const type = (i.type || 'CT');
    if (type === 'MRI') return { plan: 'order-mri' };
    if (type === 'CT') return { plan: 'order-ct' };
    if (type === 'US') return { plan: 'order-us' };
    if (type === 'Xray') return { plan: 'order-xray' };
    return { plan: 'order-imaging-typed' };
  },
  Lab: function (i) {
    const type = (i.type || 'CBC');
    if (type === 'BMP') return { plan: 'order-bmp' };
    if (type === 'CBC') return { plan: 'order-cbc' };
    if (type === 'LFT') return { plan: 'order-lft' };
    if (type === 'CMP') return { plan: 'order-cmp' };
    return { plan: 'order-lab-typed' };
  },
  Consult: function (i) {
    const spec = (i.spec || 'general');
    if (spec === 'cardio') return { plan: 'consult-cardio' };
    if (spec === 'neuro') return { plan: 'consult-neuro' };
    if (spec === 'gi') return { plan: 'consult-gi' };
    if (spec === 'pulm') return { plan: 'consult-pulm' };
    return { plan: 'consult-typed' };
  },
  Spec: function (i) {
    const type = (i.type || 'biopsy');
    if (type === 'biopsy') return { plan: 'send-biopsy' };
    if (type === 'culture') return { plan: 'send-culture' };
    if (type === 'cytology') return { plan: 'send-cyto' };
    return { plan: 'send-typed' };
  },
  FollowUp: function (i) {
    const result = (i.result || 'pending');
    if (result === 'positive') return { plan: 'treat-and-fu' };
    if (result === 'negative') return { plan: 'routine-fu' };
    if (result === 'inconclusive') return { plan: 'reorder-and-fu' };
    return { plan: 'await-result' };
  },
  Disposition: function (i) {
    const ac = (i.ac || 0);
    if (ac === 1) return { plan: 'admit-ICU' };
    if (ac === 2) return { plan: 'admit-floor' };
    if (ac === 3) return { plan: 'discharge-with-fu' };
    return { plan: 'observation' };
  },
  Pathway: function (i) {
    const type = (i.type || 'general');
    if (type === 'sepsis') return { plan: 'sepsis-pathway' };
    if (type === 'stroke') return { plan: 'stroke-pathway' };
    if (type === 'MI') return { plan: 'MI-pathway' };
    return { plan: 'general-pathway' };
  },
  Alert: function (i) {
    const level = (i.level || 'low');
    if (level === 'critical') return { plan: 'critical-alert' };
    if (level === 'high') return { plan: 'high-alert' };
    return { plan: 'low-alert' };
  },
};
module.exports = Engine;
