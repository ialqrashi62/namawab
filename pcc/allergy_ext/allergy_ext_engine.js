// P3-BO allergy_ext_engine.js — 10 pure functions
const Engine = {
  Anaphylaxis: function (i) {
    const trigger = (i.trigger || 'unknown');
    const severity = (i.severity || 'mild');
    if (severity === 'severe' && (trigger === 'food' || trigger === 'drug' || trigger === 'bee')) return { plan: 'epinephrine-and-observation-6h' };
    if (severity === 'severe') return { plan: 'epinephrine-and-airway' };
    if (severity === 'moderate') return { plan: 'antihistamine-and-steroid' };
    if (severity === 'mild') return { plan: 'antihistamine-and-monitor' };
    return { plan: 'evaluate-and-treat' };
  },
  FoodAllergy: function (i) {
    const food = (i.food || 'unknown');
    const reaction = (i.reaction || 'mild');
    if (reaction === 'anaphylaxis') return { plan: 'strict-avoidance-and-auto-injector' };
    if (reaction === 'severe' && food === 'peanut') return { plan: 'OIT-and-auto-injector' };
    if (reaction === 'severe') return { plan: 'avoidance-and-auto-injector' };
    if (reaction === 'moderate' && food === 'milk') return { plan: 'baked-milk-and-reassess' };
    if (reaction === 'moderate') return { plan: 'avoidance-and-reassess' };
    return { plan: 'monitor-and-eval' };
  },
  DrugAllergy: function (i) {
    const drug = (i.drug || 'unknown');
    const reaction = (i.reaction || 'unknown');
    const severity = (i.severity || 'mild');
    if (severity === 'severe' && reaction === 'SJS') return { plan: 'strict-avoidance-and-derm' };
    if (severity === 'severe' && reaction === 'DRESS') return { plan: 'stop-drug-and-steroid' };
    if (severity === 'severe') return { plan: 'desensitization-or-avoid' };
    if (drug === 'penicillin' && reaction === 'rash') return { plan: 'graded-challenge' };
    if (severity === 'mild') return { plan: 'rechallenge-with-monitoring' };
    return { plan: 'evaluate-and-decide' };
  },
  Urticaria: function (i) {
    const acute = (i.acute || 'yes');
    const chronic = (i.chronic || 'no');
    if (chronic === 'yes') return { plan: 'H1-and-H2-and-eval-cause' };
    if (acute === 'yes' && i.angioedema === 'yes') return { plan: 'antihistamine-and-steroid' };
    if (acute === 'yes') return { plan: 'second-gen-antihistamine' };
    return { plan: 'trigger-avoidance' };
  },
  Angioedema: function (i) {
    const cause = (i.cause || 'unknown');
    const airway = (i.airway || 'patent');
    if (airway === 'compromised') return { plan: 'intubation-and-icatibant' };
    if (cause === 'ACE-inhibitor') return { plan: 'stop-ACE-and-icatibant' };
    if (cause === 'hereditary') return { plan: 'icatibant-or-C1-INH' };
    if (cause === 'allergic') return { plan: 'antihistamine-and-steroid' };
    return { plan: 'evaluate-and-treat' };
  },
  AllergicRhinitis: function (i) {
    const severity = (i.severity || 'mild');
    const allergen = (i.allergen || 'unknown');
    if (severity === 'severe') return { plan: 'INCS-and-antihistamine-and-IT' };
    if (severity === 'moderate' && allergen === 'seasonal') return { plan: 'INCS-and-oral-antihistamine' };
    if (severity === 'mild') return { plan: 'INCS-or-antihistamine' };
    if (severity === 'moderate') return { plan: 'INCS-and-step-up' };
    return { plan: 'monitor-and-avoid' };
  },
  Asthma: function (i) {
    const control = (i.control || 'well');
    const severity = (i.severity || 'intermittent');
    if (control === 'poor' && severity === 'severe') return { plan: 'step-5-and-biologic-eval' };
    if (control === 'poor') return { plan: 'step-up-and-trigger-control' };
    if (control === 'partial' && severity === 'moderate') return { plan: 'step-up-to-LABA-ICS' };
    if (control === 'partial') return { plan: 'step-up-and-eval' };
    if (control === 'well' && severity === 'mild') return { plan: 'step-down-eval' };
    return { plan: 'continue-and-monitor' };
  },
  Atopic: function (i) {
    const severity = (i.severity || 'mild');
    const trigger = (i.trigger || 'unknown');
    if (severity === 'severe') return { plan: 'systemic-eval-and-biologic' };
    if (severity === 'moderate') return { plan: 'mid-potency-steroid-and-TCI' };
    if (severity === 'mild') return { plan: 'low-potency-steroid-and-emollient' };
    if (trigger === 'food') return { plan: 'food-allergy-eval' };
    return { plan: 'moisturize-and-monitor' };
  },
  Venom: function (i) {
    const reaction = (i.reaction || 'mild');
    const sting = (i.sting || 'unknown');
    if (reaction === 'severe' && sting === 'bee') return { plan: 'VIT-and-auto-injector' };
    if (reaction === 'severe') return { plan: 'VIT-and-auto-injector' };
    if (reaction === 'moderate' && sting === 'bee') return { plan: 'VIT-and-monitor' };
    if (reaction === 'moderate') return { plan: 'VIT-and-eval' };
    if (reaction === 'large-local') return { plan: 'antihistamine-and-ice' };
    return { plan: 'monitor-and-eval' };
  },
  PrimaryImmuno: function (i) {
    const ig = (i.ig || 'normal');
    const infections = (i.infections || 'occasional');
    if (ig === 'low' && infections === 'recurrent') return { plan: 'IVIG-and-eval' };
    if (ig === 'low') return { plan: 'monitor-and-vaccinate' };
    if (infections === 'recurrent' && i.lymphopenia === 'yes') return { plan: 'PID-eval' };
    if (infections === 'recurrent') return { plan: 'PID-workup' };
    return { plan: 'no-action' };
  },
};
module.exports = Engine;
