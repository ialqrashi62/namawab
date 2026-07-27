// P3-BX ortho_ext2_engine.js — 10 pure functions
const Engine = {
  Fracture: function (i) {
    const type = (i.type || 'simple');
    const open = (i.open || 'no');
    if (open === 'yes') return { plan: 'OR-and-I&D' };
    if (type === 'displaced') return { plan: 'ORIF-and-eval' };
    if (type === 'comminuted') return { plan: 'ORIF-and-typed' };
    return { plan: 'cast-and-FU' };
  },
  Joint: function (i) {
    const joint = (i.joint || 'knee');
    const severity = (i.severity || 'mild');
    if (severity === 'severe' && joint === 'hip') return { plan: 'THA-and-eval' };
    if (severity === 'severe' && joint === 'knee') return { plan: 'TKA-and-eval' };
    if (severity === 'moderate') return { plan: 'injection-and-eval' };
    return { plan: 'PT-and-eval' };
  },
  Spine: function (i) {
    const finding = (i.finding || 'unknown');
    if (finding === 'cord-compression') return { plan: 'surgery-and-steroid' };
    if (finding === 'stenosis') return { plan: 'injection-and-eval' };
    if (finding === 'disc-herniation') return { plan: 'PT-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Sports: function (i) {
    const injury = (i.injury || 'unknown');
    if (injury === 'ACL') return { plan: 'MRI-and-eval' };
    if (injury === 'meniscus') return { plan: 'MRI-and-eval' };
    if (injury === 'rotator-cuff') return { plan: 'MRI-and-eval' };
    if (injury === 'sprain') return { plan: 'RICE-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  Trauma: function (i) {
    const injury = (i.injury || 'unknown');
    if (injury === 'pelvic-ring') return { plan: 'binder-and-IR' };
    if (injury === 'acetabular') return { plan: 'OR-and-eval' };
    if (injury === 'femoral-shaft') return { plan: 'IM-nail' };
    if (injury === 'tibial-plateau') return { plan: 'ORIF-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  Tumor: function (i) {
    const type = (i.type || 'unknown');
    if (type === 'osteosarcoma') return { plan: 'chemo-and-resection' };
    if (type === 'GCT') return { plan: 'curettage-and-eval' };
    if (type === 'metastasis') return { plan: 'workup-and-typed' };
    return { plan: 'workup-and-eval' };
  },
  Hand: function (i) {
    const issue = (i.issue || 'unknown');
    if (issue === 'carpal-tunnel') return { plan: 'splint-and-eval' };
    if (issue === 'trigger-finger') return { plan: 'injection-and-eval' };
    if (issue === 'dupuytren') return { plan: 'collagenase-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  Foot: function (i) {
    const issue = (i.issue || 'unknown');
    if (issue === 'plantar-fasciitis') return { plan: 'PT-and-orthotic' };
    if (issue === 'achilles') return { plan: 'immobilize-and-MRI' };
    if (issue === 'bunion') return { plan: 'bunionectomy-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  Pediatric: function (i) {
    const issue = (i.issue || 'unknown');
    if (issue === 'DDH') return { plan: 'Pavlik-and-eval' };
    if (issue === 'clubfoot') return { plan: 'Ponseti-and-eval' };
    if (issue === 'scoliosis') return { plan: 'bracing-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  Recon: function (i) {
    const type = (i.type || 'primary');
    if (type === 'revision') return { plan: 'workup-and-revision' };
    if (type === 'primary') return { plan: 'primary-and-eval' };
    return { plan: 'eval-and-typed' };
  },
};
module.exports = Engine;
