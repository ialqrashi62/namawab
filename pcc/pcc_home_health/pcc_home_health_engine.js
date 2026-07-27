// P3-CP pcc_home_health_engine v3.54.0
'use strict';
function Intake(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-intake';
  if (t === 'skilled-nursing') plan = 'skilled-nursing-intake';
  return { plan, t };
}
function Wound(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-wound';
  if (t === 'stage-IV') plan = 'stage-IV-wound';
  return { plan, t };
}
function IvTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-IV';
  if (t === 'PICC') plan = 'PICC-line-care';
  return { plan, t };
}
function Therapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-therapy';
  if (t === 'PT') plan = 'PT-eval';
  return { plan, t };
}
function MedAdmin(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-med';
  if (t === 'complex') plan = 'complex-med-administration';
  return { plan, t };
}
function Tele(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-tele';
  if (t === 'monitoring') plan = 'tele-monitoring';
  return { plan, t };
}
function Falls(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-fall';
  if (t === 'high-risk') plan = 'high-fall-risk';
  return { plan, t };
}
function Caregiver(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-caregiver';
  if (t === 'burnout') plan = 'caregiver-burnout';
  return { plan, t };
}
function Discharge(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-discharge';
  if (t === 'stable') plan = 'home-health-discharge';
  return { plan, t };
}
function AdmitHome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-admit';
  if (t === 'urgent') plan = 'urgent-home-admit';
  return { plan, t };
}
module.exports = {
  Intake, Wound, IvTherapy, Therapy, MedAdmin, Tele, Falls, Caregiver, Discharge, AdmitHome
};
