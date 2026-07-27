// P3-BL ent_ext_engine.js — 10 pure functions
const Engine = {
  HearingLoss: function (i) {
    const type = (i.type || 'unknown');
    const severity = (i.severity || 'mild');
    if (type === 'sudden' && severity === 'severe') return { plan: 'urgent-audio-and-steroids' };
    if (type === 'conductive') return { plan: 'tympanostomy-or-repair' };
    if (type === 'sensorineural' && severity === 'severe') return { plan: 'cochlear-implant-eval' };
    if (type === 'sensorineural' && severity === 'moderate') return { plan: 'hearing-aid' };
    if (severity === 'mild') return { plan: 'monitor-and-recheck' };
    return { plan: 'evaluate-and-treat' };
  },
  Vertigo: function (i) {
    const type = (i.type || 'unknown');
    const nystagmus = (i.nystagmus || 'no');
    if (type === 'BPPV' && nystagmus === 'yes') return { plan: 'Epley-maneuver' };
    if (type === 'BPPV') return { plan: 'Dix-Hallpike-and-Epley' };
    if (type === 'vestibular-neuritis') return { plan: 'steroids-and-VRT' };
    if (type === 'Meniere' && nystagmus === 'no') return { plan: 'low-salt-and-diuretic' };
    if (type === 'Meniere') return { plan: 'low-salt-and-intratympanic' };
    if (type === 'central') return { plan: 'urgent-MRI-and-stroke-eval' };
    return { plan: 'evaluate-and-treat' };
  },
  Tinnitus: function (i) {
    const duration = (i.duration || 0);
    const unilateral = (i.unilateral || 'no');
    if (unilateral === 'yes' && duration > 6) return { plan: 'MRI-IAC' };
    if (duration > 6) return { plan: 'CBT-and-sound-therapy' };
    if (duration < 3) return { plan: 'monitor-and-recheck' };
    return { plan: 'sound-therapy-and-CBT' };
  },
  Sinusitis: function (i) {
    const chronic = (i.chronic || 'no');
    const polyps = (i.polyps || 'no');
    if (polyps === 'yes' && chronic === 'yes') return { plan: 'polypectomy-and-surgery' };
    if (chronic === 'yes' && polyps === 'no') return { plan: 'endoscopic-sinus-surgery' };
    if (chronic === 'no' && polyps === 'no') return { plan: 'saline-and-INCS-and-abx' };
    if (polyps === 'yes') return { plan: 'INCS-and-polypectomy' };
    return { plan: 'saline-and-INCS' };
  },
  OSA: function (i) {
    const ahi = (i.ahi || 5);
    const bmi = (i.bmi || 25);
    if (ahi >= 30) return { plan: 'CPAP-and-weight-loss' };
    if (ahi >= 15 && bmi >= 30) return { plan: 'CPAP-or-bariatric' };
    if (ahi >= 15) return { plan: 'CPAP-and-lifestyle' };
    if (ahi >= 5) return { plan: 'weight-loss-and-MAD' };
    if (ahi < 5) return { plan: 'lifestyle-and-monitor' };
    return { plan: 'evaluate-and-decide' };
  },
  Hoarseness: function (i) {
    const duration = (i.duration || 0);
    const smoker = (i.smoker || 'no');
    if (duration > 4 && smoker === 'yes') return { plan: 'urgent-laryngoscopy' };
    if (duration > 4) return { plan: 'laryngoscopy-and-eval' };
    if (duration > 2) return { plan: 'voice-rest-and-eval' };
    return { plan: 'hydration-and-rest' };
  },
  Epistaxis: function (i) {
    const severity = (i.severity || 'mild');
    const posterior = (i.posterior || 'no');
    if (severity === 'severe' && posterior === 'yes') return { plan: 'posterior-pack-and-IR' };
    if (severity === 'severe') return { plan: 'anterior-pack-and-cautery' };
    if (severity === 'moderate') return { plan: 'silver-nitrate-and-pressure' };
    return { plan: 'pinch-and-ice' };
  },
  Dysphagia: function (i) {
    const phase = (i.phase || 'unknown');
    const chronic = (i.chronic || 'no');
    if (phase === 'oropharyngeal' && chronic === 'yes') return { plan: 'VFSS-and-SLP-eval' };
    if (phase === 'oropharyngeal') return { plan: 'SLP-eval-and-modified-diet' };
    if (phase === 'esophageal' && chronic === 'yes') return { plan: 'EGD-and-biopsy' };
    if (phase === 'esophageal') return { plan: 'PPI-and-EGD' };
    return { plan: 'evaluate-and-eval' };
  },
  Thyroid: function (i) {
    const tsh = (i.tsh || 2);
    const nodule = (i.nodule || 'no');
    if (tsh > 10) return { plan: 'levothyroxine-and-eval' };
    if (tsh < 0.1) return { plan: 'hyperthyroid-workup' };
    if (nodule === 'yes' && tsh > 2) return { plan: 'FNA-and-ultrasound' };
    if (nodule === 'yes') return { plan: 'thyroid-ultrasound-and-FNA' };
    return { plan: 'monitor-and-recheck' };
  },
  Otitis: function (i) {
    const type = (i.type || 'unknown');
    const age = (i.age || 5);
    const recurrent = (i.recurrent || 'no');
    if (type === 'AOM' && age < 2) return { plan: 'amoxicillin-and-recheck' };
    if (type === 'AOM') return { plan: 'amoxicillin-and-pain-control' };
    if (type === 'OME' && recurrent === 'yes') return { plan: 'tympanostomy-tubes' };
    if (type === 'OME') return { plan: 'monitor-and-recheck' };
    if (type === 'CSOM') return { plan: 'topical-fluoroquinolone' };
    return { plan: 'evaluate-and-treat' };
  },
};
module.exports = Engine;
