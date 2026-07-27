// P3-BT icu_ext2_engine.js — 10 pure functions
const Engine = {
  Ventilator: function (i) {
    const mode = (i.mode || 'AC');
    const peep = (i.peep || 5);
    const fio2 = (i.fio2 || 0.4);
    if (peep >= 10 && fio2 >= 0.6) return { plan: 'ARDSnet-and-prone-eval' };
    if (fio2 >= 0.6) return { plan: 'wean-and-eval' };
    if (mode === 'AC' && fio2 < 0.4) return { plan: 'PS-trial-and-eval' };
    if (mode === 'PS') return { plan: 'extubation-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Sedation: function (i) {
    const rass = (i.rass || 0);
    if (rass >= 2) return { plan: 'titrate-down-and-pain' };
    if (rass <= -2) return { plan: 'titrate-up-and-eval' };
    return { plan: 'maintain-and-typed' };
  },
  Shock: function (i) {
    const type = (i.type || 'unknown');
    if (type === 'septic') return { plan: 'norepi-and-ABx' };
    if (type === 'cardiogenic') return { plan: 'dobutamine-and-eval' };
    if (type === 'hypovolemic') return { plan: 'fluids-and-eval' };
    if (type === 'obstructive') return { plan: 'decomp-and-eval' };
    return { plan: 'fluids-and-typed' };
  },
  DVT: function (i) {
    const prophylaxis = (i.prophylaxis || 'heparin');
    if (prophylaxis === 'none') return { plan: 'start-heparin-and-eval' };
    if (prophylaxis === 'heparin') return { plan: 'monitor-and-eval' };
    return { plan: 'continue-and-typed' };
  },
  Glucose: function (i) {
    const g = (i.g || 120);
    if (g > 180) return { plan: 'insulin-bolus-and-protocol' };
    if (g < 80) return { plan: 'D50-and-protocol' };
    return { plan: 'maintain-and-monitor' };
  },
  Electrolyte: function (i) {
    const k = (i.k || 4);
    const na = (i.na || 140);
    if (k > 6) return { plan: 'insulin-and-calcium' };
    if (na < 130) return { plan: 'fluid-restrict-and-eval' };
    return { plan: 'monitor-and-maint' };
  },
  Transfusion: function (i) {
    const hgb = (i.hgb || 8);
    if (hgb < 7) return { plan: 'PRBC-1U-and-eval' };
    if (hgb < 8) return { plan: 'PRBC-1U-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
  CRRT: function (i) {
    const k = (i.k || 4);
    const ph = (i.ph || 7.4);
    if (k > 6.5) return { plan: 'init-CRRT-and-eval' };
    if (ph < 7.2) return { plan: 'bicarb-and-CRRT-eval' };
    return { plan: 'monitor-and-eval' };
  },
  ICP: function (i) {
    const icp = (i.icp || 10);
    if (icp > 20) return { plan: 'osmotic-and-positioning' };
    if (icp > 25) return { plan: 'hyperventilation-and-surg' };
    return { plan: 'monitor-and-typed' };
  },
  Nutrition: function (i) {
    const day = (i.day || 1);
    const route = (i.route || 'NGT');
    if (day < 2) return { plan: 'init-trophic-and-monitor' };
    if (route === 'NGT' && day >= 2) return { plan: 'advance-rate-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
};
module.exports = Engine;
