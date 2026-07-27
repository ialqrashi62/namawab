// P3-BK sports_med_ext_engine.js — 10 pure functions
const Engine = {
  Concussion: function (i) {
    const symptom = (i.symptoms || 'mild');
    const loss = (i.loss || 'no');
    const scat5 = (i.scat5 || 0);
    if (scat5 >= 60 || loss === 'yes') return { plan: 'immediate-removal-and-CT-and-no-return' };
    if (scat5 >= 30) return { plan: 'graded-return-and-24h-rest' };
    if (symptom === 'severe') return { plan: 'no-return-and-neuro-eval' };
    if (symptom === 'moderate') return { plan: 'rest-24-48h-and-return' };
    return { plan: 'monitor-and-return-when-asymptomatic' };
  },
  ACL: function (i) {
    const tear = (i.tear || 'partial');
    const instability = (i.instability || 'mild');
    const activity = (i.activity || 'recreational');
    if (tear === 'complete' && activity === 'competitive') return { plan: 'ACL-reconstruction-and-PT' };
    if (tear === 'complete' && instability === 'severe') return { plan: 'surgical-repair' };
    if (tear === 'partial' && instability === 'mild') return { plan: 'PT-and-bracing' };
    if (instability === 'moderate') return { plan: 'PT-and-eval' };
    return { plan: 'rehab-and-monitor' };
  },
  RotatorCuff: function (i) {
    const tear = (i.tear || 'none');
    const active = (i.active || 'recreational');
    if (tear === 'full-thickness' && active === 'overhead') return { plan: 'surgical-repair' };
    if (tear === 'partial' && active === 'overhead') return { plan: 'PT-and-consider-PRP' };
    if (tear === 'partial') return { plan: 'PT-and-NSAIDs' };
    if (tear === 'none') return { plan: 'PT-and-activity-modification' };
    return { plan: 'evaluate-and-treat' };
  },
  Tendinopathy: function (i) {
    const chronic = (i.chronic || 'no');
    const site = (i.site || 'achilles');
    if (chronic === 'yes' && site === 'achilles') return { plan: 'eccentric-loading-and-heavy-slow-resistance' };
    if (chronic === 'yes') return { plan: 'isometric-and-heavy-slow-resistance' };
    if (site === 'tennis-elbow') return { plan: 'brace-and-ECCE' };
    if (site === 'patellar') return { plan: 'decline-squat-and-quad-strength' };
    return { plan: 'rest-and-NSAIDs' };
  },
  StressFracture: function (i) {
    const site = (i.site || 'unknown');
    const risk = (i.risk || 'low');
    if (site === 'femoral-neck' && risk === 'high') return { plan: 'MRI-and-ortho-urgent' };
    if (site === 'tibia' && risk === 'high') return { plan: 'rest-6w-and-pool-running' };
    if (site === 'metatarsal') return { plan: 'boot-4-6w-and-pwb' };
    if (risk === 'high') return { plan: 'imaging-and-rest' };
    return { plan: 'rest-and-NSAIDs' };
  },
  Overtraining: function (i) {
    const fatigue = (i.fatigue || 'mild');
    const performance = (i.performance || 'normal');
    const hormones = (i.hormones || 'normal');
    if (fatigue === 'severe' && performance === 'declining') return { plan: 'complete-rest-2w-and-eval' };
    if (hormones === 'low') return { plan: 'workup-and-endocrine-eval' };
    if (fatigue === 'moderate') return { plan: 'reduce-volume-50%-and-monitor' };
    return { plan: 'monitor-and-recovery-week' };
  },
  DopingScreen: function (i) {
    const substance = (i.substance || 'unknown');
    const consent = (i.consent || 'no');
    if (substance === 'EPO' && consent === 'no') return { plan: 'sample-and-send-WADA' };
    if (substance === 'anabolic' && consent === 'no') return { plan: 'sample-and-WADA' };
    if (substance === 'stimulant' && consent === 'yes') return { plan: 'TUE-required' };
    if (consent === 'yes' && substance === 'asthma-inhaler') return { plan: 'TUE-and-document' };
    return { plan: 'standard-screening' };
  },
  SuddenCardiac: function (i) {
    const family = (i.family || 'no');
    const echo = (i.echo || 'normal');
    const symptom = (i.symptom || 'no');
    if (family === 'yes' && symptom === 'syncope') return { plan: 'urgent-cardiology-and-MRI' };
    if (echo === 'abnormal') return { plan: 'sports-cleared-by-cardiology' };
    if (symptom === 'chest-pain') return { plan: 'stress-test-and-cardiology' };
    if (family === 'yes') return { plan: 'genetic-counseling-and-MRI' };
    return { plan: 'cleared-and-follow-up' };
  },
  Preparticipation: function (i) {
    const cardiovascular = (i.cardiovascular || 'cleared');
    const musculo = (i.musculo || 'cleared');
    if (cardiovascular === 'concern') return { plan: 'cardiology-eval-before-clearance' };
    if (musculo === 'concern') return { plan: 'rehab-and-reassess' };
    if (cardiovascular === 'cleared' && musculo === 'cleared') return { plan: 'cleared' };
    return { plan: 'additional-workup' };
  },
  RecoveryProtocol: function (i) {
    const phase = (i.phase || 'acute');
    const injury = (i.injury || 'muscle-strain');
    if (phase === 'acute' && injury === 'muscle-strain') return { plan: 'PRICE-and-rest-72h' };
    if (phase === 'subacute' && injury === 'muscle-strain') return { plan: 'gentle-stretch-and-isometric' };
    if (phase === 'remodeling' && injury === 'muscle-strain') return { plan: 'eccentric-loading-and-progress' };
    if (phase === 'return-to-sport') return { plan: 'sport-specific-drills' };
    return { plan: 'continue-and-monitor' };
  },
};
module.exports = Engine;
