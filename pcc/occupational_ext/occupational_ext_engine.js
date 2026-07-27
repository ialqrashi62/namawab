// P3-BL occupational_ext_engine.js — 10 pure functions
const Engine = {
  WorkInjury: function (i) {
    const type = (i.type || 'unknown');
    const severity = (i.severity || 'mild');
    const job = (i.job || 'desk');
    if (type === 'amputation' && job === 'manual') return { plan: 'prosthetic-and-voc-rehab' };
    if (type === 'fracture' && severity === 'severe') return { plan: 'PT-and-fitness-for-duty' };
    if (type === 'fracture' && severity === 'mild') return { plan: 'modified-duty-and-PT' };
    if (type === 'sprain' && severity === 'mild') return { plan: 'RICE-and-modified-duty' };
    if (type === 'back-injury') return { plan: 'PT-and-work-conditioning' };
    if (severity === 'mild') return { plan: 'modified-duty-and-FCE' };
    return { plan: 'evaluate-and-graded-return' };
  },
  FunctionalCapacity: function (i) {
    const demand = (i.demand || 'light');
    const current = (i.current || 'light');
    const endurance = (i.endurance || 4);
    if (demand === 'heavy' && current === 'light' && endurance < 4) return { plan: 'work-conditioning-8w' };
    if (demand === 'medium' && current === 'light') return { plan: 'work-conditioning-4w' };
    if (demand === 'heavy' && endurance < 2) return { plan: 'reconditioning-and-recheck' };
    if (endurance < 4 && demand !== 'light') return { plan: 'build-endurance' };
    return { plan: 'cleared-for-duty' };
  },
  ReturnToWork: function (i) {
    const weeks = (i.weeks || 0);
    const restrictions = (i.restrictions || 'none');
    const modified = (i.modified || 'yes');
    if (weeks >= 12) return { plan: 'vocational-rehab-eval' };
    if (restrictions === 'permanent' && modified === 'no') return { plan: 'vocational-rehab-and-job-coach' };
    if (restrictions === 'temporary' && weeks < 6) return { plan: 'modified-duty-and-PT' };
    if (modified === 'yes' && weeks < 4) return { plan: 'graded-return' };
    return { plan: 'standard-return' };
  },
  Ergonomic: function (i) {
    const task = (i.task || 'sitting');
    const complaint = (i.complaint || 'none');
    if (task === 'lifting' && complaint === 'back') return { plan: 'lift-training-and-eval-ergo' };
    if (task === 'repetitive' && complaint === 'wrist') return { plan: 'ergo-keyboard-and-stretch' };
    if (task === 'sitting' && complaint === 'neck') return { plan: 'monitor-and-stand-up-desk' };
    if (task === 'standing' && complaint === 'feet') return { plan: 'anti-fatigue-mat-and-rotation' };
    if (complaint === 'none') return { plan: 'annual-ergo-audit' };
    return { plan: 'evaluate-and-ergo-intervention' };
  },
  CumulativeTrauma: function (i) {
    const site = (i.site || 'unknown');
    const chronic = (i.chronic || 'no');
    if (site === 'elbow' && chronic === 'yes') return { plan: 'lateral-epicondylitis-and-ergo' };
    if (site === 'wrist' && chronic === 'yes') return { plan: 'CTS-eval-and-nerve-test' };
    if (site === 'shoulder' && chronic === 'yes') return { plan: 'rotator-cuff-and-ergo' };
    if (site === 'knee' && chronic === 'yes') return { plan: 'patellofemoral-and-activity' };
    if (chronic === 'no') return { plan: 'monitor-and-prevent' };
    return { plan: 'evaluate-and-treat' };
  },
  HearingLoss: function (i) {
    const exposure = (i.exposure || 80);
    const threshold = (i.threshold || 25);
    if (exposure > 100) return { plan: 'annual-audiogram-and-PPE' };
    if (threshold > 40) return { plan: 'hearing-aid-and-monitor' };
    if (exposure > 85 && threshold > 25) return { plan: 'PPE-and-recheck-6mo' };
    if (exposure > 85) return { plan: 'mandatory-PPE' };
    return { plan: 'standard-protection' };
  },
  VisionScreen: function (i) {
    const acuity = (i.acuity || 20);
    const job = (i.job || 'desk');
    if (acuity > 20 && job === 'driving') return { plan: 'corrected-lenses-and-recheck' };
    if (acuity > 20 && job === 'desk') return { plan: 'corrected-lenses' };
    if (acuity < 20 && job === 'manual') return { plan: 'glasses-and-monitor' };
    if (acuity < 20) return { plan: 'monitor-and-correct' };
    return { plan: 'standard-screen' };
  },
  RespiratorFit: function (i) {
    const fit = (i.fit || 'pass');
    const medical = (i.medical || 'cleared');
    if (fit === 'fail') return { plan: 'refit-and-recheck' };
    if (medical === 'concern') return { plan: 'pulm-eval-and-clearance' };
    if (fit === 'pass' && medical === 'cleared') return { plan: 'fit-test-valid-1y' };
    return { plan: 'standard-fit-test' };
  },
  DrugTest: function (i) {
    const result = (i.result || 'negative');
    const chain = (i.chain || 'intact');
    if (result === 'positive' && chain === 'intact') return { plan: 'MRO-review-and-confirm' };
    if (result === 'positive' && chain === 'broken') return { plan: 'invalid-and-retest' };
    if (result === 'negative') return { plan: 'cleared' };
    if (result === 'adulterated') return { plan: 'invalid-and-direct-observation-retest' };
    return { plan: 'standard-screen' };
  },
  DisabilityRating: function (i) {
    const injury = (i.injury || 'unknown');
    const impairment = (i.impairment || 0);
    if (injury === 'amputation' && impairment > 50) return { plan: 'permanent-total-disability' };
    if (impairment > 30) return { plan: 'permanent-partial-and-voc' };
    if (impairment > 10) return { plan: 'permanent-partial-mild' };
    if (impairment > 0) return { plan: 'schedule-award-and-monitor' };
    return { plan: 'no-disability' };
  },
};
module.exports = Engine;
