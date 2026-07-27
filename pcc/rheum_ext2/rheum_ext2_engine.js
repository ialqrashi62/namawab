// P3-BN rheum_ext2_engine.js — 10 pure functions (advanced rheumatology)
const Engine = {
  RA: function (i) {
    const das28 = (i.das28 || 3);
    const activity = (i.activity || 'moderate');
    if (activity === 'severe' && das28 >= 5.1) return { plan: 'biologic-and-MTX' };
    if (activity === 'severe') return { plan: 'csDMARD-combination' };
    if (das28 >= 3.2) return { plan: 'MTX-and-step-up' };
    if (das28 >= 2.6) return { plan: 'continue-MTX' };
    return { plan: 'continue-and-monitor' };
  },
  SLE: function (i) {
    const activity = (i.activity || 'mild');
    const organ = (i.organ || 'joints');
    if (activity === 'severe' && (organ === 'renal' || organ === 'neuro')) return { plan: 'pulse-steroid-and-cyclophosphamide' };
    if (activity === 'severe') return { plan: 'pulse-steroid-and-MMF' };
    if (activity === 'moderate' && organ === 'renal') return { plan: 'MMF-and-steroid' };
    if (activity === 'moderate') return { plan: 'hydroxychloroquine-and-steroid' };
    if (activity === 'mild') return { plan: 'hydroxychloroquine-and-NSAIDs' };
    return { plan: 'continue-and-monitor' };
  },
  PsoriaticArthritis: function (i) {
    const activity = (i.activity || 'moderate');
    const skin = (i.skin || 'mild');
    if (activity === 'severe' && skin === 'severe') return { plan: 'IL-17-or-IL-23-inhibitor' };
    if (activity === 'severe') return { plan: 'TNF-inhibitor-and-MTX' };
    if (activity === 'moderate') return { plan: 'MTX-or-leflunomide' };
    if (activity === 'mild') return { plan: 'NSAIDs-and-topical' };
    return { plan: 'continue-and-monitor' };
  },
  AnkylosingSpondyl: function (i) {
    const activity = (i.activity || 'moderate');
    const basdai = (i.basdai || 4);
    if (activity === 'severe' && basdai >= 6) return { plan: 'TNF-inhibitor-or-IL-17' };
    if (activity === 'severe') return { plan: 'TNF-inhibitor' };
    if (basdai >= 4) return { plan: 'NSAIDs-and-PT' };
    if (basdai < 4) return { plan: 'PT-and-exercise' };
    return { plan: 'continue-and-monitor' };
  },
  Gout: function (i) {
    const ua = (i.ua || 7);
    const flare = (i.flare || 'no');
    if (flare === 'yes') return { plan: 'NSAID-and-colchicine-and-steroid' };
    if (ua > 9) return { plan: 'allopurinol-and-titrate' };
    if (ua > 6 && flare === 'no') return { plan: 'allopurinol-and-monitor' };
    return { plan: 'lifestyle-and-monitor' };
  },
  Vasculitis: function (i) {
    const type = (i.type || 'unknown');
    const severity = (i.severity || 'mild');
    if (type === 'GPA' && severity === 'severe') return { plan: 'rituximab-and-cyclophosphamide' };
    if (type === 'GPA') return { plan: 'MTX-and-steroid' };
    if (type === 'MPA' && severity === 'severe') return { plan: 'cyclophosphamide-and-steroid' };
    if (type === 'MPA') return { plan: 'MMF-and-steroid' };
    if (type === 'TA') return { plan: 'steroid-and-anti-TNF' };
    if (type === 'GCA' && severity === 'severe') return { plan: 'pulse-steroid-and-toci' };
    return { plan: 'steroid-and-eval' };
  },
  Sjogren: function (i) {
    const activity = (i.activity || 'mild');
    const organ = (i.organ || 'sicca');
    if (activity === 'severe' && (organ === 'renal' || organ === 'neuro')) return { plan: 'rituximab-and-MMF' };
    if (activity === 'severe') return { plan: 'steroid-and-IS' };
    if (activity === 'moderate') return { plan: 'HCQ-and-NSAIDs' };
    if (organ === 'sicca') return { plan: 'artificial-tears-and-pilocarpine' };
    return { plan: 'continue-and-monitor' };
  },
  Scleroderma: function (i) {
    const type = (i.type || 'limited');
    const complication = (i.complication || 'none');
    if (type === 'diffuse' && complication === 'ILD') return { plan: 'mycophenolate-and-nintedanib' };
    if (type === 'diffuse' && complication === 'renal') return { plan: 'ACE-inhibitor-and-ARBs' };
    if (type === 'diffuse') return { plan: 'mycophenolate-and-monitor' };
    if (complication === 'PAH') return { plan: 'endothelin-and-PDE5' };
    if (complication === 'ILD') return { plan: 'mycophenolate-and-eval' };
    return { plan: 'continue-and-screen' };
  },
  Polymyalgia: function (i) {
    const activity = (i.activity || 'active');
    const steroid = (i.steroid || 'no');
    if (activity === 'active' && steroid === 'no') return { plan: 'prednisone-15mg-and-taper' };
    if (activity === 'active' && steroid === 'yes') return { plan: 'increase-steroid-and-taper-slow' };
    if (activity === 'relapse') return { plan: 'increase-steroid' };
    return { plan: 'taper-and-monitor' };
  },
  PediatricRheum: function (i) {
    const jia = (i.jia || 'oligo');
    const activity = (i.activity || 'mild');
    if (jia === 'systemic' && activity === 'severe') return { plan: 'anakinra-or-toci' };
    if (jia === 'poly' && activity === 'moderate') return { plan: 'MTX-and-biologic' };
    if (jia === 'poly') return { plan: 'MTX-and-NSAIDs' };
    if (jia === 'oligo') return { plan: 'NSAIDs-and-steroid-injection' };
    if (jia === 'systemic') return { plan: 'NSAIDs-and-steroid' };
    return { plan: 'continue-and-monitor' };
  },
};
module.exports = Engine;
