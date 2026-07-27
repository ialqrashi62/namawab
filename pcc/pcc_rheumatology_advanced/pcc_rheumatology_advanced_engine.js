// P3-DP pcc_rheumatology_advanced_engine v3.80.0
'use strict';
function RheumatoidArthritisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rheumatoidarthritisadvanced-none';
  if (t === 'yes') plan = 'rheumatoidarthritisadvanced-protocol';
  return { plan, t };
}
function SLEFlareManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sleflaremanagement-none';
  if (t === 'yes') plan = 'sleflaremanagement-protocol';
  return { plan, t };
}
function SpondyloarthritisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spondyloarthritisadvanced-none';
  if (t === 'yes') plan = 'spondyloarthritisadvanced-protocol';
  return { plan, t };
}
function GoutRefractory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'goutrefractory-none';
  if (t === 'yes') plan = 'goutrefractory-protocol';
  return { plan, t };
}
function VasculitisWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vasculitisworkup-none';
  if (t === 'yes') plan = 'vasculitisworkup-protocol';
  return { plan, t };
}
function OsteoporosisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'osteoporosisadvanced-none';
  if (t === 'yes') plan = 'osteoporosisadvanced-protocol';
  return { plan, t };
}
function MyositisEvaluation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'myositisevaluation-none';
  if (t === 'yes') plan = 'myositisevaluation-protocol';
  return { plan, t };
}
function SjogrenAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sjogrenadvanced-none';
  if (t === 'yes') plan = 'sjogrenadvanced-protocol';
  return { plan, t };
}
function SystemicSclerosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'systemicsclerosis-none';
  if (t === 'yes') plan = 'systemicsclerosis-protocol';
  return { plan, t };
}
function AutoinflammatoryDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autoinflammatorydisease-none';
  if (t === 'yes') plan = 'autoinflammatorydisease-protocol';
  return { plan, t };
}
module.exports = {
  RheumatoidArthritisAdvanced, SLEFlareManagement, SpondyloarthritisAdvanced, GoutRefractory, VasculitisWorkup, OsteoporosisAdvanced, MyositisEvaluation, SjogrenAdvanced, SystemicSclerosis, AutoinflammatoryDisease
};
