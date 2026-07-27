// P3-CB pcc_workflow_engine.js — 10 pure functions
const Engine = {
  State: function (i) {
    const state = (i.state || 'pending');
    if (state === 'pending') return { plan: 'awaiting-approval' };
    if (state === 'approved') return { plan: 'ready-to-execute' };
    if (state === 'rejected') return { plan: 'notify-and-archive' };
    if (state === 'completed') return { plan: 'archive-and-close' };
    return { plan: 'unknown-state' };
  },
  Transition: function (i) {
    const from = (i.from || 'pending');
    const to = (i.to || 'pending');
    if (from === 'pending' && to === 'approved') return { plan: 'valid-transition' };
    if (from === 'approved' && to === 'rejected') return { plan: 'valid-transition' };
    if (from === 'approved' && to === 'completed') return { plan: 'valid-transition' };
    return { plan: 'invalid-transition' };
  },
  Assignment: function (i) {
    const role = (i.role || 'doctor');
    if (role === 'doctor') return { plan: 'assign-to-doctor' };
    if (role === 'nurse') return { plan: 'assign-to-nurse' };
    if (role === 'tech') return { plan: 'assign-to-tech' };
    return { plan: 'unassigned' };
  },
  Escalation: function (i) {
    const level = (i.level || 'low');
    if (level === 'critical') return { plan: 'escalate-immediate' };
    if (level === 'high') return { plan: 'escalate-1hr' };
    if (level === 'medium') return { plan: 'escalate-4hr' };
    return { plan: 'no-escalation' };
  },
  Notify: function (i) {
    const channel = (i.channel || 'email');
    if (channel === 'sms') return { plan: 'send-sms' };
    if (channel === 'email') return { plan: 'send-email' };
    if (channel === 'push') return { plan: 'send-push' };
    return { plan: 'no-notify' };
  },
  Approval: function (i) {
    const level = (i.level || 'single');
    if (level === 'dual') return { plan: 'dual-approval' };
    if (level === 'single') return { plan: 'single-approval' };
    return { plan: 'auto-approval' };
  },
  Schedule: function (i) {
    const type = (i.type || 'one-time');
    if (type === 'recurring') return { plan: 'cron-schedule' };
    if (type === 'one-time') return { plan: 'one-time-job' };
    return { plan: 'immediate' };
  },
  Queue: function (i) {
    const priority = (i.priority || 'normal');
    if (priority === 'urgent') return { plan: 'queue-front' };
    if (priority === 'high') return { plan: 'queue-near-front' };
    return { plan: 'queue-back' };
  },
  Timeout: function (i) {
    const hours = (i.hours || 24);
    if (hours <= 1) return { plan: 'expire-soon' };
    if (hours <= 24) return { plan: 'expire-1d' };
    return { plan: 'expire-future' };
  },
  Batch: function (i) {
    const count = (i.count || 10);
    if (count >= 100) return { plan: 'batch-large' };
    if (count >= 10) return { plan: 'batch-medium' };
    return { plan: 'batch-small' };
  },
};
module.exports = Engine;
