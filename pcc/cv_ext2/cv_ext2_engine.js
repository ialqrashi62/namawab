// P3-BH cv_ext2_engine.js — 10 pure functions
const Engine = {
  ACS: function (i) {
    const troponin = (i.troponin || 0);
    const stElevation = (i.stElevation || 'no');
    const grace = (i.grace || 100);
    if (stElevation === 'yes') return { plan: 'STEMI-and-emergent-PCI' };
    if (troponin > 1 && grace > 140) return { plan: 'NSTEMI-and-early-invasive' };
    if (troponin > 0.1) return { plan: 'NSTEMI-and-invasive-eval' };
    if (grace > 140) return { plan: 'high-risk-UA-and-invasive' };
    return { plan: 'low-risk-UA-and-medical' };
  },
  HeartFailure: function (i) {
    const ef = (i.ef || 50);
    const nyha = (i.nyha || 1);
    const ntProBNP = (i.ntProBNP || 500);
    if (ef < 30 && nyha >= 3) return { plan: 'GDMT-and-device-eval-and-transplant' };
    if (ef < 40 && nyha >= 2) return { plan: 'GDMT-and-ARNI-and-BB-and-MRA' };
    if (ef < 50 && ntProBNP > 1000) return { plan: 'HFpEF-or-HFmrEF-eval' };
    if (ef >= 50 && nyha === 1) return { plan: 'mild-HFpEF-and-monitor' };
    return { plan: 'GDMT-and-monitor' };
  },
  Arrhythmia: function (i) {
    const type = (i.type || 'unknown');
    const hr = (i.hr || 80);
    const stability = (i.stability || 'stable');
    if (type === 'VF' || type === 'pulseless-VT') return { plan: 'defibrillation-and-ACLS' };
    if (type === 'VT' && stability === 'unstable') return { plan: 'synchronized-cardioversion' };
    if (type === 'SVT' && stability === 'stable') return { plan: 'vagal-and-adenosine' };
    if (type === 'AF' && hr > 110) return { plan: 'rate-control-and-anticoagulation' };
    if (type === 'AF' && stability === 'unstable') return { plan: 'cardioversion-and-heparin' };
    return { plan: 'monitor-and-evaluate' };
  },
  ValveDisease: function (i) {
    const lesion = (i.lesion || 'unknown');
    const severity = (i.severity || 'mild');
    const symptom = (i.symptom || 'no');
    if (severity === 'severe' && symptom === 'yes') return { plan: 'valve-replacement-and-eval' };
    if (severity === 'severe' && symptom === 'no') return { plan: 'valve-clinic-and-monitor' };
    if (lesion === 'AS' && severity === 'moderate') return { plan: 'stress-test-and-eval' };
    if (lesion === 'MR' && severity === 'moderate') return { plan: 'echo-every-6mo' };
    return { plan: 'mild-and-routine-echo' };
  },
  Hypertension: function (i) {
    const sbp = (i.sbp || 130);
    const diabetes = (i.diabetes || 'no');
    const cvd = (i.cvd || 'no');
    if (sbp >= 180) return { plan: 'hypertensive-emergency-and-IV' };
    if (sbp >= 160 && cvd === 'yes') return { plan: 'urgent-BP-control-and-eval' };
    if (sbp >= 140 && diabetes === 'yes') return { plan: 'target-130-and-ACE-and-CCB' };
    if (sbp >= 140) return { plan: 'lifestyle-and-consider-Rx' };
    if (sbp >= 130 && cvd === 'yes') return { plan: 'target-130-and-statins' };
    return { plan: 'lifestyle-and-annual-screen' };
  },
  Anticoagulation: function (i) {
    const indication = (i.indication || 'AF');
    const cha2ds2 = (i.cha2ds2 || 0);
    const crcl = (i.crcl || 90);
    const bleeding = (i.bleeding || 'no');
    if (cha2ds2 >= 2 && crcl > 50 && bleeding === 'no') return { plan: 'DOAC-and-monitor' };
    if (cha2ds2 >= 2 && crcl < 30) return { plan: 'warfarin-and-INR' };
    if (cha2ds2 >= 1 && bleeding === 'high') return { plan: 'shared-decision-and-LAA-closure' };
    if (indication === 'mechanical-valve') return { plan: 'warfarin-and-INR' };
    if (cha2ds2 < 2) return { plan: 'no-anticoagulation-needed' };
    return { plan: 'evaluate-and-decide' };
  },
  LipidMgmt: function (i) {
    const ldl = (i.ldl || 100);
    const risk = (i.risk || 'low');
    const statin = (i.statin || 'none');
    if (ldl >= 190) return { plan: 'high-intensity-statin-and-PCSK9' };
    if (risk === 'high' && ldl >= 70) return { plan: 'high-intensity-statin-and-target-50' };
    if (risk === 'moderate' && ldl >= 100) return { plan: 'moderate-intensity-statin' };
    if (statin === 'intolerant') return { plan: 'ezetimibe-and-consider-PCSK9' };
    return { plan: 'lifestyle-and-monitor' };
  },
  PAD: function (i) {
    const abi = (i.abi || 1);
    const symptom = (i.symptom || 'no');
    const restPain = (i.restPain || 'no');
    if (abi < 0.4 && restPain === 'yes') return { plan: 'critical-limb-and-revascularization' };
    if (abi < 0.9 && symptom === 'claudication') return { plan: 'supervised-exercise-and-statin' };
    if (abi > 1.4) return { plan: 'calcification-and-mediate-test' };
    if (symptom === 'no' && abi < 0.9) return { plan: 'risk-factor-modification' };
    return { plan: 'normal-ABI' };
  },
  Cardiomyopathy: function (i) {
    const ef = (i.ef || 50);
    const cause = (i.cause || 'unknown');
    const family = (i.family || 'no');
    if (cause === 'ischemic' && ef < 30) return { plan: 'revascularization-eval-and-GDMT' };
    if (cause === 'takotsubo') return { plan: 'supportive-care-and-3mo-echo' };
    if (family === 'yes' && ef < 35) return { plan: 'genetic-counseling-and-ICD' };
    if (ef < 35) return { plan: 'GDMT-and-ICD-eval' };
    return { plan: 'GDMT-and-monitor' };
  },
  Pericardial: function (i) {
    const effusion = (i.effusion || 'small');
    const tamponade = (i.tamponade || 'no');
    const constriction = (i.constriction || 'no');
    if (tamponade === 'yes') return { plan: 'emergent-pericardiocentesis' };
    if (effusion === 'large' && constriction === 'no') return { plan: 'pericardiocentesis-and-eval' };
    if (constriction === 'yes') return { plan: 'pericardiectomy-eval' };
    if (effusion === 'moderate') return { plan: 'echo-and-medical' };
    return { plan: 'NSAID-and-colchicine' };
  },
};
module.exports = Engine;
