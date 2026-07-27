// P3-CC pcc_decision_engine.js — 10 pure functions
const Engine = {
  Triage: function (i) {
    const level = (i.level || 3);
    if (level === 1) return { plan: 'resus-immediate' };
    if (level === 2) return { plan: 'urgent-eval' };
    if (level === 3) return { plan: 'standard-eval' };
    return { plan: 'non-urgent' };
  },
  Risk: function (i) {
    const score = (i.score || 5);
    if (score >= 80) return { plan: 'high-risk' };
    if (score >= 50) return { plan: 'moderate-risk' };
    if (score >= 20) return { plan: 'low-risk' };
    return { plan: 'minimal-risk' };
  },
  Recommendation: function (i) {
    const conf = (i.conf || 0.5);
    if (conf >= 0.9) return { plan: 'strong-recommend' };
    if (conf >= 0.7) return { plan: 'recommend' };
    if (conf >= 0.5) return { plan: 'consider' };
    return { plan: 'low-confidence' };
  },
  Differential: function (i) {
    const top = (i.top || 'unknown');
    if (top === 'urgent') return { plan: 'rule-out-emergency' };
    if (top === 'serious') return { plan: 'rule-out-serious' };
    return { plan: 'workup-and-eval' };
  },
  Path: function (i) {
    const step = (i.step || 1);
    if (step >= 5) return { plan: 'long-path' };
    if (step >= 3) return { plan: 'medium-path' };
    return { plan: 'short-path' };
  },
  Severity: function (i) {
    const sev = (i.sev || 'mild');
    if (sev === 'severe') return { plan: 'urgent-care' };
    if (sev === 'moderate') return { plan: 'standard-care' };
    return { plan: 'mild-care' };
  },
  Outcome: function (i) {
    const prob = (i.prob || 0.5);
    if (prob >= 0.8) return { plan: 'likely-favorable' };
    if (prob >= 0.5) return { plan: 'possible-favorable' };
    return { plan: 'guarded-prognosis' };
  },
  FollowUp: function (i) {
    const urgency = (i.urgency || 'routine');
    if (urgency === '24h') return { plan: 'follow-up-24h' };
    if (urgency === '1w') return { plan: 'follow-up-1w' };
    if (urgency === '1m') return { plan: 'follow-up-1m' };
    return { plan: 'follow-up-routine' };
  },
  Test: function (i) {
    const type = (i.type || 'lab');
    if (type === 'imaging') return { plan: 'order-imaging' };
    if (type === 'lab') return { plan: 'order-lab' };
    if (type === 'biopsy') return { plan: 'order-biopsy' };
    return { plan: 'order-default' };
  },
  Therapy: function (i) {
    const type = (i.type || 'medication');
    if (type === 'surgical') return { plan: 'schedule-surgery' };
    if (type === 'medication') return { plan: 'prescribe-med' };
    if (type === 'therapy') return { plan: 'refer-therapy' };
    return { plan: 'observe-and-monitor' };
  },
};
module.exports = Engine;
