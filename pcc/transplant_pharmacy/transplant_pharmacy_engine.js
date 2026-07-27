// P3-BH transplant_pharmacy_engine.js — 10 pure functions
const Engine = {
  TacLevel: function (i) {
    const level = (i.level || 8);
    const months = (i.months || 6);
    if (months < 3) {
      if (level < 8) return { plan: 'increase-tac-dose' };
      if (level > 12) return { plan: 'decrease-tac-dose' };
      return { plan: 'target-tac-level-8-12' };
    }
    if (months >= 12) {
      if (level < 3) return { plan: 'increase-tac-dose' };
      if (level > 6) return { plan: 'decrease-tac-dose' };
      return { plan: 'target-tac-level-3-6' };
    }
    if (level < 5) return { plan: 'increase-tac-dose' };
    if (level > 8) return { plan: 'decrease-tac-dose' };
    return { plan: 'target-tac-level-5-8' };
  },
  MMFDose: function (i) {
    const wbc = (i.wbc || 5);
    const anc = (i.anc || 3);
    const gi = (i.gi || 'mild');
    if (anc < 1) return { plan: 'hold-MMF-until-ANC-1500' };
    if (wbc < 3) return { plan: 'reduce-MMF-dose' };
    if (gi === 'severe') return { plan: 'switch-MMF-to-mTOR-or-EC-MPS' };
    if (gi === 'moderate') return { plan: 'reduce-MMF-and-symptomatic' };
    return { plan: 'continue-MMF-1g-BID' };
  },
  SteroidTaper: function (i) {
    const days = (i.days || 0);
    const rejection = (i.rejection || 'no');
    if (rejection === 'recent') return { plan: 'maintain-steroid-and-slow-taper' };
    if (days < 7) return { plan: 'pulse-methylpred-and-taper' };
    if (days < 30) return { plan: 'prednisone-20mg-and-taper' };
    if (days < 90) return { plan: 'prednisone-5mg-and-taper' };
    if (days < 180) return { plan: 'prednisone-2.5mg-and-continue' };
    return { plan: 'wean-steroid-when-stable' };
  },
  ValcyteCMV: function (i) {
    const serostatus = (i.serostatus || 'D+R-');
    const months = (i.months || 0);
    const wbc = (i.wbc || 5);
    if (serostatus === 'D+R-') {
      if (months < 6) return { plan: 'valcyte-6mo-and-CMV-PCR' };
      return { plan: 'valcyte-complete-and-PCR-monitor' };
    }
    if (serostatus === 'D+R+') {
      if (months < 3) return { plan: 'valcyte-3mo-and-PCR' };
      return { plan: 'valcyte-complete-and-monitor' };
    }
    if (serostatus === 'D-R+') {
      if (wbc < 3) return { plan: 'reduce-valcyte-or-hold' };
      return { plan: 'valcyte-3mo-and-PCR' };
    }
    return { plan: 'no-prophylaxis-needed' };
  },
  BactrimPCP: function (i) {
    const months = (i.months || 0);
    const sulfa = (i.sulfa || 'tolerated');
    if (months < 12 && sulfa === 'tolerated') return { plan: 'bactrim-SS-daily' };
    if (months < 12 && sulfa === 'allergy') return { plan: 'atovaquone-or-dapsone' };
    if (months >= 12) return { plan: 'bactrim-complete-and-monitor' };
    return { plan: 'bactrim-and-reassess' };
  },
  Antifungal: function (i) {
    const organ = (i.organ || 'kidney');
    const risk = (i.risk || 'low');
    if (organ === 'lung') return { plan: 'azole-12mo-and-therapeutic-DL' };
    if (risk === 'high') return { plan: 'azole-3mo-and-therapeutic-DL' };
    if (organ === 'liver') return { plan: 'fluconazole-3mo' };
    return { plan: 'no-routine-prophylaxis' };
  },
  DrugInteraction: function (i) {
    const cyp = (i.cyp || 'none');
    const statin = (i.statin || 'none');
    if (cyp === 'azole' && statin === 'simvastatin') return { plan: 'switch-statin-to-pravastatin' };
    if (cyp === 'macrolide' && statin === 'simvastatin') return { plan: 'switch-statin-or-azithromycin' };
    if (cyp === 'azole') return { plan: 'azole-and-tac-level-increase' };
    if (cyp === 'macrolide') return { plan: 'macrolide-and-tac-level-increase' };
    return { plan: 'no-significant-interaction' };
  },
  AdherenceMonitor: function (i) {
    const missed = (i.missed || 0);
    const days = (i.days || 30);
    const rate = 1 - missed / days;
    if (rate < 0.7) return { plan: 'poor-adherence-and-case-management' };
    if (rate < 0.85) return { plan: 'suboptimal-adherence-and-counsel' };
    if (rate < 0.95) return { plan: 'good-adherence-and-reinforce' };
    return { plan: 'excellent-adherence-and-continue' };
  },
  SideEffectMgmt: function (i) {
    const se = (i.se || 'none');
    const severity = (i.severity || 'mild');
    if (se === 'tac-nephrotoxicity' && severity === 'severe') return { plan: 'tac-reduction-and-switch-mTOR' };
    if (se === 'tac-nephrotoxicity') return { plan: 'tac-reduction-and-monitor' };
    if (se === 'tac-tremor') return { plan: 'tac-reduction-and-magnesium' };
    if (se === 'MMF-GI' && severity === 'severe') return { plan: 'switch-MMF-to-EC-MPS' };
    if (se === 'MMF-bone-marrow') return { plan: 'reduce-MMF-and-monitor-CBC' };
    if (se === 'stero-idDM') return { plan: 'taper-steroid-and-endocrine-eval' };
    return { plan: 'monitor-and-evaluate' };
  },
  TherapeuticDrugMonitor: function (i) {
    const organ = (i.organ || 'kidney');
    const months = (i.months || 0);
    const drug = (i.drug || 'tac');
    if (drug === 'tac' && organ === 'kidney' && months < 3) return { plan: 'tac-level-every-2-weeks' };
    if (drug === 'tac' && organ === 'kidney' && months < 12) return { plan: 'tac-level-monthly' };
    if (drug === 'tac' && organ === 'kidney') return { plan: 'tac-level-every-3-months' };
    if (drug === 'CsA' && organ === 'heart') return { plan: 'CsA-C0-and-C2-monthly' };
    if (drug === 'mTOR') return { plan: 'mTOR-level-monthly-and-lipids' };
    return { plan: 'drug-level-as-indicated' };
  },
};
module.exports = Engine;
