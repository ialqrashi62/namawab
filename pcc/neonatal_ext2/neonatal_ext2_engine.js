// P3-BI neonatal_ext2_engine.js — 10 pure functions (advanced NICU)
const Engine = {
  TherapeuticHypothermia: function (i) {
    const ga = (i.ga || 39);
    const ageHours = (i.ageHours || 6);
    const encephalopathy = (i.encephalopathy || 'mild');
    if (encephalopathy === 'severe' && ga >= 36 && ageHours <= 6) return { plan: 'cooling-72h-and-monitor' };
    if (encephalopathy === 'moderate' && ageHours <= 6) return { plan: 'cooling-and-EEG' };
    if (ga < 36) return { plan: 'no-cooling-premature' };
    if (ageHours > 6) return { plan: 'outside-window-and-supportive' };
    return { plan: 'supportive-care' };
  },
  NEOScore: function (i) {
    const sbp = (i.sbp || 60);
    const fio2 = (i.fio2 || 0.21);
    const ph = (i.ph || 7.3);
    const lactate = (i.lactate || 2);
    let score = 0;
    if (sbp < 40) score += 5;
    else if (sbp < 50) score += 3;
    if (fio2 > 0.5) score += 4;
    else if (fio2 > 0.3) score += 2;
    if (ph < 7.1) score += 5;
    else if (ph < 7.2) score += 3;
    if (lactate > 5) score += 4;
    else if (lactate > 3) score += 2;
    let plan;
    if (score >= 12) plan = 'severe-NEOS-and-iNO-and-HFOV';
    else if (score >= 8) plan = 'moderate-NEOS-and-iNO';
    else if (score >= 4) plan = 'mild-NEOS-and-supportive';
    else plan = 'normal-and-monitor';
    return { score: score, plan: plan };
  },
  SepsisScreen: function (i) {
    const wbc = (i.wbc || 10);
    const crp = (i.crp || 1);
    const itRatio = (i.itRatio || 0.1);
    const temp = (i.temp || 37);
    let score = 0;
    if (wbc < 5 || wbc > 20) score += 1;
    if (crp > 10) score += 2;
    else if (crp > 5) score += 1;
    if (itRatio > 0.2) score += 2;
    if (temp < 36.5 || temp > 38) score += 1;
    let plan;
    if (score >= 4) return { score: score, plan: 'empiric-abx-and-blood-culture' };
    if (score >= 2) return { score: score, plan: 'serial-CRP-and-monitor' };
    return { score: score, plan: 'low-risk-and-monitor' };
  },
  Ventilation: function (i) {
    const mode = (i.mode || 'CPAP');
    const fio2 = (i.fio2 || 0.21);
    const peep = (i.peep || 5);
    const map = (i.map || 10);
    if (mode === 'CMV' && fio2 > 0.6) return { plan: 'HFOV-and-iNO-eval' };
    if (mode === 'CPAP' && fio2 > 0.4) return { plan: 'NIPPV-or-nCPAP-and-eval' };
    if (mode === 'HFOV' && map > 20) return { plan: 'decrease-amplitude-and-monitor' };
    if (peep < 4) return { plan: 'increase-PEEP-and-recruit' };
    if (fio2 < 0.25 && mode !== 'CPAP') return { plan: 'wean-and-extubate-eval' };
    return { plan: 'continue-current-and-monitor' };
  },
  Feeding: function (i) {
    const dayOfLife = (i.dayOfLife || 3);
    const weight = (i.weight || 2000);
    const trophic = (i.trophic || 'no');
    if (dayOfLife < 1) return { plan: 'NPO-and-TPN' };
    if (dayOfLife < 3 && trophic === 'no') return { plan: 'trophic-feeds-10ml/kg' };
    if (weight < 1500 && dayOfLife < 7) return { plan: 'minimal-enteral-and-TPN' };
    if (dayOfLife >= 7 && weight > 1800) return { plan: 'advance-to-full-feeds' };
    if (trophic === 'yes') return { plan: 'advance-by-20ml/kg' };
    return { plan: 'continue-current-rate' };
  },
  BPD: function (i) {
    const ga = (i.ga || 28);
    const pma = (i.pma || 32);
    const oxygenDays = (i.oxygenDays || 14);
    if (ga < 32 && pma >= 36 && oxygenDays >= 28) return { plan: 'severe-BPD-and-steroid-eval' };
    if (ga < 32 && pma >= 36 && oxygenDays < 28) return { plan: 'mild-BPD-and-monitor' };
    if (ga >= 32 && pma >= 36) return { plan: 'no-BPD-and-discharge-plan' };
    if (pma < 36) return { plan: 'too-early-and-monitor' };
    return { plan: 'evaluate-and-stage' };
  },
  ROP: function (i) {
    const ga = (i.ga || 28);
    const pma = (i.pma || 32);
    const stage = (i.stage || 0);
    if (stage >= 3 && pma >= 35) return { plan: 'treatment-and-bevacizumab-or-laser' };
    if (stage === 2 && pma >= 33) return { plan: 'weekly-screening-and-treat-if-progression' };
    if (ga < 30 && pma < 32) return { plan: 'screening-every-2-weeks' };
    if (ga >= 30) return { plan: 'screening-per-protocol' };
    return { plan: 'no-screening-needed' };
  },
  IVH: function (i) {
    const ga = (i.ga || 28);
    const cranialUS = (i.cranialUS || 'none');
    if (ga < 32 && cranialUS === 'none') return { plan: 'screening-cranial-US-day-7' };
    if (cranialUS === 'grade-3' || cranialUS === 'grade-4') return { plan: 'urgent-neuro-and-NE-img' };
    if (cranialUS === 'grade-2') return { plan: 'repeat-US-and-monitor' };
    if (cranialUS === 'grade-1') return { plan: 'monitor-and-repeat-day-14' };
    if (ga >= 32) return { plan: 'no-routine-screening' };
    return { plan: 'screen-and-evaluate' };
  },
  NEC: function (i) {
    const stage = (i.stage || 'suspected');
    const bellStage = (i.bellStage || 'IA');
    if (stage === 'confirmed' && bellStage === 'IIB') return { plan: 'surgical-eval-and-NPO' };
    if (stage === 'confirmed' && bellStage === 'IIA') return { plan: 'NPO-and-7d-abx-and-TPN' };
    if (bellStage === 'IB') return { plan: 'NPO-and-3d-abx-and-monitor' };
    if (bellStage === 'IA') return { plan: 'NPO-and-48h-monitor' };
    return { plan: 'continue-feeding' };
  },
  DischargeReadiness: function (i) {
    const weight = (i.weight || 2200);
    const tempReg = (i.tempReg || 'no');
    const feeding = (i.feeding || 'full');
    const apnea = (i.apnea || 'present');
    if (weight < 1800) return { plan: 'too-young-and-continued-NICU' };
    if (apnea === 'present') return { plan: 'apnea-monitor-and-stimulant-eval' };
    if (tempReg === 'no') return { plan: 'thermoregulation-and-incubator' };
    if (feeding === 'full' && tempReg === 'yes' && weight >= 2000) return { plan: 'discharge-ready' };
    return { plan: 'continue-monitoring' };
  },
};
module.exports = Engine;
