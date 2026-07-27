// P3-BM hem_ext_engine.js — 10 pure functions (advanced hematology)
const Engine = {
  AnemiaWorkup: function (i) {
    const mcv = (i.mcv || 85);
    const retic = (i.retic || 1);
    const ferritin = (i.ferritin || 100);
    if (mcv < 80 && ferritin < 30) return { plan: 'iron-deficiency-and-treat-cause' };
    if (mcv < 80) return { plan: 'thalassemia-trait-and-HPLC' };
    if (mcv > 100) return { plan: 'B12-and-folate-eval' };
    if (retic < 1) return { plan: 'aplastic-or-chronic-disease' };
    if (retic > 3) return { plan: 'hemolysis-or-bleeding-eval' };
    return { plan: 'chronic-disease-and-eval' };
  },
  SickleCell: function (i) {
    const crisis = (i.crisis || 'no');
    const hgb = (i.hgb || 8);
    const trigger = (i.trigger || 'none');
    if (crisis === 'acute-chest' && hgb < 7) return { plan: 'transfuse-and-antibiotics' };
    if (crisis === 'acute-chest') return { plan: 'exchange-transfusion-and-antibiotics' };
    if (crisis === 'vaso-occlusive') return { plan: 'hydration-and-opioid-and-oxygen' };
    if (crisis === 'priapism') return { plan: 'aspiration-and-irrigation' };
    if (trigger !== 'none' && crisis === 'no') return { plan: 'avoid-trigger-and-hydration' };
    return { plan: 'hydroxyurea-and-monitor' };
  },
  DVT: function (i) {
    const wells = (i.wells || 0);
    const dDimer = (i.dDimer || 0);
    if (wells >= 3 && dDimer === 'elevated') return { plan: 'anticoagulate-and-eval' };
    if (wells >= 3) return { plan: 'anticoagulate-and-compress-US' };
    if (wells < 3 && dDimer === 'normal') return { plan: 'DVT-excluded' };
    if (wells < 3 && dDimer === 'elevated') return { plan: 'compress-US-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
  AnticoagClinic: function (i) {
    const drug = (i.drug || 'warfarin');
    const inr = (i.inr || 2.5);
    const indication = (i.indication || 'AF');
    if (drug === 'warfarin' && inr > 3.5) return { plan: 'hold-and-recheck' };
    if (drug === 'warfarin' && inr < 1.8) return { plan: 'bridge-or-increase' };
    if (drug === 'warfarin' && inr >= 2 && inr <= 3) return { plan: 'continue-and-monitor' };
    if (drug === 'DOAC' && indication === 'AF') return { plan: 'continue-and-monitor' };
    if (drug === 'LMWH' && indication === 'cancer') return { plan: 'continue-and-eval-cancer' };
    return { plan: 'evaluate-and-monitor' };
  },
  Thrombocytopenia: function (i) {
    const plt = (i.plt || 200);
    const bleeding = (i.bleeding || 'no');
    const cause = (i.cause || 'unknown');
    if (plt < 20 && bleeding === 'yes') return { plan: 'transfuse-and-IVIG' };
    if (plt < 20) return { plan: 'transfuse-and-eval' };
    if (plt < 50 && cause === 'ITP') return { plan: 'steroid-and-IVIG' };
    if (plt < 50 && cause === 'HIT') return { plan: 'stop-heparin-and-argatroban' };
    if (plt < 50) return { plan: 'transfuse-if-bleeding-and-eval' };
    if (plt < 100) return { plan: 'monitor-and-eval-cause' };
    return { plan: 'no-action' };
  },
  Neutropenia: function (i) {
    const anc = (i.anc || 5);
    const fever = (i.fever || 'no');
    const risk = (i.risk || 'low');
    if (anc < 0.5 && fever === 'yes') return { plan: 'empiric-abx-and-admit' };
    if (anc < 0.5) return { plan: 'reverse-isolation-and-eval' };
    if (anc < 1 && fever === 'yes') return { plan: 'empiric-abx-and-admit' };
    if (anc < 1) return { plan: 'monitor-and-eval-cause' };
    if (anc < 2 && risk === 'high') return { plan: 'GCSF-and-eval' };
    if (anc < 2) return { plan: 'monitor-and-recheck' };
    return { plan: 'no-action' };
  },
  Transfusion: function (i) {
    const hgb = (i.hgb || 10);
    const symptom = (i.symptom || 'no');
    const setting = (i.setting || 'ward');
    if (hgb < 7 && symptom === 'yes') return { plan: 'transfuse-1-unit' };
    if (hgb < 7) return { plan: 'restrictive-transfuse' };
    if (hgb < 8 && setting === 'icu') return { plan: 'transfuse-1-unit' };
    if (hgb < 10 && setting === 'cardiac') return { plan: 'transfuse-1-unit' };
    if (hgb < 7 && setting === 'ward') return { plan: 'restrictive-transfuse' };
    return { plan: 'no-transfusion' };
  },
  Hypercoagulable: function (i) {
    const event = (i.event || 'unknown');
    const age = (i.age || 40);
    const family = (i.family || 'no');
    if (event === 'recurrent' && age < 50) return { plan: 'thrombophilia-workup-and-lifelong' };
    if (event === 'unprovoked' && age < 50) return { plan: 'thrombophilia-workup' };
    if (family === 'yes' && event === 'provoked') return { plan: 'thrombophilia-workup' };
    if (event === 'recurrent' && family === 'yes') return { plan: 'lifelong-anticoagulation' };
    if (event === 'unprovoked') return { plan: 'limited-workup-and-anticoagulate' };
    return { plan: 'no-workup' };
  },
  Myeloma: function (i) {
    const criteria = (i.criteria || 'no');
    const calcium = (i.calcium || 9);
    const cr = (i.cr || 1);
    if (criteria === 'CRAB' && cr > 2) return { plan: 'urgent-eval-and-treatment' };
    if (criteria === 'CRAB') return { plan: 'confirm-and-treatment' };
    if (criteria === 'MGUS' && calcium < 10.5) return { plan: 'monitor-every-3-6mo' };
    if (criteria === 'smoldering') return { plan: 'monitor-and-eval' };
    if (criteria === 'CRAB' && calcium < 10.5 && cr < 2) return { plan: 'staging-and-treatment' };
    return { plan: 'eval-and-monitor' };
  },
  BleedingDiath: function (i) {
    const ptt = (i.ptt || 30);
    const bleeding = (i.bleeding || 'no');
    const family = (i.family || 'no');
    if (ptt > 50 && bleeding === 'yes') return { plan: 'mixing-study-and-eval' };
    if (ptt > 50 && family === 'yes') return { plan: 'hemophilia-workup' };
    if (ptt > 50) return { plan: 'factor-deficiency-eval' };
    if (bleeding === 'yes' && family === 'yes') return { plan: 'vWD-workup' };
    if (bleeding === 'yes') return { plan: 'platelet-function-eval' };
    return { plan: 'no-workup' };
  },
};
module.exports = Engine;
