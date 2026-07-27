// P3-DQ pcc_dermatology_advanced_engine v3.81.0
'use strict';
function PsoriasisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'psoriasisadvanced-none';
  if (t === 'yes') plan = 'psoriasisadvanced-protocol';
  return { plan, t };
}
function AtopicDermatitisSevere(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'atopicdermatitissevere-none';
  if (t === 'yes') plan = 'atopicdermatitissevere-protocol';
  return { plan, t };
}
function AcneRefractory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'acnerefractory-none';
  if (t === 'yes') plan = 'acnerefractory-protocol';
  return { plan, t };
}
function RosaceaAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rosaceaadvanced-none';
  if (t === 'yes') plan = 'rosaceaadvanced-protocol';
  return { plan, t };
}
function HidradenitisSuppurativa(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hidradenitissuppurativa-none';
  if (t === 'yes') plan = 'hidradenitissuppurativa-protocol';
  return { plan, t };
}
function CutaneousLymphoma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cutaneouslymphoma-none';
  if (t === 'yes') plan = 'cutaneouslymphoma-protocol';
  return { plan, t };
}
function AutoimmuneBlistering(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autoimmuneblistering-none';
  if (t === 'yes') plan = 'autoimmuneblistering-protocol';
  return { plan, t };
}
function MelanomaAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'melanomaadvanced-none';
  if (t === 'yes') plan = 'melanomaadvanced-protocol';
  return { plan, t };
}
function DermatomyositisSkin(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dermatomyositisskin-none';
  if (t === 'yes') plan = 'dermatomyositisskin-protocol';
  return { plan, t };
}
function VascularAnomalies(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vascularanomalies-none';
  if (t === 'yes') plan = 'vascularanomalies-protocol';
  return { plan, t };
}
module.exports = {
  PsoriasisAdvanced, AtopicDermatitisSevere, AcneRefractory, RosaceaAdvanced, HidradenitisSuppurativa, CutaneousLymphoma, AutoimmuneBlistering, MelanomaAdvanced, DermatomyositisSkin, VascularAnomalies
};
