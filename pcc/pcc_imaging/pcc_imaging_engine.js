// P3-CD pcc_imaging_engine.js — 10 pure functions
const Engine = {
  Modality: function (i) {
    const type = (i.type || 'CT');
    if (type === 'CT') return { plan: 'CT-scan' };
    if (type === 'MRI') return { plan: 'MRI-scan' };
    if (type === 'US') return { plan: 'ultrasound' };
    if (type === 'Xray') return { plan: 'xray' };
    return { plan: 'modality-typed' };
  },
  Indication: function (i) {
    const ind = (i.ind || 'r/o-fracture');
    if (ind === 'PE') return { plan: 'CTPA' };
    if (ind === 'stroke') return { plan: 'CT-head-CTA' };
    if (ind === 'trauma') return { plan: 'pan-scan' };
    if (ind === 'mass') return { plan: 'MRI-with-contrast' };
    return { plan: 'standard-imaging' };
  },
  Contrast: function (i) {
    const type = (i.type || 'none');
    if (type === 'iodinated' && i.gfr && i.gfr < 30) return { plan: 'avoid-contrast' };
    if (type === 'gadolinium' && i.gfr && i.gfr < 30) return { plan: 'avoid-contrast' };
    if (type === 'iodinated') return { plan: 'iodinated-contrast' };
    if (type === 'gadolinium') return { plan: 'gadolinium-contrast' };
    return { plan: 'no-contrast' };
  },
  Dose: function (i) {
    const ctdi = (i.ctdi || 5);
    if (ctdi > 20) return { plan: 'high-dose' };
    if (ctdi > 10) return { plan: 'moderate-dose' };
    if (ctdi > 5) return { plan: 'low-dose' };
    return { plan: 'ultra-low-dose' };
  },
  Protocol: function (i) {
    const body = (i.body || 'head');
    if (body === 'head') return { plan: 'head-protocol' };
    if (body === 'chest') return { plan: 'chest-protocol' };
    if (body === 'abdomen') return { plan: 'abdomen-protocol' };
    if (body === 'pelvis') return { plan: 'pelvis-protocol' };
    return { plan: 'generic-protocol' };
  },
  Urgency: function (i) {
    const level = (i.level || 'routine');
    if (level === 'stat') return { plan: 'stat-protocol' };
    if (level === 'urgent') return { plan: 'urgent-protocol' };
    return { plan: 'routine-protocol' };
  },
  Quality: function (i) {
    const score = (i.score || 80);
    if (score >= 90) return { plan: 'excellent-quality' };
    if (score >= 70) return { plan: 'acceptable-quality' };
    if (score >= 50) return { plan: 'repeat-needed' };
    return { plan: 'uninterpretable' };
  },
  Comparison: function (i) {
    const prior = (i.prior || 'no');
    if (prior === 'yes') return { plan: 'compare-prior' };
    return { plan: 'no-comparison' };
  },
  FollowUp: function (i) {
    const finding = (i.finding || 'normal');
    if (finding === 'worrisome') return { plan: 'short-FU' };
    if (finding === 'stable') return { plan: 'standard-FU' };
    if (finding === 'normal') return { plan: 'no-FU' };
    return { plan: 'FU-typed' };
  },
  Report: function (i) {
    const level = (i.level || 'standard');
    if (level === 'critical') return { plan: 'critical-findings' };
    if (level === 'urgent') return { plan: 'urgent-findings' };
    return { plan: 'standard-report' };
  },
};
module.exports = Engine;
