// P3-BR anesthesia2_engine.js — 10 pure functions
const Engine = {
  ASAClass: function (i) {
    const asa = (i.asa || 1);
    const surgery = (i.surgery || 'low');
    if (asa >= 5) return { plan: 'moribund-and-monitor' };
    if (asa >= 4 && surgery === 'high') return { plan: 'postop-ICU-and-inv-monitoring' };
    if (asa >= 3) return { plan: 'invasive-monitoring-and-step-down' };
    if (surgery === 'high' && asa >= 2) return { plan: 'standard-monitoring' };
    if (surgery === 'low') return { plan: 'outpatient-and-discharge' };
    return { plan: 'standard-monitoring' };
  },
  Airway: function (i) {
    const mallampati = (i.mallampati || 1);
    const distance = (i.distance || 6);
    if (mallampati >= 3 && distance < 6) return { plan: 'awake-fiberoptic-or-videolaryngoscopy' };
    if (mallampati >= 3) return { plan: 'videolaryngoscopy' };
    if (distance < 6) return { plan: 'difficult-airway-cart' };
    if (mallampati === 1 && distance >= 6) return { plan: 'standard-DLT-or-ETT' };
    return { plan: 'standard-DLT-or-ETT' };
  },
  Regional: function (i) {
    const type = (i.type || 'spinal');
    const coagulopathy = (i.coagulopathy || 'no');
    if (coagulopathy === 'yes') return { plan: 'defer-and-correct-coags' };
    if (type === 'epidural' && i.ambulatory === 'yes') return { plan: 'epidural-and-ambulatory' };
    if (type === 'spinal' && i.duration === 'long') return { plan: 'epidural-preferred' };
    if (type === 'TAP') return { plan: 'TAP-and-ambulatory' };
    if (type === 'spinal') return { plan: 'spinal-and-OR' };
    return { plan: 'eval-and-decide' };
  },
  General: function (i) {
    const duration = (i.duration || 1);
    const airway = (i.airway || 'normal');
    if (airway === 'difficult') return { plan: 'awake-FOL-or-videolaryngoscopy' };
    if (duration > 4) return { plan: 'GETA-and-arterial-line' };
    if (airway === 'normal' && duration < 1) return { plan: 'LMA-and-short' };
    if (airway === 'normal') return { plan: 'GETA-standard' };
    return { plan: 'GETA-and-eval' };
  },
  Monitoring: function (i) {
    const asa = (i.asa || 1);
    const surgery = (i.surgery || 'low');
    if (asa >= 4) return { plan: 'arterial-line-and-CVP' };
    if (surgery === 'cardiac') return { plan: 'arterial-line-and-TEE' };
    if (surgery === 'major') return { plan: 'arterial-line-and-Foley' };
    if (asa >= 3) return { plan: 'standard-ASA-and-Foley' };
    return { plan: 'standard-ASA' };
  },
  Pain: function (i) {
    const type = (i.type || 'acute');
    const severity = (i.severity || 'mild');
    if (severity === 'severe' && type === 'postop') return { plan: 'PCA-and-multimodal' };
    if (severity === 'moderate') return { plan: 'multimodal-and-oral-opioid' };
    if (severity === 'mild') return { plan: 'oral-and-acetaminophen' };
    if (type === 'chronic') return { plan: 'multimodal-and-PCA' };
    return { plan: 'eval-and-typed' };
  },
  Complications: function (i) {
    const comp = (i.comp || 'none');
    if (comp === 'malignant-hyperthermia') return { plan: 'dantrolene-and-ICU' };
    if (comp === 'anaphylaxis') return { plan: 'epinephrine-and-ICU' };
    if (comp === 'local-toxicity') return { plan: 'lipid-emulsion-and-eval' };
    if (comp === 'hypotension') return { plan: 'fluids-and-vasopressor' };
    if (comp === 'hyperthermia') return { plan: 'cooling-and-eval' };
    if (comp === 'laryngospasm') return { plan: 'succinylcholine-and-ventilate' };
    if (comp === 'aspiration') return { plan: 'intubate-and-ICU' };
    return { plan: 'monitor-and-eval' };
  },
  Fluids: function (i) {
    const duration = (i.duration || 1);
    const deficit = (i.deficit || 0);
    if (deficit > 1000) return { plan: 'bolus-and-maintenance' };
    if (duration > 4) return { plan: 'maintenance-and-replacement' };
    if (deficit > 500) return { plan: 'replacement-and-maintenance' };
    if (duration < 1) return { plan: 'maintenance-only' };
    return { plan: 'maintenance-and-monitor' };
  },
  Emergence: function (i) {
    const delayed = (i.delayed || 'no');
    const airway = (i.airway || 'normal');
    if (delayed === 'yes' && airway === 'difficult') return { plan: 'continue-vent-and-eval' };
    if (airway === 'difficult') return { plan: 'awake-FO-and-eval' };
    if (delayed === 'yes') return { plan: 'reversal-and-recheck' };
    return { plan: 'extubate-and-PACU' };
  },
  RegionalBlock: function (i) {
    const type = (i.type || 'peripheral');
    const site = (i.site || 'upper-extremity');
    if (site === 'neck' && type === 'deep') return { plan: 'US-guided-and-eval' };
    if (type === 'interscalene') return { plan: 'US-guided-and-eval-phrenic' };
    if (type === 'femoral') return { plan: 'US-guided-and-eval' };
    if (type === 'axillary') return { plan: 'US-guided-and-eval' };
    if (type === 'peripheral') return { plan: 'US-guided-and-standard' };
    return { plan: 'eval-and-typed' };
  },
};
module.exports = Engine;
