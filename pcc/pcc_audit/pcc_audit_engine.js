// P3-CA pcc_audit_engine.js — 10 pure functions
const Engine = {
  Log: function (i) {
    const severity = (i.severity || 'info');
    if (severity === 'error') return { plan: 'persist-and-alert' };
    if (severity === 'warn') return { plan: 'persist' };
    return { plan: 'persist-and-sample' };
  },
  Compliance: function (i) {
    const event = (i.event || 'view');
    if (event === 'export') return { plan: 'compliance-export' };
    if (event === 'print') return { plan: 'compliance-print' };
    if (event === 'view') return { plan: 'compliance-view' };
    return { plan: 'compliance-typed' };
  },
  Retention: function (i) {
    const years = (i.years || 7);
    if (years >= 10) return { plan: 'retain-10y' };
    if (years >= 7) return { plan: 'retain-7y' };
    return { plan: 'retain-3y' };
  },
  Hash: function (i) {
    const prev = (i.prev || '');
    const curr = (i.curr || '');
    if (prev && curr && prev === curr) return { plan: 'chain-valid' };
    if (prev && curr) return { plan: 'chain-broken' };
    return { plan: 'chain-init' };
  },
  Search: function (i) {
    const query = (i.query || '');
    if (query.length < 2) return { plan: 'too-short' };
    if (query.length > 100) return { plan: 'too-long' };
    return { plan: 'fulltext-search' };
  },
  Filter: function (i) {
    const user = (i.user || 'all');
    if (user === 'all') return { plan: 'no-filter' };
    return { plan: 'user-filter' };
  },
  Range: function (i) {
    const days = (i.days || 30);
    if (days > 365) return { plan: 'archive-query' };
    if (days > 90) return { plan: 'wide-range' };
    return { plan: 'recent-range' };
  },
  Export: function (i) {
    const format = (i.format || 'csv');
    if (format === 'csv') return { plan: 'export-csv' };
    if (format === 'json') return { plan: 'export-json' };
    if (format === 'pdf') return { plan: 'export-pdf' };
    return { plan: 'export-default' };
  },
  Alert: function (i) {
    const level = (i.level || 'low');
    if (level === 'critical') return { plan: 'page-on-call' };
    if (level === 'high') return { plan: 'email-and-log' };
    if (level === 'medium') return { plan: 'log-and-ticket' };
    return { plan: 'log-only' };
  },
  Quota: function (i) {
    const used = (i.used || 0);
    const limit = (i.limit || 1000);
    if (used >= limit) return { plan: 'quota-exceeded' };
    if (used >= limit * 0.9) return { plan: 'quota-warn' };
    return { plan: 'quota-ok' };
  },
};
module.exports = Engine;
