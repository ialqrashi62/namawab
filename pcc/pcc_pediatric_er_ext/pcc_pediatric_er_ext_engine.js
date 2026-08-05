// P3_EN pcc_pediatric_er_ext_engine v3.104.0
'use strict';
function PediatricRespiratoryDistress(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRespiratoryDistress-none';
  if (t === 'yes') plan = 'pediatricRespiratoryDistress-protocol';
  return { plan, t };
}
function PediatricAsthmaExacerbation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAsthmaExacerbation-none';
  if (t === 'yes') plan = 'pediatricAsthmaExacerbation-protocol';
  return { plan, t };
}
function PediatricAnaphylaxis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAnaphylaxis-none';
  if (t === 'yes') plan = 'pediatricAnaphylaxis-protocol';
  return { plan, t };
}
function PediatricDehydration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDehydration-none';
  if (t === 'yes') plan = 'pediatricDehydration-protocol';
  return { plan, t };
}
function PediatricApnea(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricApnea-none';
  if (t === 'yes') plan = 'pediatricApnea-protocol';
  return { plan, t };
}
function PediatricBradycardia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBradycardia-none';
  if (t === 'yes') plan = 'pediatricBradycardia-protocol';
  return { plan, t };
}
function PediatricTachycardia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTachycardia-none';
  if (t === 'yes') plan = 'pediatricTachycardia-protocol';
  return { plan, t };
}
function PediatricAlteredMental(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAlteredMental-none';
  if (t === 'yes') plan = 'pediatricAlteredMental-protocol';
  return { plan, t };
}
function PediatricPoisoning(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPoisoning-none';
  if (t === 'yes') plan = 'pediatricPoisoning-protocol';
  return { plan, t };
}
function PediatricForeignBody(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricForeignBody-none';
  if (t === 'yes') plan = 'pediatricForeignBody-protocol';
  return { plan, t };
}
module.exports = { PediatricRespiratoryDistress, PediatricAsthmaExacerbation, PediatricAnaphylaxis, PediatricDehydration, PediatricApnea, PediatricBradycardia, PediatricTachycardia, PediatricAlteredMental, PediatricPoisoning, PediatricForeignBody };
