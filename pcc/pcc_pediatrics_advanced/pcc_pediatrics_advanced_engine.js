// P3_DQ pcc_pediatrics_advanced_engine v3.81.0
'use strict';
function PediatricSepsisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricsepsisadvanced-none';
  if (t === 'yes') plan = 'pediatricsepsisadvanced-protocol';
  return { plan, t };
}
function DiabeticKetoacidosisPedi(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'diabeticketoacidosispedi-none';
  if (t === 'yes') plan = 'diabeticketoacidosispedi-protocol';
  return { plan, t };
}
function StatusEpilepticusPedi(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'statusepilepticuspedi-none';
  if (t === 'yes') plan = 'statusepilepticuspedi-protocol';
  return { plan, t };
}
function BronchiolitisSevere(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bronchiolitissevere-none';
  if (t === 'yes') plan = 'bronchiolitissevere-protocol';
  return { plan, t };
}
function PediatricAsthmaSevere(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricasthmasevere-none';
  if (t === 'yes') plan = 'pediatricasthmasevere-protocol';
  return { plan, t };
}
function CongenitalHeartDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'congenitalheartdisease-none';
  if (t === 'yes') plan = 'congenitalheartdisease-protocol';
  return { plan, t };
}
function PediatricOncologyEmergencies(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatriconcologyemergencies-none';
  if (t === 'yes') plan = 'pediatriconcologyemergencies-protocol';
  return { plan, t };
}
function InbornErrorsMetabolism(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'inbornerrorsmetabolism-none';
  if (t === 'yes') plan = 'inbornerrorsmetabolism-protocol';
  return { plan, t };
}
function PediatricNeurocritical(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricneurocritical-none';
  if (t === 'yes') plan = 'pediatricneurocritical-protocol';
  return { plan, t };
}
function PediatricToxicology(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatrictoxicology-none';
  if (t === 'yes') plan = 'pediatrictoxicology-protocol';
  return { plan, t };
}
module.exports = {
  PediatricSepsisAdvanced, DiabeticKetoacidosisPedi, StatusEpilepticusPedi, BronchiolitisSevere, PediatricAsthmaSevere, CongenitalHeartDisease, PediatricOncologyEmergencies, InbornErrorsMetabolism, PediatricNeurocritical, PediatricToxicology
};
