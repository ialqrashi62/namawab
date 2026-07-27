// P3-BP ortho_ext_engine.js — 10 pure functions
const Engine = {
  Osteoarthritis: function (i) {
    const joint = (i.joint || 'knee');
    const severity = (i.severity || 'mild');
    if (severity === 'severe' && joint === 'knee') return { plan: 'TKA-eval-and-PT' };
    if (severity === 'severe' && joint === 'hip') return { plan: 'THA-eval-and-PT' };
    if (severity === 'severe') return { plan: 'joint-replacement-eval' };
    if (severity === 'moderate') return { plan: 'PT-and-NSAID-and-injection' };
    if (severity === 'mild') return { plan: 'exercise-and-NSAID-PRN' };
    return { plan: 'monitor-and-lifestyle' };
  },
  RA: function (i) {
    const activity = (i.activity || 'mild');
    const das28 = (i.das28 || 3);
    if (activity === 'severe' && das28 >= 5.1) return { plan: 'biologic-and-MTX' };
    if (activity === 'severe') return { plan: 'csDMARD-combination' };
    if (das28 >= 3.2) return { plan: 'MTX-and-step-up' };
    if (das28 >= 2.6) return { plan: 'continue-MTX' };
    return { plan: 'continue-and-monitor' };
  },
  Fracture: function (i) {
    const type = (i.type || 'closed');
    const displacement = (i.displacement || 'minimally');
    const joint = (i.joint || 'no');
    if (type === 'open') return { plan: 'urgent-irrigation-and-ORIF' };
    if (displacement === 'severe' && joint === 'yes') return { plan: 'ORIF-and-joint-reduction' };
    if (displacement === 'severe') return { plan: 'ORIF-and-reduction' };
    if (joint === 'yes') return { plan: 'closed-reduction-and-cast' };
    if (displacement === 'minimally') return { plan: 'cast-or-splint' };
    return { plan: 'cast-and-FU' };
  },
  Spine: function (i) {
    const level = (i.level || 'lumbar');
    const radiculopathy = (i.radiculopathy || 'no');
    const weakness = (i.weakness || 'no');
    if (weakness === 'severe' || i.caudaEquina === 'yes') return { plan: 'emergent-MRI-and-surgical' };
    if (radiculopathy === 'severe') return { plan: 'MRI-and-eval' };
    if (level === 'cervical' && radiculopathy === 'yes') return { plan: 'MRI-and-eval' };
    if (radiculopathy === 'yes') return { plan: 'PT-and-injection' };
    return { plan: 'PT-and-NSAID' };
  },
  Sports: function (i) {
    const injury = (i.injury || 'sprain');
    const chronic = (i.chronic || 'no');
    if (injury === 'torn-meniscus' && chronic === 'no') return { plan: 'arthroscopy-and-repair' };
    if (injury === 'torn-ACL' && i.active === 'yes') return { plan: 'ACL-reconstruction' };
    if (injury === 'rotator-cuff-full') return { plan: 'surgical-repair' };
    if (injury === 'achilles-rupture') return { plan: 'surgical-or-conservative' };
    if (chronic === 'yes') return { plan: 'PT-and-chronic-management' };
    if (injury === 'sprain') return { plan: 'RICE-and-PT' };
    if (injury === 'strain') return { plan: 'rest-and-PT' };
    return { plan: 'PT-and-monitor' };
  },
  Pediatric: function (i) {
    const condition = (i.condition || 'unknown');
    if (condition === 'SCFE') return { plan: 'urgent-ORIF-and-endocrine' };
    if (condition === 'DDH') return { plan: 'Pavlik-harness-or-spica' };
    if (condition === 'clubfoot') return { plan: 'Ponseti-casting' };
    if (condition === 'scoliosis-mild') return { plan: 'observe-and-brace-if-progress' };
    if (condition === 'scoliosis-severe') return { plan: 'spinal-fusion' };
    if (condition === 'Osgood') return { plan: 'rest-and-stretch' };
    return { plan: 'eval-and-treat' };
  },
  Tumor: function (i) {
    const type = (i.type || 'benign');
    const location = (i.location || 'unknown');
    if (type === 'osteosarcoma' && location === 'extremity') return { plan: 'neoadjuvant-chemo-and-resection' };
    if (type === 'osteosarcoma') return { plan: 'multidisciplinary-tumor-board' };
    if (type === 'metastasis') return { plan: 'staging-and-palliative-RT' };
    if (type === 'GCT') return { plan: 'extended-curettage-or-resection' };
    if (type === 'benign') return { plan: 'observe-and-monitor' };
    return { plan: 'biopsy-and-eval' };
  },
  Hand: function (i) {
    const condition = (i.condition || 'unknown');
    if (condition === 'trigger-finger') return { plan: 'steroid-injection-or-surgery' };
    if (condition === 'carpal-tunnel') return { plan: 'splint-and-NSAID' };
    if (condition === 'carpal-tunnel-severe') return { plan: 'surgical-release' };
    if (condition === 'Dupuytren') return { plan: 'collagenase-or-surgery' };
    if (condition === 'DeQuervain') return { plan: 'splint-and-injection' };
    if (condition === 'ganglion') return { plan: 'observe-or-aspiration' };
    return { plan: 'eval-and-treat' };
  },
  FootAnkle: function (i) {
    const condition = (i.condition || 'unknown');
    if (condition === 'Achilles-rupture') return { plan: 'functional-brace-or-surgery' };
    if (condition === 'plantar-fasciitis') return { plan: 'stretch-and-orthotic' };
    if (condition === 'Achilles-tendinopathy') return { plan: 'eccentric-loading' };
    if (condition === 'bunion') return { plan: 'wide-shoe-and-orthotic' };
    if (condition === 'bunion-severe') return { plan: 'bunionectomy-eval' };
    if (condition === 'ankle-instability') return { plan: 'PT-and-bracing' };
    return { plan: 'eval-and-treat' };
  },
  Prosthetic: function (i) {
    const type = (i.type || 'knee');
    const day = (i.day || 1);
    if (day <= 1) return { plan: 'PT-same-day-and-ambulation' };
    if (day <= 14) return { plan: 'PT-and-progress' };
    if (day <= 90) return { plan: 'outpatient-PT-and-progress' };
    if (day <= 365) return { plan: 'continue-strength-and-ROM' };
    return { plan: 'maintain-and-monitor' };
  },
};
module.exports = Engine;
