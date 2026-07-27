// P3-BK pain_ext2_engine.js — 10 pure functions
const Engine = {
  OpioidRotation: function (i) {
    const current = (i.current || 'morphine');
    const pain = (i.pain || 'mild');
    if (current === 'morphine' && pain === 'severe') return { plan: 'rotate-to-hydromorphone' };
    if (current === 'oxycodone' && pain === 'severe') return { plan: 'rotate-to-morphine-or-fentanyl' };
    if (current === 'fentanyl' && pain === 'severe') return { plan: 'add-ketamine-or-PCA' };
    if (current === 'methadone' && pain === 'moderate') return { plan: 'continue-methadone-and-titrate' };
    if (pain === 'mild') return { plan: 'wean-and-non-opioid' };
    return { plan: 'evaluate-and-rotate' };
  },
  NerveBlock: function (i) {
    const site = (i.site || 'unknown');
    const duration = (i.duration || 'short');
    if (site === 'shoulder' && duration === 'long') return { plan: 'interscalene-block-and-PCA' };
    if (site === 'knee' && duration === 'long') return { plan: 'femoral-or-adductor-canal-block' };
    if (site === 'abdomen') return { plan: 'TAP-block' };
    if (site === 'chest' && duration === 'long') return { plan: 'paravertebral-block' };
    if (duration === 'short') return { plan: 'single-shot-nerve-block' };
    return { plan: 'evaluate-and-choose' };
  },
  CancerPain: function (i) {
    const type = (i.type || 'nociceptive');
    const severity = (i.severity || 'mild');
    if (type === 'neuropathic' && severity === 'severe') return { plan: 'gabapentin-and-opioid' };
    if (type === 'neuropathic') return { plan: 'gabapentin-or-lyrica' };
    if (severity === 'severe' && type === 'bone') return { plan: 'opioid-and-bisphosphonate' };
    if (severity === 'severe') return { plan: 'strong-opioid-and-PCA' };
    if (severity === 'moderate') return { plan: 'weak-opioid-and-adjuvant' };
    return { plan: 'non-opioid-and-NSAIDs' };
  },
  SpinalCordStim: function (i) {
    const trial = (i.trial || 'pending');
    const indication = (i.indication || 'unknown');
    if (indication === 'failed-back-syndrome' && trial === 'success') return { plan: 'implant-SCS' };
    if (indication === 'CRPS' && trial === 'success') return { plan: 'implant-SCS' };
    if (trial === 'pending') return { plan: 'trial-7-days' };
    if (trial === 'failed') return { plan: 'intrathcal-pump-or-other' };
    return { plan: 'evaluate-and-trial' };
  },
  IntrathecalPump: function (i) {
    const drug = (i.drug || 'morphine');
    const dose = (i.dose || 0);
    if (drug === 'morphine' && dose > 20) return { plan: 'reduce-dose-and-consider-ziconotide' };
    if (drug === 'morphine' && dose > 10) return { plan: 'add-baclofen-or-consider' };
    if (drug === 'ziconotide' && dose > 20) return { plan: 'reduce-and-monitor' };
    if (drug === 'baclofen' && dose > 200) return { plan: 'monitor-and-pump-check' };
    return { plan: 'continue-and-monitor' };
  },
  MigraineAcute: function (i) {
    const severity = (i.severity || 'mild');
    const aura = (i.aura || 'no');
    const pregnancy = (i.pregnancy || 'no');
    if (severity === 'severe' && pregnancy === 'no') return { plan: 'sumatriptan-and-antiemetic' };
    if (severity === 'severe' && pregnancy === 'yes') return { plan: 'acetaminophen-and-metoclopramide' };
    if (aura === 'yes' && severity === 'moderate') return { plan: 'triptan-and-rest' };
    if (severity === 'moderate') return { plan: 'NSAID-and-triptan' };
    if (severity === 'mild') return { plan: 'acetaminophen-or-NSAID' };
    return { plan: 'evaluate-and-treat' };
  },
  CRPS: function (i) {
    const stage = (i.stage || 'acute');
    const limb = (i.limb || 'upper');
    if (stage === 'acute' && limb === 'upper') return { plan: 'PT-and-gabapentin-and-stellate-block' };
    if (stage === 'acute' && limb === 'lower') return { plan: 'PT-and-gabapentin-and-LSB' };
    if (stage === 'chronic') return { plan: 'PT-and-SCS-eval' };
    if (stage === 'dystrophic') return { plan: 'PT-and-bisphosphonate-IV' };
    return { plan: 'PT-and-sympathetic-block' };
  },
  PediatricPain: function (i) {
    const age = (i.age || 8);
    const severity = (i.severity || 'mild');
    if (age < 2) return { plan: 'sucrose-and-comfort' };
    if (severity === 'severe' && age >= 6) return { plan: 'codeine-or-morphine-with-monitoring' };
    if (severity === 'moderate' && age >= 6) return { plan: 'ibuprofen-and-acetaminophen' };
    if (severity === 'mild') return { plan: 'acetaminophen-or-ibuprofen' };
    return { plan: 'evaluate-and-comfort' };
  },
  Tapering: function (i) {
    const drug = (i.drug || 'opioid');
    const duration = (i.duration || 30);
    if (drug === 'opioid' && duration > 90) return { plan: 'slow-taper-10%-per-month' };
    if (drug === 'opioid' && duration > 30) return { plan: 'taper-5-10%-per-week' };
    if (drug === 'benzodiazepine') return { plan: 'taper-5-10%-per-week-and-switch-LA' };
    if (drug === 'gabapentin') return { plan: 'taper-300mg-per-week' };
    if (drug === 'SSRI') return { plan: 'taper-slow-and-monitor-discontinuation' };
    return { plan: 'standard-taper' };
  },
  Multimodal: function (i) {
    const surgery = (i.surgery || 'unknown');
    const opioid = (i.opioid || 'yes');
    if (surgery === 'joint-replacement' && opioid === 'yes') return { plan: 'multimodal-and-PCA-and-nerve-block' };
    if (surgery === 'laparoscopic') return { plan: 'multimodal-and-oral-and-minimize-opioid' };
    if (surgery === 'major-cancer') return { plan: 'epidural-and-multimodal' };
    if (surgery === 'minor-ambulatory') return { plan: 'NSAID-and-acetaminophen' };
    if (opioid === 'no') return { plan: 'continue-multimodal' };
    return { plan: 'evaluate-and-multimodal' };
  },
};
module.exports = Engine;
