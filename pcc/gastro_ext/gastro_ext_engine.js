// P3-BN gastro_ext_engine.js — 10 pure functions (advanced GI)
const Engine = {
  IBS: function (i) {
    const subtype = (i.subtype || 'mixed');
    const alarm = (i.alarm || 'no');
    if (alarm === 'yes') return { plan: 'colonoscopy-and-eval' };
    if (subtype === 'diarrhea') return { plan: 'antispasmodic-and-loperamide' };
    if (subtype === 'constipation') return { plan: 'fiber-and-laxative' };
    if (subtype === 'mixed') return { plan: 'antispasmodic-and-fiber' };
    return { plan: 'lifestyle-and-monitor' };
  },
  IBD: function (i) {
    const activity = (i.activity || 'mild');
    const location = (i.location || 'colon');
    if (activity === 'severe' && location === 'colon') return { plan: 'IV-steroid-and-biologic' };
    if (activity === 'severe') return { plan: 'IV-steroid-and-eval' };
    if (activity === 'moderate' && location === 'ileal') return { plan: 'biologic-and-budesonide' };
    if (activity === 'moderate') return { plan: 'biologic-and-5-ASA' };
    if (activity === 'mild') return { plan: '5-ASA-and-budesonide' };
    return { plan: 'maintenance-and-monitor' };
  },
  LiverLesion: function (i) {
    const size = (i.size || 1);
    const features = (i.features || 'benign');
    if (size > 5 && features === 'malignant') return { plan: 'multidisciplinary-and-resection' };
    if (size > 5) return { plan: 'MRI-and-tumor-board' };
    if (size > 2 && features === 'indeterminate') return { plan: 'MRI-and-eval' };
    if (features === 'hemangioma') return { plan: 'reassure-and-monitor' };
    if (features === 'focal-nodular-hyperplasia') return { plan: 'reassure-and-monitor' };
    if (features === 'benign') return { plan: 'monitor-and-recheck' };
    return { plan: 'evaluate-and-decide' };
  },
  Cirrhosis: function (i) {
    const childPugh = (i.childPugh || 'A');
    const meld = (i.meld || 10);
    if (meld >= 30) return { plan: 'urgent-transplant-eval' };
    if (meld >= 15) return { plan: 'transplant-eval-and-List' };
    if (childPugh === 'C') return { plan: 'transplant-eval' };
    if (childPugh === 'B' && meld >= 12) return { plan: 'transplant-workup' };
    if (childPugh === 'B') return { plan: 'monitor-and-recheck' };
    return { plan: 'monitor-and-surveillance' };
  },
  HepB: function (i) {
    const hbeAg = (i.hbeAg || 'negative');
    const alt = (i.alt || 30);
    const viralLoad = (i.viralLoad || 0);
    if (hbeAg === 'positive' && alt >= 2) return { plan: 'antiviral-and-monitor' };
    if (viralLoad > 20000 && alt >= 2) return { plan: 'antiviral-and-monitor' };
    if (viralLoad > 2000) return { plan: 'monitor-and-FU' };
    return { plan: 'inactive-and-monitor' };
  },
  HepC: function (i) {
    const genotype = (i.genotype || '1');
    const fibrosis = (i.fibrosis || 'F0');
    if (fibrosis === 'F3' || fibrosis === 'F4') return { plan: 'DAA-and-treatment' };
    if (fibrosis === 'F2') return { plan: 'DAA-and-treatment' };
    if (genotype === '1' && fibrosis === 'F0') return { plan: 'DAA-and-treat' };
    if (fibrosis === 'F0' && genotype === '3') return { plan: 'DAA-and-treatment' };
    return { plan: 'DAA-and-treat' };
  },
  PUD: function (i) {
    const hPylori = (i.hPylori || 'no');
    const bleed = (i.bleed || 'no');
    if (bleed === 'active') return { plan: 'endoscopy-and-IV-PPI' };
    if (hPylori === 'yes') return { plan: 'triple-therapy-and-PPI' };
    if (hPylori === 'no') return { plan: 'PPI-and-H2-blocker' };
    return { plan: 'PPI-and-eval' };
  },
  GERD: function (i) {
    const alarm = (i.alarm || 'no');
    const response = (i.response || 'partial');
    if (alarm === 'yes') return { plan: 'endoscopy-and-biopsy' };
    if (response === 'no') return { plan: 'step-up-and-eval' };
    if (response === 'partial') return { plan: 'step-up-PPI' };
    return { plan: 'PPI-and-lifestyle' };
  },
  Pancreatitis: function (i) {
    const severity = (i.severity || 'mild');
    const cause = (i.cause || 'unknown');
    if (severity === 'severe') return { plan: 'ICU-and-fluid-resuscitation' };
    if (cause === 'gallstone') return { plan: 'ERCP-and-cholecystectomy' };
    if (severity === 'moderate') return { plan: 'supportive-and-monitor' };
    if (severity === 'mild') return { plan: 'supportive-and-advance-diet' };
    return { plan: 'supportive-and-eval-cause' };
  },
  ColonCancer: function (i) {
    const stage = (i.stage || 'I');
    const msi = (i.msi || 'stable');
    if (stage === 'IV' && msi === 'high') return { plan: 'immunotherapy' };
    if (stage === 'IV') return { plan: 'FOLFOX-or-FOLFIRI' };
    if (stage === 'III') return { plan: 'surgery-and-FOLFOX' };
    if (stage === 'II' && msi === 'high') return { plan: 'surgery-and-monitor' };
    if (stage === 'II') return { plan: 'surgery-and-consider-chemo' };
    if (stage === 'I') return { plan: 'surgery-and-monitor' };
    return { plan: 'evaluate-and-treat' };
  },
};
module.exports = Engine;
