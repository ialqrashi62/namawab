// P3-BJ perinatal_ext2_engine.js — 10 pure functions (advanced maternal-fetal)
const Engine = {
  PreeclampsiaSevere: function (i) {
    const sbp = (i.sbp || 160);
    const plt = (i.plt || 150);
    const ast = (i.ast || 30);
    const creat = (i.creat || 1);
    const ga = (i.ga || 32);
    if (sbp >= 160 && (plt < 100 || ast > 70 || creat > 1.1)) return { plan: 'severe-PE-and-magnesium-and-delivery-if-stable' };
    if (sbp >= 160 && ga >= 34) return { plan: 'severe-PE-and-delivery-eval' };
    if (sbp >= 160 && ga < 34) return { plan: 'severe-PE-and-steroids-and-monitor' };
    if (sbp >= 140 && plt < 150) return { plan: 'HELLP-eval-and-LFT-platelet' };
    return { plan: 'mild-PE-and-monitor' };
  },
  FGR: function (i) {
    const efwCentile = (i.efwCentile || 30);
    const doppler = (i.doppler || 'normal');
    const ga = (i.ga || 30);
    if (efwCentile < 3) return { plan: 'severe-FGR-and-delivery-eval' };
    if (efwCentile < 10 && doppler === 'absent') return { plan: 'severe-FGR-and-urgent-delivery' };
    if (efwCentile < 10) return { plan: 'FGR-and-weekly-surveillance' };
    if (efwCentile < 25 && ga >= 36) return { plan: 'FGR-and-delivery-eval' };
    return { plan: 'normal-growth-and-routine-US' };
  },
  GDM: function (i) {
    const fasting = (i.fasting || 90);
    const postPrandial = (i.postPrandial || 130);
    const a1c = (i.a1c || 6);
    if (fasting >= 95 && postPrandial >= 140) return { plan: 'GDM-and-medical-nutrition-and-monitor' };
    if (fasting >= 105) return { plan: 'GDM-and-insulin-therapy' };
    if (a1c >= 6.5) return { plan: 'overt-DM-and-insulin' };
    if (postPrandial >= 140) return { plan: 'GDM-and-glyburide-or-insulin' };
    return { plan: 'GDM-and-diet-and-exercise' };
  },
  PretermLabor: function (i) {
    const ga = (i.ga || 32);
    const cx = (i.cx || 2);
    const contractions = (i.contractions || 'mild');
    const ffn = (i.ffn || 'negative');
    if (ga < 24) return { plan: 'expectant-and-monitor' };
    if (ga < 34 && cx > 4 && contractions === 'regular') return { plan: 'tocolysis-and-antenatal-steroids' };
    if (ga < 34 && ffn === 'positive') return { plan: 'high-risk-and-antenatal-steroids' };
    if (ga >= 34) return { plan: 'allow-labor-and-prepare' };
    return { plan: 'monitor-and-reassess' };
  },
  PPROM: function (i) {
    const ga = (i.ga || 30);
    const infection = (i.infection || 'no');
    const latency = (i.latency || 0);
    if (ga < 24) return { plan: 'expectant-vs-counseling' };
    if (ga < 34 && infection === 'no') return { plan: 'antibiotics-and-antenatal-steroids-and-monitor' };
    if (ga < 34 && infection === 'yes') return { plan: 'antibiotics-and-delivery-eval' };
    if (ga >= 34) return { plan: 'allow-labor-and-antibiotics' };
    return { plan: 'monitor-and-maternal-fetal' };
  },
  MultipleGestation: function (i) {
    const twins = (i.twins || 'no');
    const ttts = (i.ttts || 'no');
    const ga = (i.ga || 30);
    if (twins === 'yes' && ttts === 'yes') return { plan: 'TTTS-and-laser-eval' };
    if (twins === 'yes' && ga >= 37) return { plan: 'twin-delivery-and-eval' };
    if (twins === 'yes' && ga < 34) return { plan: 'twin-anatomy-and-monitor' };
    return { plan: 'singleton-and-routine' };
  },
  AnemiaPregnancy: function (i) {
    const hgb = (i.hgb || 11);
    const mcv = (i.mcv || 85);
    const iron = (i.iron || 'normal');
    if (hgb < 7) return { plan: 'transfuse-and-eval' };
    if (hgb < 10 && iron === 'low') return { plan: 'iron-IV-and-recheck' };
    if (hgb < 10) return { plan: 'iron-oral-and-recheck' };
    if (mcv < 80) return { plan: 'microcytic-and-eval-thalassemia' };
    return { plan: 'normal-and-prenatal-vitamins' };
  },
  PostpartumHemorrhage: function (i) {
    const ebl = (i.ebl || 500);
    const cause = (i.cause || 'unknown');
    const stable = (i.stable || 'yes');
    if (stable === 'no') return { plan: 'massive-transfusion-and-IR-or-OR' };
    if (cause === 'atony' && ebl < 1000) return { plan: 'uterotonics-and-bakri' };
    if (cause === 'atony' && ebl >= 1000) return { plan: 'B-Lynch-and-IR-or-hysterectomy' };
    if (cause === 'retained' && ebl < 1000) return { plan: 'manual-and-D-and-C' };
    if (cause === 'trauma' && ebl < 1000) return { plan: 'repair-and-ligation' };
    if (ebl >= 1500) return { plan: 'massive-transfusion-and-hysterectomy' };
    return { plan: 'monitor-and-uterotonics' };
  },
  CervicalInsufficiency: function (i) {
    const ga = (i.ga || 18);
    const cxLength = (i.cxLength || 25);
    const prior = (i.prior || 'no');
    if (cxLength < 10 && prior === 'yes') return { plan: 'cerclage-and-monitor' };
    if (cxLength < 25 && prior === 'yes') return { plan: 'history-indicated-cerclage' };
    if (cxLength < 25 && prior === 'no') return { plan: 'serial-US-and-progesterone' };
    if (cxLength < 10) return { plan: 'rescue-cerclage-eval' };
    return { plan: 'normal-cervix-and-monitor' };
  },
  RHisoimmunization: function (i) {
    const antibody = (i.antibody || 'negative');
    const titer = (i.titer || 0);
    const ga = (i.ga || 28);
    if (antibody === 'negative') return { plan: 'anti-D-at-28w-and-rogam' };
    if (titer >= 16) return { plan: 'MCA-doppler-every-2w' };
    if (titer >= 4) return { plan: 'serial-titers-every-4w' };
    if (ga >= 28) return { plan: 'anti-D-prophylaxis' };
    return { plan: 'monitor-and-reassess' };
  },
};
module.exports = Engine;
