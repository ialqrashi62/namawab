// P3-DY pcc_colorectal_surgery_engine v3.89.0
'use strict';
function ColonCancerResection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'colonCancerResection-none';
  if (t === 'yes') plan = 'colonCancerResection-protocol';
  return { plan, t };
}
function RectalCancerTME(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rectalCancerTME-none';
  if (t === 'yes') plan = 'rectalCancerTME-protocol';
  return { plan, t };
}
function LowAnteriorResection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lowAnteriorResection-none';
  if (t === 'yes') plan = 'lowAnteriorResection-protocol';
  return { plan, t };
}
function HartmannProcedure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hartmannProcedure-none';
  if (t === 'yes') plan = 'hartmannProcedure-protocol';
  return { plan, t };
}
function DiverticulitisSurgery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'diverticulitisSurgery-none';
  if (t === 'yes') plan = 'diverticulitisSurgery-protocol';
  return { plan, t };
}
function IBDColectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'iBDColectomy-none';
  if (t === 'yes') plan = 'iBDColectomy-protocol';
  return { plan, t };
}
function ColostomyReversal(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'colostomyReversal-none';
  if (t === 'yes') plan = 'colostomyReversal-protocol';
  return { plan, t };
}
function AnalFissureSurgery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'analFissureSurgery-none';
  if (t === 'yes') plan = 'analFissureSurgery-protocol';
  return { plan, t };
}
function HemorrhoidectomyIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hemorrhoidectomyIndication-none';
  if (t === 'yes') plan = 'hemorrhoidectomyIndication-protocol';
  return { plan, t };
}
function RectalProlapseRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rectalProlapseRepair-none';
  if (t === 'yes') plan = 'rectalProlapseRepair-protocol';
  return { plan, t };
}
module.exports = { ColonCancerResection, RectalCancerTME, LowAnteriorResection, HartmannProcedure, DiverticulitisSurgery, IBDColectomy, ColostomyReversal, AnalFissureSurgery, HemorrhoidectomyIndication, RectalProlapseRepair };
