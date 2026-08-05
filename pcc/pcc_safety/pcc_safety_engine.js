// P3_CR pcc_safety_engine v3.56.0
'use strict';
function Fall(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-fall';
  if (t === 'high-risk') plan = 'high-fall-risk';
  else if (t === 'event') plan = 'fall-event';
  return { plan, t };
}
function Restraint(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-restraint';
  if (t === 'violent') plan = 'violent-restraint';
  return { plan, t };
}
function Suicide(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-suicide';
  if (t === 'high-risk') plan = 'suicide-high-risk';
  return { plan, t };
}
function Elopement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-elopement';
  if (t === 'high-risk') plan = 'elopement-risk';
  return { plan, t };
}
function Mislabel(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-mislabel';
  if (t === 'detected') plan = 'specimen-mislabel';
  return { plan, t };
}
function WrongPt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-wrong-pt';
  if (t === 'event') plan = 'wrong-patient-event';
  return { plan, t };
}
function Fire(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-fire';
  if (t === 'high-risk') plan = 'fire-risk';
  return { plan, t };
}
function Radiation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-radiation';
  if (t === 'high') plan = 'radiation-high-dose';
  return { plan, t };
}
function Sharps(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-sharps';
  if (t === 'injury') plan = 'sharps-injury';
  return { plan, t };
}
function Hazard(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hazard';
  if (t === 'chemical') plan = 'chemical-hazard';
  return { plan, t };
}
module.exports = {
  Fall, Restraint, Suicide, Elopement, Mislabel, WrongPt, Fire, Radiation, Sharps, Hazard
};
