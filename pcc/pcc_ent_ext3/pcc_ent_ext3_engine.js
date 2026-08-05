// P3_CO pcc_ent_ext3_engine v3.53.0
'use strict';
function Hearing(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'normal-hearing';
  if (t === 'conductive') plan = 'conductive-loss';
  else if (t === 'sensorineural') plan = 'SNHL-workup';
  return { plan, t };
}
function Ottis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-OM';
  if (t === 'acute') plan = 'acute-OM-antibiotics';
  else if (t === 'effusion') plan = 'OME-monitor';
  return { plan, t };
}
function Sinusitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-sinusitis';
  if (t === 'acute') plan = 'acute-sinusitis';
  else if (t === 'chronic') plan = 'chronic-sinusitis';
  return { plan, t };
}
function Tonsil(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-tonsil-issue';
  if (t === 'recurrent') plan = 'recurrent-tonsillitis';
  return { plan, t };
}
function Hoarseness(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hoarseness';
  if (t === 'chronic') plan = 'chronic-hoarseness-scope';
  return { plan, t };
}
function Epistaxis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-epistaxis';
  if (t === 'recurrent') plan = 'recurrent-epistaxis';
  else if (t === 'severe') plan = 'severe-epistaxis-cautery';
  return { plan, t };
}
function Vertigo(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-vertigo';
  if (t === 'BPPV') plan = 'BPPV-Epley';
  return { plan, t };
}
function Tinnitus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-tinnitus';
  if (t === 'chronic') plan = 'chronic-tinnitus';
  return { plan, t };
}
function Allergic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-allergy';
  if (t === 'severe') plan = 'severe-allergic-rhinitis';
  return { plan, t };
}
function Vertigo2(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-vertigo-2';
  if (t === 'vestibular') plan = 'vestibular-neuronitis';
  return { plan, t };
}
module.exports = {
  Hearing, Ottis, Sinusitis, Tonsil, Hoarseness, Epistaxis, Vertigo, Tinnitus, Allergic, Vertigo2
};
