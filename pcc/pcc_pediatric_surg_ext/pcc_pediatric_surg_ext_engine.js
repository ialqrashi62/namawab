// P3_EM pcc_pediatric_surg_ext_engine v3.103.0
'use strict';
function PediatricLaparoscopic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLaparoscopic-none';
  if (t === 'yes') plan = 'pediatricLaparoscopic-protocol';
  return { plan, t };
}
function PediatricRoboticSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRoboticSurg-none';
  if (t === 'yes') plan = 'pediatricRoboticSurg-protocol';
  return { plan, t };
}
function PediatricEndoscopic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEndoscopic-none';
  if (t === 'yes') plan = 'pediatricEndoscopic-protocol';
  return { plan, t };
}
function PediatricFetalSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricFetalSurg-none';
  if (t === 'yes') plan = 'pediatricFetalSurg-protocol';
  return { plan, t };
}
function PediatricMinimallyInvasive(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMinimallyInvasive-none';
  if (t === 'yes') plan = 'pediatricMinimallyInvasive-protocol';
  return { plan, t };
}
function PediatricDaySurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDaySurg-none';
  if (t === 'yes') plan = 'pediatricDaySurg-protocol';
  return { plan, t };
}
function PediatricAmbulatorySurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAmbulatorySurg-none';
  if (t === 'yes') plan = 'pediatricAmbulatorySurg-protocol';
  return { plan, t };
}
function PediatricSameDayDischarge(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSameDayDischarge-none';
  if (t === 'yes') plan = 'pediatricSameDayDischarge-protocol';
  return { plan, t };
}
function PediatricPreOpEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPreOpEval-none';
  if (t === 'yes') plan = 'pediatricPreOpEval-protocol';
  return { plan, t };
}
function PediatricPostOpCare(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPostOpCare-none';
  if (t === 'yes') plan = 'pediatricPostOpCare-protocol';
  return { plan, t };
}
module.exports = { PediatricLaparoscopic, PediatricRoboticSurg, PediatricEndoscopic, PediatricFetalSurg, PediatricMinimallyInvasive, PediatricDaySurg, PediatricAmbulatorySurg, PediatricSameDayDischarge, PediatricPreOpEval, PediatricPostOpCare };
