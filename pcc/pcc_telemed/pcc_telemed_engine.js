// P3_CF pcc_telemed_engine v3.44.0
'use strict';
function Visit(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'audio-only';
  if (type === 'video') plan = 'video-visit';
  else if (type === 'asynchronous') plan = 'store-and-forward';
  else if (type === 'hybrid') plan = 'hybrid-visit';
  return { plan, type };
}
function Consent(input) {
  const i = input || {};
  const kind = String(i.kind || '');
  let plan = 'verbal-consent';
  if (kind === 'written') plan = 'e-consent-signed';
  else if (kind === 'implied') plan = 'implied-consent';
  return { plan, kind };
}
function Connection(input) {
  const i = input || {};
  const quality = String(i.q || '');
  let plan = 'audio-fallback';
  if (quality === 'hd') plan = 'HD-video-connection';
  else if (quality === 'sd') plan = 'SD-video-connection';
  else if (quality === 'low') plan = 'audio-only-fallback';
  return { plan, quality };
}
function Prescribe(input) {
  const i = input || {};
  const ctl = String(i.ctl || '');
  let plan = 'standard-rx';
  if (ctl === 'controlled') plan = 'DEA-controlled-rx';
  else if (ctl === 'non') plan = 'OTC-recommend';
  return { plan, ctl };
}
function Charting(input) {
  const i = input || {};
  const dur = Number(i.dur ?? 0);
  let plan = 'quick-note';
  if (dur >= 30) plan = 'detailed-note';
  else if (dur >= 10) plan = 'standard-note';
  return { plan, dur };
}
function Triage(input) {
  const i = input || {};
  const ac = Number(i.ac ?? 5);
  let plan = 'self-care';
  if (ac === 1) plan = 'ED-referral';
  else if (ac === 2) plan = 'urgent-telemed';
  else if (ac === 3) plan = 'telemed-today';
  else if (ac === 4) plan = 'telemed-week';
  return { plan, ac };
}
function Reimburse(input) {
  const i = input || {};
  const src = String(i.src || '');
  let plan = 'self-pay';
  if (src === 'medicare') plan = 'medicare-telemed-parity';
  else if (src === 'medicaid') plan = 'medicaid-telemed';
  else if (src === 'commercial') plan = 'commercial-telemed';
  return { plan, src };
}
function Platform(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'consumer-app';
  if (type === 'hipaa') plan = 'HIPAA-platform';
  else if (type === 'enterprise') plan = 'enterprise-EMR-integrated';
  return { plan, type };
}
function FollowUp(input) {
  const i = input || {};
  const d = Number(i.d ?? 0);
  let plan = 'no-followup';
  if (d <= 1) plan = 'next-day-FU';
  else if (d <= 7) plan = 'one-week-FU';
  else if (d <= 30) plan = 'one-month-FU';
  return { plan, d };
}
function Audit(input) {
  const i = input || {};
  const fy = String(i.fy || '');
  let plan = 'standard-log';
  if (fy === 'HIPAA') plan = 'HIPAA-audit-log';
  else if (fy === 'state') plan = 'state-board-audit';
  return { plan, fy };
}
module.exports = {
  Visit, Consent, Connection, Prescribe, Charting, Triage, Reimburse, Platform, FollowUp, Audit
};
