// P3-BP uro_ext_engine.js — 10 pure functions
const Engine = {
  BPH: function (i) {
    const ipss = (i.ipss || 5);
    const psa = (i.psa || 1);
    const prostate = (i.prostate || 30);
    if (ipss >= 20 && prostate >= 40) return { plan: '5ARI-and-alpha-blocker-and-urology' };
    if (ipss >= 8) return { plan: 'alpha-blocker-or-5ARI' };
    if (ipss < 8) return { plan: 'watchful-waiting' };
    return { plan: 'monitor-and-eval' };
  },
  ProstateCancer: function (i) {
    const psa = (i.psa || 4);
    const gleason = (i.gleason || 6);
    const stage = (i.stage || 'localized');
    if (gleason >= 8 && stage === 'metastatic') return { plan: 'ADT-and-chemo' };
    if (gleason >= 8) return { plan: 'radical-prostatectomy-or-RT' };
    if (gleason === 7 && stage === 'localized') return { plan: 'active-surveillance-or-RP' };
    if (psa > 10 && gleason === 6) return { plan: 'RP-or-RT' };
    if (psa < 10 && gleason === 6) return { plan: 'active-surveillance' };
    return { plan: 'multidisciplinary-eval' };
  },
  KidneyStone: function (i) {
    const size = (i.size || 5);
    const location = (i.location || 'ureter');
    const symptom = (i.symptom || 'mild');
    if (size >= 10) return { plan: 'PCNL-or-ureteroscopy' };
    if (size >= 5 && location === 'ureter') return { plan: 'ureteroscopy-and-lithotripsy' };
    if (size >= 5) return { plan: 'ESWL' };
    if (symptom === 'severe') return { plan: 'urgent-stone-removal' };
    return { plan: 'hydration-and-medical-expulsive' };
  },
  UTI: function (i) {
    const type = (i.type || 'uncomplicated');
    const organism = (i.organism || 'unknown');
    const resistance = (i.resistance || 'no');
    if (type === 'pyelonephritis' && resistance === 'yes') return { plan: 'IV-ceftriaxone-and-sensitivity' };
    if (type === 'pyelonephritis') return { plan: 'oral-cipro-or-cefpodoxime' };
    if (organism === 'ESBL' && resistance === 'yes') return { plan: 'ertapenem-or-meropenem' };
    if (organism === 'ESBL') return { plan: 'fosfomycin-or-nitrofurantoin' };
    if (type === 'recurrent') return { plan: 'prophylaxis-and-cranberry' };
    if (type === 'uncomplicated') return { plan: 'nitrofurantoin-or-cipro' };
    return { plan: 'culture-and-treat' };
  },
  Hematuria: function (i) {
    const type = (i.type || 'microscopic');
    const risk = (i.risk || 'low');
    const age = (i.age || 50);
    if (type === 'gross' && risk === 'high') return { plan: 'urgent-Cysto-and-CT-urogram' };
    if (type === 'gross') return { plan: 'cystoscopy-and-CT' };
    if (age >= 35 && risk === 'high') return { plan: 'cystoscopy-and-CT' };
    if (risk === 'high') return { plan: 'repeat-UA-and-eval' };
    if (risk === 'low' && age < 35) return { plan: 'repeat-UA-and-monitor' };
    return { plan: 'eval-and-decide' };
  },
  ED: function (i) {
    const cause = (i.cause || 'unknown');
    const severity = (i.severity || 'mild');
    const cv = (i.cv || 'low');
    if (cause === 'cardiovascular' && cv === 'high') return { plan: 'cardiology-eval-first' };
    if (severity === 'severe' && cause === 'organic') return { plan: 'PDE5-and-eval' };
    if (cause === 'psychogenic') return { plan: 'PDE5-and-therapy' };
    if (severity === 'mild') return { plan: 'lifestyle-and-monitor' };
    return { plan: 'PDE5-and-eval' };
  },
  Incontinence: function (i) {
    const type = (i.type || 'stress');
    const severity = (i.severity || 'mild');
    if (type === 'urge' && severity === 'severe') return { plan: 'anticholinergic-and-PFT' };
    if (type === 'urge') return { plan: 'bladder-training-and-anticholinergic' };
    if (type === 'overflow') return { plan: 'catheter-and-eval' };
    if (type === 'mixed') return { plan: 'PFT-and-behavioral' };
    if (type === 'stress' && severity === 'severe') return { plan: 'sling-eval' };
    if (type === 'stress') return { plan: 'PFT-and-pessary' };
    return { plan: 'eval-and-typed' };
  },
  Testicular: function (i) {
    const finding = (i.finding || 'unknown');
    const age = (i.age || 30);
    if (finding === 'mass' && age < 50) return { plan: 'urgent-urology-and-ultrasound' };
    if (finding === 'mass' && age >= 50) return { plan: 'urology-and-eval' };
    if (finding === 'varicocele') return { plan: 'monitor-and-eval' };
    if (finding === 'hydrocele') return { plan: 'monitor-and-eval' };
    if (finding === 'epididymitis') return { plan: 'abx-and-support' };
    return { plan: 'eval-and-decide' };
  },
  Penile: function (i) {
    const condition = (i.condition || 'unknown');
    if (condition === 'Peyronie') return { plan: 'observation-and-vitamin-E' };
    if (condition === 'phimosis' && i.severe === 'yes') return { plan: 'circumcision' };
    if (condition === 'phimosis') return { plan: 'topical-steroid-and-stretch' };
    if (condition === 'priapism') return { plan: 'aspiration-and-phenylephrine' };
    if (condition === 'Peyronie-severe') return { plan: 'surgical-eval' };
    return { plan: 'eval-and-treat' };
  },
  BladderCancer: function (i) {
    const stage = (i.stage || 'Ta-low');
    const grade = (i.grade || 'low');
    if (stage === 'CIS') return { plan: 'BCG-and-FU' };
    if (stage === 'T1-high-grade') return { plan: 're-TURBT-and-BCG' };
    if (stage === 'T2-high-grade' || stage === 'muscle-invasive') return { plan: 'radical-cystectomy-or-neoadjuvant' };
    if (stage === 'Ta-low') return { plan: 'TURBT-and-surveillance' };
    if (grade === 'high' && stage === 'Ta') return { plan: 'BCG-and-FU' };
    return { plan: 'TURBT-and-decide' };
  },
};
module.exports = Engine;
