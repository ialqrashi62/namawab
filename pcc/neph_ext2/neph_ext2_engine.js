// P3-BQ neph_ext2_engine.js — 10 pure functions
const Engine = {
  CKD: function (i) {
    const gfr = (i.gfr || 60);
    const albuminuria = (i.albuminuria || 'A1');
    const cause = (i.cause || 'unknown');
    if (gfr < 15) return { plan: 'dialysis-eval-and-prep' };
    if (gfr < 30 && albuminuria === 'A3') return { plan: 'nephrology-and-renal-replacement' };
    if (gfr < 60 && albuminuria === 'A3') return { plan: 'nephrology-and-ACE-and-avoid-NSAID' };
    if (gfr < 60) return { plan: 'ACE-and-monitor-every-3-6mo' };
    if (albuminuria === 'A1') return { plan: 'monitor-annually' };
    if (cause === 'DM') return { plan: 'glycemic-and-ACE-and-monitor' };
    return { plan: 'monitor-and-decide' };
  },
  AKI: function (i) {
    const stage = (i.stage || 'I');
    const cause = (i.cause || 'pre-renal');
    if (stage === 'III' && cause === 'obstructive') return { plan: 'urgent-decompression' };
    if (stage === 'III') return { plan: 'RRT-eval-and-stop-nephrotoxins' };
    if (stage === 'II' && cause === 'ATN') return { plan: 'supportive-and-monitor' };
    if (stage === 'II') return { plan: 'find-cause-and-supportive' };
    if (stage === 'I') return { plan: 'optimize-volume-and-monitor' };
    return { plan: 'monitor-and-eval' };
  },
  GN: function (i) {
    const type = (i.type || 'unknown');
    const nephrotic = (i.nephrotic || 'no');
    const cr = (i.cr || 1);
    if (type === 'RPGN' && cr > 3) return { plan: 'urgent-biopsy-and-pulse-steroid' };
    if (type === 'RPGN') return { plan: 'urgent-biopsy-and-treatment' };
    if (type === 'minimal-change' && nephrotic === 'yes') return { plan: 'steroid-trial' };
    if (type === 'membranous' && nephrotic === 'yes') return { plan: 'biopsy-and-cyclophosphamide' };
    if (type === 'IgA') return { plan: 'biopsy-and-decide' };
    return { plan: 'biopsy-and-eval' };
  },
  HTNEmerg: function (i) {
    const bp = (i.bp || 220);
    const organ = (i.organ || 'none');
    if (organ === 'encephalopathy' || organ === 'papilledema' || organ === 'MI') return { plan: 'IV-nicardipine-and-ICU' };
    if (bp >= 180 && organ === 'none') return { plan: 'oral-meds-and-FU' };
    if (bp >= 180 && organ === 'AKI') return { plan: 'oral-meds-and-monitor' };
    if (bp >= 160) return { plan: 'recheck-and-oral' };
    return { plan: 'monitor-and-decide' };
  },
  DialysisInit: function (i) {
    const gfr = (i.gfr || 10);
    const symptom = (i.symptom || 'no');
    if (gfr < 6) return { plan: 'dialysis-initiate' };
    if (gfr < 10 && symptom === 'severe') return { plan: 'dialysis-prep-and-AV-access' };
    if (gfr < 10) return { plan: 'dialysis-eval-and-AV-access' };
    if (gfr < 15 && symptom === 'yes') return { plan: 'preparation-and-monitor' };
    return { plan: 'monitor-and-decide' };
  },
  Electrolytes: function (i) {
    const k = (i.k || 4);
    const na = (i.na || 140);
    const ca = (i.ca || 9);
    if (k > 6.5) return { plan: 'emergent-insulin-and-calcium' };
    if (k > 5.5) return { plan: 'kayexalate-and-eval' };
    if (na < 120) return { plan: 'hypertonic-saline-and-eval' };
    if (na < 130) return { plan: 'fluid-restrict-and-eval' };
    if (ca > 12) return { plan: 'bisphosphonate-and-eval' };
    if (ca < 7) return { plan: 'calcium-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
  Rhabdo: function (i) {
    const ck = (i.ck || 500);
    const urine = (i.urine || 'normal');
    const k = (i.k || 4);
    if (ck > 5000) return { plan: 'aggressive-fluid-and-RRT-eval' };
    if (ck > 1000 && urine === 'tea-colored') return { plan: 'aggressive-fluid-and-monitor' };
    if (k > 6) return { plan: 'fluid-and-correct-K' };
    if (ck > 1000) return { plan: 'fluid-and-monitor' };
    return { plan: 'fluid-and-eval' };
  },
  NephroCheck: function (i) {
    const gfr = (i.gfr || 60);
    const trend = (i.trend || 'stable');
    if (gfr < 30 && trend === 'declining') return { plan: 'nephrology-urgently' };
    if (gfr < 30) return { plan: 'nephrology-referral' };
    if (gfr < 60 && trend === 'declining') return { plan: 'nephrology-and-eval-cause' };
    if (gfr < 60) return { plan: 'monitor-and-ACE' };
    return { plan: 'monitor-annually' };
  },
  PediatricNeph: function (i) {
    const condition = (i.condition || 'unknown');
    const age = (i.age || 5);
    if (condition === 'Nephrotic' && age < 12) return { plan: 'steroid-trial-and-peds-neph' };
    if (condition === 'Nephrotic') return { plan: 'biopsy-and-peds-neph' };
    if (condition === 'HUS') return { plan: 'supportive-and-dialysis-eval' };
    if (condition === 'VUR') return { plan: 'prophylaxis-and-FU' };
    if (condition === 'UTI-recurrent') return { plan: 'prophylaxis-and-imaging' };
    return { plan: 'peds-neph-and-eval' };
  },
  TransplantKidney: function (i) {
    const months = (i.months || 6);
    const gfr = (i.gfr || 60);
    const rejection = (i.rejection || 'no');
    if (months < 1) return { plan: 'induction-and-FU' };
    if (rejection === 'recent' && gfr < 30) return { plan: 'urgent-biopsy-and-treatment' };
    if (rejection === 'recent') return { plan: 'biopsy-and-step-up' };
    if (gfr < 30) return { plan: 'eval-cause-and-biopsy' };
    if (months < 12) return { plan: 'maintenance-and-monthly-FU' };
    return { plan: 'maintenance-and-every-3mo' };
  },
};
module.exports = Engine;
