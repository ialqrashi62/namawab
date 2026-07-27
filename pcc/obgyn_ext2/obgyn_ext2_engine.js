// P3-BT obgyn_ext2_engine.js — 10 pure functions
const Engine = {
  Pregnancy: function (i) {
    const gest = (i.gest || 20);
    if (gest < 12) return { plan: 'first-trimester-and-eval' };
    if (gest >= 12 && gest < 28) return { plan: 'second-trimester-and-anatomy' };
    if (gest >= 28) return { plan: 'third-trimester-and-FU' };
    return { plan: 'eval-and-typed' };
  },
  PreEclampsia: function (i) {
    const severity = (i.severity || 'mild');
    const bp = (i.bp || 150);
    if (severity === 'severe' || bp >= 160) return { plan: 'magnesium-and-delivery' };
    if (severity === 'mild') return { plan: 'monitor-and-bedrest' };
    return { plan: 'eval-and-typed' };
  },
  GDM: function (i) {
    const gtt = (i.gtt || 140);
    if (gtt >= 200) return { plan: 'insulin-and-dietician' };
    if (gtt >= 140) return { plan: 'diet-and-exercise' };
    return { plan: 'monitor-and-FU' };
  },
  PPROM: function (i) {
    const gest = (i.gest || 30);
    const infection = (i.infection || 'no');
    if (gest < 24) return { plan: 'counsel-and-monitor' };
    if (gest < 34 && infection === 'no') return { plan: 'latency-ABx-and-steroids' };
    if (infection === 'yes') return { plan: 'ABx-and-delivery' };
    if (gest >= 34) return { plan: 'delivery' };
    return { plan: 'eval-and-typed' };
  },
  PPH: function (i) {
    const amount = (i.amount || 500);
    const cause = (i.cause || 'unknown');
    if (amount > 1500) return { plan: 'massive-transfusion-and-OR' };
    if (cause === 'atony') return { plan: 'uterine-massage-and-uterotonics' };
    if (cause === 'retained') return { plan: 'manual-extraction-and-OR' };
    if (cause === 'laceration') return { plan: 'OR-and-repair' };
    return { plan: 'workup-and-typed' };
  },
  Ectopic: function (i) {
    const stable = (i.stable || 'yes');
    const size = (i.size || 2);
    if (stable === 'no') return { plan: 'methotrexate-and-eval' };
    if (stable === 'yes' && size > 3.5) return { plan: 'surgery-and-decide' };
    if (stable === 'yes') return { plan: 'methotrexate-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  Induction: function (i) {
    const bishop = (i.bishop || 5);
    const indication = (i.indication || 'elective');
    if (bishop >= 6) return { plan: 'oxytocin-and-AROM' };
    if (bishop < 6) return { plan: 'cervical-ripening' };
    if (indication === 'urgent') return { plan: 'cervidil-and-AROM' };
    return { plan: 'cervical-ripening' };
  },
  GynCancer: function (i) {
    const type = (i.type || 'ovarian');
    const stage = (i.stage || 'I');
    if (type === 'ovarian' && stage === 'III') return { plan: 'surgery-and-chemo' };
    if (type === 'cervical' && stage === 'I') return { plan: 'surgery-or-rad' };
    if (type === 'endometrial' && stage === 'I') return { plan: 'surgery-and-staging' };
    return { plan: 'multidisciplinary-and-typed' };
  },
  Infertility: function (i) {
    const cause = (i.cause || 'unknown');
    const year = (i.year || 1);
    if (cause === 'PCOS') return { plan: 'clomiphene-and-eval' };
    if (cause === 'tubal') return { plan: 'IVF-and-eval' };
    if (year >= 2 && cause === 'unknown') return { plan: 'workup-and-eval' };
    return { plan: 'monitor-and-FU' };
  },
  Menopause: function (i) {
    const sx = (i.sx || 'none');
    if (sx === 'hot-flash') return { plan: 'HRT-and-eval' };
    if (sx === 'bone-loss') return { plan: 'DEXA-and-bisphosphonate' };
    return { plan: 'monitor-and-eval' };
  },
};
module.exports = Engine;
