// P3-BZ neph_ext3_engine.js — 10 pure functions
const Engine = {
  CKD: function (i) {
    const gfr = (i.gfr || 50);
    const protein = (i.protein || 'low');
    if (gfr < 15) return { plan: 'dialysis-eval-and-prep' };
    if (gfr < 30 && protein === 'high') return { plan: 'nephrology-and-ACE' };
    if (gfr < 60 && protein === 'high') return { plan: 'nephrology-and-typed' };
    if (gfr < 60) return { plan: 'monitor-and-ACE' };
    return { plan: 'monitor-annually' };
  },
  AKI: function (i) {
    const stage = (i.stage || 'I');
    const cause = (i.cause || 'pre-renal');
    if (stage === 'III' && cause === 'obstructive') return { plan: 'urgent-decompression' };
    if (stage === 'III') return { plan: 'RRT-eval-and-support' };
    if (stage === 'II') return { plan: 'find-cause-and-support' };
    return { plan: 'optimize-and-monitor' };
  },
  GN: function (i) {
    const type = (i.type || 'unknown');
    if (type === 'RPGN') return { plan: 'urgent-biopsy-and-pulse' };
    if (type === 'minimal-change') return { plan: 'steroid-trial' };
    if (type === 'membranous') return { plan: 'biopsy-and-typed' };
    if (type === 'IgA') return { plan: 'biopsy-and-eval' };
    return { plan: 'biopsy-and-typed' };
  },
  Dialysis: function (i) {
    const gfr = (i.gfr || 10);
    const symptom = (i.symptom || 'no');
    if (gfr < 6) return { plan: 'dialysis-initiate' };
    if (gfr < 10 && symptom === 'severe') return { plan: 'dialysis-and-AV' };
    if (gfr < 10) return { plan: 'dialysis-eval-and-AV' };
    return { plan: 'monitor-and-decide' };
  },
  Rhabdo: function (i) {
    const ck = (i.ck || 500);
    if (ck > 5000) return { plan: 'aggressive-fluid-and-RRT-eval' };
    if (ck > 1000) return { plan: 'aggressive-fluid-and-monitor' };
    return { plan: 'fluid-and-eval' };
  },
  Electrolyte: function (i) {
    const k = (i.k || 4);
    const na = (i.na || 140);
    if (k > 6.5) return { plan: 'emergent-insulin-and-calcium' };
    if (k > 5.5) return { plan: 'kayexalate-and-eval' };
    if (na < 120) return { plan: 'hypertonic-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
  HTN: function (i) {
    const bp = (i.bp || 200);
    const organ = (i.organ || 'none');
    if (organ === 'encephalopathy' || organ === 'MI') return { plan: 'IV-nicardipine-and-ICU' };
    if (bp >= 180) return { plan: 'oral-and-eval' };
    return { plan: 'monitor-and-decide' };
  },
  Stone: function (i) {
    const size = (i.size || 4);
    if (size >= 10) return { plan: 'ureteroscopy-and-eval' };
    if (size >= 5) return { plan: 'ESWL-and-eval' };
    return { plan: 'hydration-and-strain' };
  },
  Txp: function (i) {
    const months = (i.months || 6);
    const gfr = (i.gfr || 60);
    if (gfr < 30) return { plan: 'biopsy-and-eval' };
    if (months < 12) return { plan: 'maintenance-and-monthly' };
    return { plan: 'maintenance-and-every-3mo' };
  },
  PKD: function (i) {
    const cyst = (i.cyst || 'stable');
    if (cyst === 'complex') return { plan: 'imaging-and-eval' };
    return { plan: 'monitor-and-FU' };
  },
};
module.exports = Engine;
