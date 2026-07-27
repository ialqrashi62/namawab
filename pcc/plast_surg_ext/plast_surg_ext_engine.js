// P3-BQ plast_surg_ext_engine.js — 10 pure functions
const Engine = {
  Burn: function (i) {
    const tbsa = (i.tbsa || 5);
    const degree = (i.degree || 'II');
    const inhalation = (i.inhalation || 'no');
    if (tbsa > 30 && degree === 'III' && inhalation === 'yes') return { plan: 'burn-center-and-airway' };
    if (tbsa > 30) return { plan: 'burn-center-and-fluid-resuscitation' };
    if (degree === 'III' && tbsa > 5) return { plan: 'burn-center-and-graft-eval' };
    if (inhalation === 'yes') return { plan: 'airway-and-burn-center' };
    if (tbsa > 10) return { plan: 'outpatient-and-fluid' };
    if (degree === 'I') return { plan: 'topical-and-monitor' };
    if (degree === 'II') return { plan: 'dressing-and-FU' };
    return { plan: 'outpatient-and-FU' };
  },
  Wound: function (i) {
    const type = (i.type || 'unknown');
    const chronic = (i.chronic || 'no');
    if (chronic === 'yes' && type === 'diabetic') return { plan: 'offload-and-wound-care' };
    if (chronic === 'yes') return { plan: 'NPWT-and-debridement' };
    if (type === 'surgical') return { plan: 'sterile-dressing-and-FU' };
    if (type === 'traumatic') return { plan: 'irrigation-and-closure' };
    return { plan: 'eval-and-typed-care' };
  },
  Reconstruct: function (i) {
    const defect = (i.defect || 'unknown');
    const location = (i.location || 'unknown');
    if (defect === 'large' && location === 'head-neck') return { plan: 'free-flap-and-reconstruction' };
    if (defect === 'large' && location === 'extremity') return { plan: 'free-flap-and-reconstruction' };
    if (defect === 'medium') return { plan: 'local-flap-and-skin-graft' };
    if (defect === 'small') return { plan: 'primary-closure' };
    return { plan: 'eval-and-reconstruct' };
  },
  Hand: function (i) {
    const injury = (i.injury || 'unknown');
    if (injury === 'amputation-thumb') return { plan: 'reimplant-or-reconstruct' };
    if (injury === 'amputation') return { plan: 'reimplant-eval' };
    if (injury === 'tendon-laceration') return { plan: 'tendon-repair' };
    if (injury === 'nerve-laceration') return { plan: 'nerve-repair' };
    if (injury === 'fracture') return { plan: 'ORIF-and-Hand-surgery' };
    if (injury === 'complex') return { plan: 'Hand-surgery-and-rehab' };
    return { plan: 'eval-and-typed' };
  },
  Cosmetic: function (i) {
    const procedure = (i.procedure || 'unknown');
    if (procedure === 'rhinoplasty') return { plan: 'pre-op-photo-and-consent' };
    if (procedure === 'abdominoplasty') return { plan: 'pre-op-bariatric-eval-and-BMI' };
    if (procedure === 'breast-augmentation') return { plan: 'consult-and-MRI' };
    if (procedure === 'face-lift') return { plan: 'consult-and-preop' };
    if (procedure === 'liposuction') return { plan: 'consult-and-preop' };
    return { plan: 'eval-and-consult' };
  },
  SkinCancer: function (i) {
    const type = (i.type || 'bcc');
    const size = (i.size || 1);
    const location = (i.location || 'low-risk');
    if (type === 'melanoma' && size > 1) return { plan: 'wide-excision-and-SLN' };
    if (type === 'melanoma') return { plan: 'wide-excision' };
    if (type === 'scc' && location === 'high-risk') return { plan: 'Mohs-and-reconstruction' };
    if (type === 'scc') return { plan: 'excision-and-Mohs-eval' };
    if (type === 'bcc' && location === 'high-risk') return { plan: 'Mohs' };
    if (type === 'bcc') return { plan: 'excision' };
    return { plan: 'biopsy-and-eval' };
  },
  Cleft: function (i) {
    const age = (i.age || 1);
    const type = (i.type || 'lip');
    if (type === 'lip' && age < 3) return { plan: 'lip-repair-and-feeding-team' };
    if (type === 'palate' && age < 18) return { plan: 'palate-repair-and-SLP' };
    if (age < 12) return { plan: 'alveolar-bone-graft-eval' };
    if (age >= 18) return { plan: 'rhinoplasty-eval' };
    return { plan: 'multidisciplinary-and-FU' };
  },
  Lymphedema: function (i) {
    const stage = (i.stage || 'I');
    if (stage === 'III') return { plan: 'suction-assisted-lipectomy-eval' };
    if (stage === 'II') return { plan: 'lymphovenous-bypass' };
    if (stage === 'I') return { plan: 'CDT-and-monitor' };
    return { plan: 'monitor-and-eval' };
  },
  PressureUlcer: function (i) {
    const stage = (i.stage || 'I');
    const depth = (i.depth || 'superficial');
    if (stage === 'IV' || stage === 'III') return { plan: 'debridement-and-flap-eval' };
    if (stage === 'II' && depth === 'deep') return { plan: 'debridement-and-wound-vac' };
    if (stage === 'II') return { plan: 'dressing-and-offload' };
    if (stage === 'I') return { plan: 'offload-and-prevention' };
    return { plan: 'stage-and-treat' };
  },
  TraumaRecon: function (i) {
    const injury = (i.injury || 'unknown');
    if (injury === 'complex-laceration') return { plan: 'OR-and-eval' };
    if (injury === 'fracture-open') return { plan: 'ORIF-and-plastics' };
    if (injury === 'degloving') return { plan: 'reimplant-and-flap' };
    if (injury === 'facial-fracture') return { plan: 'ORIF-and-facial-reconstruction' };
    return { plan: 'eval-and-treat' };
  },
};
module.exports = Engine;
