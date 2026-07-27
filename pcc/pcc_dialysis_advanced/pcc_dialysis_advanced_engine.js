// P3-DN pcc_dialysis_advanced_engine v3.78.0
'use strict';
function HemodialysisAccess(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hemodialysisaccess-none';
  if (t === 'yes') plan = 'hemodialysisaccess-protocol';
  return { plan, t };
}
function DialysisAdequacy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dialysisadequacy-none';
  if (t === 'yes') plan = 'dialysisadequacy-protocol';
  return { plan, t };
}
function IntradialyticHypotension(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'intradialytichypotension-none';
  if (t === 'yes') plan = 'intradialytichypotension-protocol';
  return { plan, t };
}
function DialysisDisequilibrium(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dialysisdisequilibrium-none';
  if (t === 'yes') plan = 'dialysisdisequilibrium-protocol';
  return { plan, t };
}
function PeritonealDialysisPrescription(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'peritonealdialysisprescription-none';
  if (t === 'yes') plan = 'peritonealdialysisprescription-protocol';
  return { plan, t };
}
function PDPeritonitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pdperitonitis-none';
  if (t === 'yes') plan = 'pdperitonitis-protocol';
  return { plan, t };
}
function HomeHemodialysis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'homehemodialysis-none';
  if (t === 'yes') plan = 'homehemodialysis-protocol';
  return { plan, t };
}
function NocturnalDialysis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nocturnaldialysis-none';
  if (t === 'yes') plan = 'nocturnaldialysis-protocol';
  return { plan, t };
}
function DialysisNutrition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dialysisnutrition-none';
  if (t === 'yes') plan = 'dialysisnutrition-protocol';
  return { plan, t };
}
function TransplantReadiness(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'transplantreadiness-none';
  if (t === 'yes') plan = 'transplantreadiness-protocol';
  return { plan, t };
}
module.exports = {
  HemodialysisAccess, DialysisAdequacy, IntradialyticHypotension, DialysisDisequilibrium, PeritonealDialysisPrescription, PDPeritonitis, HomeHemodialysis, NocturnalDialysis, DialysisNutrition, TransplantReadiness
};
