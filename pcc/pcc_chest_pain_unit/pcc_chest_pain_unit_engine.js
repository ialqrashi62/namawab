// P3-DT pcc_chest_pain_unit_engine v3.84.0
'use strict';
function HEARTPathway(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hEARTPathway-none';
  if (t === 'yes') plan = 'hEARTPathway-protocol';
  return { plan, t };
}
function GRACEACS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gRACEACS-none';
  if (t === 'yes') plan = 'gRACEACS-protocol';
  return { plan, t };
}
function TIMIScore(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tIMIScore-none';
  if (t === 'yes') plan = 'tIMIScore-protocol';
  return { plan, t };
}
function WellensCriteria(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'wellensCriteria-none';
  if (t === 'yes') plan = 'wellensCriteria-protocol';
  return { plan, t };
}
function DukeTreadmillScore(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dukeTreadmillScore-none';
  if (t === 'yes') plan = 'dukeTreadmillScore-protocol';
  return { plan, t };
}
function ChestPainRiskStrat(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chestPainRiskStrat-none';
  if (t === 'yes') plan = 'chestPainRiskStrat-protocol';
  return { plan, t };
}
function HsTroponinRuleOut(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hsTroponinRuleOut-none';
  if (t === 'yes') plan = 'hsTroponinRuleOut-protocol';
  return { plan, t };
}
function CoronaryCalciumScore(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'coronaryCalciumScore-none';
  if (t === 'yes') plan = 'coronaryCalciumScore-protocol';
  return { plan, t };
}
function PrinzmetalAngina(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'prinzmetalAngina-none';
  if (t === 'yes') plan = 'prinzmetalAngina-protocol';
  return { plan, t };
}
function AorticDissectionRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aorticDissectionRisk-none';
  if (t === 'yes') plan = 'aorticDissectionRisk-protocol';
  return { plan, t };
}
module.exports = { HEARTPathway, GRACEACS, TIMIScore, WellensCriteria, DukeTreadmillScore, ChestPainRiskStrat, HsTroponinRuleOut, CoronaryCalciumScore, PrinzmetalAngina, AorticDissectionRisk };
