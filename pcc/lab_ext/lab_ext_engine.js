// P3-BI lab_ext_engine.js — 10 pure functions (advanced lab/micro)
const Engine = {
  BloodCulture: function (i) {
    const sets = (i.sets || 0);
    const timing = (i.timing || 'simultaneous');
    const source = (i.source || 'peripheral');
    if (sets < 2) return { plan: 'obtain-2-sets-and-1-from-each-side' };
    if (timing === 'simultaneous' && source === 'peripheral') return { plan: 'optimal-and-wait-5-days' };
    if (timing === 'separated' && sets === 2) return { plan: 'acceptable-and-monitor' };
    if (source === 'line') return { plan: 'peripheral-and-line-comparison' };
    return { plan: 'standard-protocol' };
  },
  ABG: function (i) {
    const ph = (i.ph || 7.4);
    const pco2 = (i.pco2 || 40);
    const hco3 = (i.hco3 || 24);
    if (ph < 7.2 && pco2 > 50) return { plan: 'respiratory-acidosis-and-vent' };
    if (ph < 7.2 && hco3 < 18) return { plan: 'metabolic-acidosis-and-bicarb' };
    if (ph < 7.35 && pco2 < 35) return { plan: 'respiratory-alkalosis-and-eval' };
    if (ph > 7.5 && hco3 > 30) return { plan: 'metabolic-alkalosis-and-eval' };
    if (ph < 7.35 && pco2 > 45) return { plan: 'respiratory-acidosis-compensated' };
    return { plan: 'normal-and-monitor' };
  },
  Troponin: function (i) {
    const value = (i.value || 0);
    const delta = (i.delta || 0);
    const baseline = (i.baseline || 0);
    if (value > 5 && delta > 1) return { plan: 'acute-MI-and-cath-eval' };
    if (value > 1 && delta > 0.5) return { plan: 'NSTEMI-and-invasive' };
    if (value > 0.04 && baseline > 0.4) return { plan: 'chronic-elevation-and-eval' };
    if (value > 0.04) return { plan: 'positive-and-repeat-and-eval' };
    if (value < 0.01) return { plan: 'negative-and-rule-out' };
    return { plan: 'borderline-and-repeat' };
  },
  BNP: function (i) {
    const value = (i.value || 100);
    const age = (i.age || 60);
    const renal = (i.renal || 'normal');
    if (value < 100) return { plan: 'low-BNP-and-HF-unlikely' };
    if (value >= 100 && value < 500) return { plan: 'intermediate-and-eval' };
    if (value >= 500) return { plan: 'high-BNP-and-HF-likely' };
    if (renal === 'impaired' && value < 500) return { plan: 'renal-and-adjust-cutoff' };
    if (age > 75 && value >= 100) return { plan: 'age-adjusted-and-eval' };
    return { plan: 'evaluate-and-decide' };
  },
  Coags: function (i) {
    const inr = (i.inr || 1);
    const ptT = (i.ptT || 12);
    const aptt = (i.aptt || 30);
    const plt = (i.plt || 200);
    if (inr > 5) return { plan: 'hold-warfarin-and-vitamin-K' };
    if (inr > 3 && inr <= 5) return { plan: 'hold-dose-and-monitor' };
    if (inr >= 2 && inr <= 3) return { plan: 'therapeutic-and-monitor' };
    if (aptt > 80) return { plan: 'hold-heparin-and-protamine' };
    if (plt < 50) return { plan: 'transfuse-platelets' };
    if (plt < 20) return { plan: 'transfuse-and-bleeding-prevention' };
    return { plan: 'normal-coags' };
  },
  LFT: function (i) {
    const ast = (i.ast || 20);
    const alt = (i.alt || 20);
    const bili = (i.bili || 0.5);
    const alp = (i.alp || 80);
    if (ast > 1000 && alt > 1000) return { plan: 'acute-hepatitis-and-eval' };
    if (ast > 300 && alt > 300) return { plan: 'hepatocellular-injury' };
    if (bili > 5) return { plan: 'hyperbilirubinemia-and-img' };
    if (alp > 300 && bili > 2) return { plan: 'cholestatic-pattern' };
    if (ast > 40 && alt > 40) return { plan: 'mild-elevation-and-monitor' };
    return { plan: 'normal-LFT' };
  },
  Renal: function (i) {
    const cr = (i.cr || 1);
    const gfr = (i.gfr || 90);
    const k = (i.k || 4);
    const trend = (i.trend || 'stable');
    if (gfr < 15) return { plan: 'dialysis-eval-and-urgent' };
    if (gfr < 30) return { plan: 'severe-CKD-and-nephrology' };
    if (gfr < 60 && trend === 'rising') return { plan: 'AKI-and-eval-cause' };
    if (k > 6) return { plan: 'hyperkalemia-and-emergency' };
    if (k > 5.5) return { plan: 'hyperkalemia-and-treatment' };
    return { plan: 'normal-renal' };
  },
  CBC: function (i) {
    const hgb = (i.hgb || 14);
    const wbc = (i.wbc || 7);
    const plt = (i.plt || 200);
    const neut = (i.neut || 5);
    if (hgb < 7) return { plan: 'transfuse-pRBC-and-eval' };
    if (hgb < 10) return { plan: 'anemia-and-eval-cause' };
    if (wbc < 2) return { plan: 'severe-leukopenia-and-GCSF' };
    if (wbc < 4) return { plan: 'mild-leukopenia-and-monitor' };
    if (plt < 20) return { plan: 'severe-thrombocytopenia-and-transfuse' };
    if (plt < 50) return { plan: 'moderate-thrombocytopenia-and-monitor' };
    if (neut < 0.5) return { plan: 'severe-neutropenia-and-isolation' };
    return { plan: 'normal-CBC' };
  },
  HbA1c: function (i) {
    const a1c = (i.a1c || 6);
    const duration = (i.duration || 0);
    if (a1c >= 10) return { plan: 'poor-control-and-intensify' };
    if (a1c >= 8) return { plan: 'uncontrolled-and-treatment-escalation' };
    if (a1c >= 7) return { plan: 'suboptimal-and-titrate' };
    if (a1c >= 6.5) return { plan: 'mild-elevation-and-diet-and-exercise' };
    if (a1c < 6.5 && duration < 5) return { plan: 'good-control-and-continue' };
    return { plan: 'excellent-and-maintain' };
  },
  MicroSensitivity: function (i) {
    const organism = (i.organism || 'unknown');
    const sensitivity = (i.sensitivity || 'unknown');
    const site = (i.site || 'unknown');
    if (organism === 'MRSA' && sensitivity === 'resistant-vanc') return { plan: 'linezolid-or-daptomycin' };
    if (organism === 'MSSA' && sensitivity === 'sensitive') return { plan: 'nafcillin-or-oxacillin' };
    if (organism === 'VRE' && sensitivity === 'resistant') return { plan: 'linezolid-or-daptomycin' };
    if (organism === 'ESBL' && site === 'urine') return { plan: 'ertapenem-or-meropenem' };
    if (organism === 'Pseudomonas') return { plan: 'pip-tazo-or-cefepime-and-sensitivity' };
    if (organism === 'C-diff') return { plan: 'oral-vancomycin-or-fidaxomicin' };
    return { plan: 'target-therapy-by-sensitivity' };
  },
};
module.exports = Engine;
