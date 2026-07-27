// P3-DS pcc_cath_lab_specialized_engine v3.83.0
'use strict';
function CTOScoreJCTO(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ctoscorejcto-none';
  if (t === 'yes') plan = 'ctoscorejcto-protocol';
  return { plan, t };
}
function SyntaxScore(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'syntaxscore-none';
  if (t === 'yes') plan = 'syntaxscore-protocol';
  return { plan, t };
}
function CalciumScoreIVUS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'calciumscoreivus-none';
  if (t === 'yes') plan = 'calciumscoreivus-protocol';
  return { plan, t };
}
function FFRiFRAnalysis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ffrifranalysis-none';
  if (t === 'yes') plan = 'ffrifranalysis-protocol';
  return { plan, t };
}
function BifurcationMedina(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bifurcationmedina-none';
  if (t === 'yes') plan = 'bifurcationmedina-protocol';
  return { plan, t };
}
function PerforationEllis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'perforationellis-none';
  if (t === 'yes') plan = 'perforationellis-protocol';
  return { plan, t };
}
function RotablationBurr(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rotablationburr-none';
  if (t === 'yes') plan = 'rotablationburr-protocol';
  return { plan, t };
}
function IVLDelivery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ivldelivery-none';
  if (t === 'yes') plan = 'ivldelivery-protocol';
  return { plan, t };
}
function NoReflowPredict(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'noreflowpredict-none';
  if (t === 'yes') plan = 'noreflowpredict-protocol';
  return { plan, t };
}
function CoronaryDissectionType(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'coronarydissectiontype-none';
  if (t === 'yes') plan = 'coronarydissectiontype-protocol';
  return { plan, t };
}
module.exports = {
  CTOScoreJCTO, SyntaxScore, CalciumScoreIVUS, FFRiFRAnalysis, BifurcationMedina, PerforationEllis, RotablationBurr, IVLDelivery, NoReflowPredict, CoronaryDissectionType
};
