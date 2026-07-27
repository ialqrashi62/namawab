// P3-BH neuro_ext2_engine.js — 10 pure functions
const Engine = {
  StrokeTriage: function (i) {
    const nihss = (i.nihss || 0);
    const onset = (i.onset || 0);
    if (nihss >= 6 && onset < 4.5) return { plan: 'tPA-eligible-and-CT-and-treat' };
    if (nihss >= 6 && onset < 24) return { plan: 'thrombectomy-eval' };
    if (nihss < 6 && onset < 24) return { plan: 'TIA-workup-and-antiplatelet' };
    if (onset >= 24) return { plan: 'secondary-prevention' };
    return { plan: 'stroke-workup' };
  },
  Migraine: function (i) {
    const frequency = (i.frequency || 0);
    const severity = (i.severity || 'mild');
    const aura = (i.aura || 'no');
    if (frequency >= 15) return { plan: 'chronic-migraine-and-preventive' };
    if (frequency >= 4 && severity === 'severe') return { plan: 'preventive-therapy-and-avoid-OCP' };
    if (aura === 'yes') return { plan: 'triptan-and-aura-management' };
    if (severity === 'moderate') return { plan: 'triptan-and-antiemetic' };
    return { plan: 'NSAID-and-rest' };
  },
  Seizure: function (i) {
    const type = (i.type || 'unknown');
    const frequency = (i.frequency || 0);
    const aed = (i.aed || 'none');
    if (type === 'status-epilepticus') return { plan: 'lorazepam-IV-and-EEG' };
    if (frequency >= 4 && aed === 'none') return { plan: 'start-AED' };
    if (frequency >= 1 && aed !== 'none') return { plan: 'optimize-AED-level' };
    if (type === 'focal' && aed === 'none') return { plan: 'start-focal-AED' };
    return { plan: 'first-seizure-workup' };
  },
  Parkinsons: function (i) {
    const hy = (i.hy || 1);
    const tremor = (i.tremor || 'mild');
    const age = (i.age || 65);
    if (age < 60) return { plan: 'MAO-B-inhibitor-and-dopamine-agonist' };
    if (age < 70 && tremor === 'severe') return { plan: 'levodopa-and-decarboxylase' };
    if (age >= 70 && tremor === 'mild') return { plan: 'levodopa-low-dose' };
    if (hy >= 3) return { plan: 'consider-DBS-and-movement-disorder' };
    return { plan: 'levodopa-and-titrate' };
  },
  MSRelapse: function (i) {
    const newLesions = (i.newLesions || 0);
    const edss = (i.edss || 0);
    const dmt = (i.dmt || 'none');
    if (newLesions >= 3 && dmt === 'none') return { plan: 'start-high-efficacy-DMT' };
    if (newLesions >= 1 && dmt !== 'none') return { plan: 'switch-DMT' };
    if (edss >= 4) return { plan: 'consider-escalation' };
    return { plan: 'continue-current-DMT' };
  },
  DementiaEval: function (i) {
    const mmse = (i.mmse || 25);
    const moca = (i.moca || 25);
    const onset = (i.onset || 'gradual');
    const duration = (i.duration || 12);
    if (mmse < 20 && onset === 'gradual') return { plan: 'Alzheimer-workup-and-MRI' };
    if (mmse < 20 && onset === 'stepwise') return { plan: 'vascular-dementia-workup' };
    if (mmse < 25 && onset === 'acute') return { plan: 'delirium-or-NPH-eval' };
    if (moca < 22 && duration < 6) return { plan: 'MCI-and-follow-up' };
    return { plan: 'cognitive-screen-and-monitor' };
  },
  GBS: function (i) {
    const progression = (i.progression || 'slow');
    const respiratory = (i.respiratory || 'intact');
    const ncs = (i.ncs || 'pending');
    if (respiratory === 'failing') return { plan: 'IVIG-and-ICU-and-intubate' };
    if (progression === 'rapid' && ncs === 'demyelinating') return { plan: 'IVIG-and-monitor' };
    if (progression === 'slow' && ncs === 'axonal') return { plan: 'plasma-exchange-and-ICU' };
    if (ncs === 'pending') return { plan: 'LP-and-NCS-and-monitor' };
    return { plan: 'supportive-care' };
  },
  Myasthenia: function (i) {
    const crisis = (i.crisis || 'no');
    const achr = (i.achr || 'positive');
    const resp = (i.resp || 'stable');
    if (crisis === 'yes' && resp === 'failing') return { plan: 'plasma-exchange-and-ICU' };
    if (crisis === 'yes') return { plan: 'IVIG-and-steroid' };
    if (achr === 'positive') return { plan: 'pyridostigmine-and-steroid' };
    if (resp === 'declining') return { plan: 'plasma-exchange-and-IVIG' };
    return { plan: 'pyridostigmine-and-monitor' };
  },
  Neuropathy: function (i) {
    const type = (i.type || 'unknown');
    const diabetes = (i.diabetes || 'no');
    const aed = (i.aed || 'none');
    if (type === 'diabetic' && diabetes === 'yes') return { plan: 'glycemic-control-and-gabapentin' };
    if (aed === 'none') return { plan: 'gabapentin-or-lyrica' };
    if (aed !== 'none' && type === 'CIDP') return { plan: 'IVIG-and-plasma-exchange' };
    if (type === 'B12') return { plan: 'B12-replacement' };
    return { plan: 'workup-and-symptomatic' };
  },
  BrainTumor: function (i) {
    const location = (i.location || 'unknown');
    const size = (i.size || 0);
    const malignant = (i.malignant || 'unknown');
    if (malignant === 'high-grade' && size > 3) return { plan: 'resection-and-radiation-and-chemo' };
    if (malignant === 'low-grade' && size < 3) return { plan: 'observe-and-MRI-3mo' };
    if (location === 'meninges' && size < 2) return { plan: 'observe-or-resect' };
    if (malignant === 'metastasis') return { plan: 'stereotactic-radiosurgery' };
    return { plan: 'multidisciplinary-tumor-board' };
  },
};
module.exports = Engine;
