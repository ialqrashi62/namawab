// P3-BO derm_ext2_engine.js — 10 pure functions
const Engine = {
  Acne: function (i) {
    const severity = (i.severity || 'mild');
    const scar = (i.scar || 'no');
    if (severity === 'severe' && scar === 'yes') return { plan: 'isotretinoin-and-derm' };
    if (severity === 'severe') return { plan: 'isotretinoin-and-topical' };
    if (severity === 'moderate' && scar === 'yes') return { plan: 'oral-abx-and-retinoid' };
    if (severity === 'moderate') return { plan: 'oral-abx-and-BPO' };
    if (severity === 'mild') return { plan: 'topical-retinoid-and-BPO' };
    return { plan: 'monitor-and-mild-cleanser' };
  },
  Psoriasis: function (i) {
    const bsa = (i.bsa || 5);
    const joint = (i.joint || 'no');
    if (bsa > 10 || joint === 'yes') return { plan: 'biologic-and-methotrexate' };
    if (bsa > 5) return { plan: 'phototherapy-and-systemic' };
    if (bsa < 5) return { plan: 'topical-steroid-and-vitamin-D' };
    return { plan: 'monitor-and-eval' };
  },
  Eczema: function (i) {
    const severity = (i.severity || 'mild');
    const infection = (i.infection || 'no');
    if (severity === 'severe' && infection === 'yes') return { plan: 'systemic-steroid-and-abx' };
    if (severity === 'severe') return { plan: 'systemic-steroid-and-biologic' };
    if (severity === 'moderate') return { plan: 'topical-steroid-and-tacrolimus' };
    if (severity === 'mild') return { plan: 'emollient-and-low-steroid' };
    return { plan: 'emollient-and-trigger-avoid' };
  },
  SkinCancer: function (i) {
    const type = (i.type || 'bcc');
    const stage = (i.stage || 'I');
    if (type === 'melanoma' && stage === 'IV') return { plan: 'immunotherapy-or-targeted' };
    if (type === 'melanoma' && stage === 'II') return { plan: 'wide-excision-and-SLN' };
    if (type === 'melanoma' && stage === 'I') return { plan: 'wide-excision' };
    if (type === 'scc' && stage === 'high-risk') return { plan: 'excision-and-Mohs' };
    if (type === 'scc') return { plan: 'excision' };
    if (type === 'bcc') return { plan: 'excision-or-Mohs' };
    return { plan: 'biopsy-and-eval' };
  },
  DrugRash: function (i) {
    const severity = (i.severity || 'mild');
    const drug = (i.drug || 'unknown');
    if (severity === 'severe' && i.sjs === 'yes') return { plan: 'stop-drug-and-burn-unit' };
    if (severity === 'severe' && i.dress === 'yes') return { plan: 'stop-drug-and-steroid' };
    if (severity === 'severe') return { plan: 'stop-drug-and-derm' };
    if (drug === 'sulfa') return { plan: 'rechallenge-and-monitor' };
    if (severity === 'mild') return { plan: 'antihistamine-and-monitor' };
    return { plan: 'evaluate-and-decide' };
  },
  Bullous: function (i) {
    const type = (i.type || 'unknown');
    const extent = (i.extent || 'limited');
    if (type === 'pemphigus-vulgaris' && extent === 'extensive') return { plan: 'systemic-steroid-and-IVIG' };
    if (type === 'pemphigus-vulgaris') return { plan: 'systemic-steroid-and-rituximab' };
    if (type === 'bullous-pemphigoid') return { plan: 'topical-steroid-and-systemic' };
    if (type === 'linear-IgA') return { plan: 'dapsone-and-topical' };
    return { plan: 'biopsy-and-eval' };
  },
  Autoimmune: function (i) {
    const type = (i.type || 'lupus');
    const organ = (i.organ || 'skin');
    if (type === 'lupus' && organ === 'renal') return { plan: 'MMF-and-derm-rheum' };
    if (type === 'lupus' && organ === 'skin') return { plan: 'HCQ-and-topical' };
    if (type === 'dermatomyositis') return { plan: 'systemic-steroid-and-eval' };
    if (type === 'scleroderma' && organ === 'skin') return { plan: 'MTX-and-eval' };
    return { plan: 'evaluate-and-treat' };
  },
  Hair: function (i) {
    const type = (i.type || 'androgenetic');
    const rapidity = (i.rapidity || 'gradual');
    if (type === 'alopecia-areata' && rapidity === 'rapid') return { plan: 'systemic-steroid-and-JAK-inhibitor' };
    if (type === 'alopecia-areata') return { plan: 'intralesional-steroid-and-minoxidil' };
    if (type === 'telogen') return { plan: 'find-cause-and-monitor' };
    if (type === 'androgenetic' && i.female === 'yes') return { plan: 'spironolactone-and-minoxidil' };
    if (type === 'androgenetic') return { plan: 'minoxidil-and-finasteride' };
    return { plan: 'evaluate-and-treat' };
  },
  PediatricDerm: function (i) {
    const age = (i.age || 5);
    const condition = (i.condition || 'unknown');
    if (age < 2 && condition === 'atopic') return { plan: 'emollient-and-low-steroid' };
    if (age < 2 && condition === 'diaper') return { plan: 'barrier-and-air' };
    if (age < 12 && condition === 'warts') return { plan: 'salicylic-and-watchful' };
    if (age < 12 && condition === 'molluscum') return { plan: 'watchful-and-curettage' };
    if (age < 18 && condition === 'acne') return { plan: 'topical-and-BPO' };
    return { plan: 'evaluate-and-treat' };
  },
  Ulcer: function (i) {
    const type = (i.type || 'venous');
    const infection = (i.infection || 'no');
    const arterial = (i.arterial || 'no');
    if (type === 'arterial' && infection === 'no') return { plan: 'vascular-eval-and-revascularization' };
    if (type === 'venous' && infection === 'no') return { plan: 'compression-and-wound-care' };
    if (infection === 'yes') return { plan: 'wound-culture-and-systemic-abx' };
    if (type === 'diabetic') return { plan: 'offload-and-wound-care' };
    if (type === 'pressure') return { plan: 'offload-and-stage-care' };
    return { plan: 'evaluate-and-typed-care' };
  },
};
module.exports = Engine;
