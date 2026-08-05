// P3_CR pcc_handoff_engine v3.56.0
'use strict';
function Ipass(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-IPASS';
  if (t === 'completed') plan = 'IPASS-handoff-completed';
  return { plan, t };
}
function Sbar(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-SBAR';
  if (t === 'used') plan = 'SBAR-handoff-used';
  return { plan, t };
}
function Shift(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-shift';
  if (t === 'change') plan = 'shift-change-handoff';
  return { plan, t };
}
function Discharge(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-dc-handoff';
  if (t === 'completed') plan = 'discharge-handoff-completed';
  return { plan, t };
}
function Icu(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ICU-handoff';
  if (t === 'completed') plan = 'ICU-admission-handoff';
  return { plan, t };
}
function Or(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-OR-handoff';
  if (t === 'completed') plan = 'OR-handoff-completed';
  return { plan, t };
}
function Er(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ER-handoff';
  if (t === 'completed') plan = 'ER-handoff-completed';
  return { plan, t };
}
function Anesthesia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-anes-handoff';
  if (t === 'completed') plan = 'anesthesia-handoff';
  return { plan, t };
}
function Primary(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-primary-handoff';
  if (t === 'called') plan = 'primary-paged';
  return { plan, t };
}
function Receiving(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-receiving-handoff';
  if (t === 'accepted') plan = 'receiving-team-accepted';
  return { plan, t };
}
module.exports = {
  Ipass, Sbar, Shift, Discharge, Icu, Or, Er, Anesthesia, Primary, Receiving
};
