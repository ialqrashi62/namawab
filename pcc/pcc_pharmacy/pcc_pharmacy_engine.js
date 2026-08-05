// P3_CG pcc_pharmacy_engine v3.45.0
'use strict';
function Dispense(input) {
  const i = input || {};
  const days = Number(i.days ?? 0);
  let plan = 'as-needed';
  if (days >= 30) plan = '30-day-supply';
  else if (days >= 7) plan = '7-day-supply';
  else if (days > 0) plan = 'short-supply';
  return { plan, days };
}
function Interaction(input) {
  const i = input || {};
  const level = String(i.level || '');
  let plan = 'no-interaction';
  if (level === 'major') plan = 'contraindicated';
  else if (level === 'moderate') plan = 'monitor-required';
  else if (level === 'minor') plan = 'minor-caution';
  return { plan, level };
}
function Allergy(input) {
  const i = input || {};
  const sev = String(i.sev || '');
  let plan = 'no-known';
  if (sev === 'anaphylaxis') plan = 'absolute-contraindication';
  else if (sev === 'rash') plan = 'document-and-monitor';
  return { plan, sev };
}
function DoseCheck(input) {
  const i = input || {};
  const crcl = Number(i.crcl ?? 0);
  let plan = 'standard-dose';
  if (crcl < 30) plan = 'renal-dose-reduce';
  else if (crcl < 50) plan = 'renal-dose-caution';
  return { plan, crcl };
}
function Refill(input) {
  const i = input || {};
  const cnt = Number(i.cnt ?? 0);
  let plan = 'no-refill';
  if (cnt >= 5) plan = '5-refills';
  else if (cnt >= 1) plan = 'partial-refills';
  return { plan, cnt };
}
function Compounding(input) {
  const i = input || {};
  const sterility = String(i.sterile || '');
  let plan = 'simple-compound';
  if (sterility === 'sterile') plan = 'sterile-compounding-ISO5';
  else if (sterility === 'usp800') plan = 'USP800-hazardous';
  return { plan, sterility };
}
function Narcotic(input) {
  const i = input || {};
  const sched = String(i.sched || '');
  let plan = 'non-controlled';
  if (sched === 'II') plan = 'CII-no-refill';
  else if (sched === 'III') plan = 'CIII-5-refills';
  else if (sched === 'IV') plan = 'CIV-5-refills';
  return { plan, sched };
}
function IVAdmixture(input) {
  const i = input || {};
  const t = String(i.type || '');
  let plan = 'oral-med';
  if (t === 'IVP') plan = 'IV-push';
  else if (t === 'IVPB') plan = 'IV-piggyback';
  else if (t === 'TPN') plan = 'TPN-compound';
  return { plan, t };
}
function Formulary(input) {
  const i = input || {};
  const status = String(i.status || '');
  let plan = 'formulary';
  if (status === 'non-formulary') plan = 'non-formulary-PA-required';
  else if (status === 'restricted') plan = 'restricted-use';
  return { plan, status };
}
function Counseling(input) {
  const i = input || {};
  const lang = String(i.lang || '');
  let plan = 'standard-counseling';
  if (lang === 'limited') plan = 'interpreter-required';
  return { plan, lang };
}
module.exports = {
  Dispense, Interaction, Allergy, DoseCheck, Refill, Compounding, Narcotic, IVAdmixture, Formulary, Counseling
};
