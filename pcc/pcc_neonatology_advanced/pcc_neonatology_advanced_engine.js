// P3_DQ pcc_neonatology_advanced_engine v3.81.0
'use strict';
function NeonatalResuscitationAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalresuscitationadvanced-none';
  if (t === 'yes') plan = 'neonatalresuscitationadvanced-protocol';
  return { plan, t };
}
function NeonatalSepsisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalsepsisadvanced-none';
  if (t === 'yes') plan = 'neonatalsepsisadvanced-protocol';
  return { plan, t };
}
function NeonatalHypoglycemia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalhypoglycemia-none';
  if (t === 'yes') plan = 'neonatalhypoglycemia-protocol';
  return { plan, t };
}
function NeonatalJaundiceAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonataljaundiceadvanced-none';
  if (t === 'yes') plan = 'neonataljaundiceadvanced-protocol';
  return { plan, t };
}
function NeonatalRespiratoryDistress(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalrespiratorydistress-none';
  if (t === 'yes') plan = 'neonatalrespiratorydistress-protocol';
  return { plan, t };
}
function NeonatalSeizures(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalseizures-none';
  if (t === 'yes') plan = 'neonatalseizures-protocol';
  return { plan, t };
}
function NeonatalHypoxicIschemic(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalhypoxicischemic-none';
  if (t === 'yes') plan = 'neonatalhypoxicischemic-protocol';
  return { plan, t };
}
function NeonatalNecrotizingEnterocolitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalnecrotizingenterocolitis-none';
  if (t === 'yes') plan = 'neonatalnecrotizingenterocolitis-protocol';
  return { plan, t };
}
function NeonatalPatentDuctusArteriosus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalpatentductusarteriosus-none';
  if (t === 'yes') plan = 'neonatalpatentductusarteriosus-protocol';
  return { plan, t };
}
function NeonatalRetinopathyPrematurity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalretinopathyprematurity-none';
  if (t === 'yes') plan = 'neonatalretinopathyprematurity-protocol';
  return { plan, t };
}
module.exports = {
  NeonatalResuscitationAdvanced, NeonatalSepsisAdvanced, NeonatalHypoglycemia, NeonatalJaundiceAdvanced, NeonatalRespiratoryDistress, NeonatalSeizures, NeonatalHypoxicIschemic, NeonatalNecrotizingEnterocolitis, NeonatalPatentDuctusArteriosus, NeonatalRetinopathyPrematurity
};
