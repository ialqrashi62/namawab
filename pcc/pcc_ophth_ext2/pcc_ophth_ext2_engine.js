// P3-CO pcc_ophth_ext2_engine v3.53.0
'use strict';
function Visual(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'normal-vision';
  if (t === 'loss') plan = 'vision-loss-workup';
  return { plan, t };
}
function Cataract(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-cataract';
  if (t === 'mature') plan = 'mature-cataract-surgery';
  return { plan, t };
}
function Glaucoma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-glaucoma';
  if (t === 'acute') plan = 'acute-angle-closure';
  return { plan, t };
}
function Retina(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-retina';
  if (t === 'detachment') plan = 'retinal-detachment-OR';
  return { plan, t };
}
function Uveitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-uveitis';
  if (t === 'acute') plan = 'acute-uveitis';
  return { plan, t };
}
function Conjunctivitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-conjunctivitis';
  if (t === 'bacterial') plan = 'bacterial-conjunctivitis';
  else if (t === 'viral') plan = 'viral-conjunctivitis';
  return { plan, t };
}
function Keratitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-keratitis';
  if (t === 'severe') plan = 'severe-keratitis';
  return { plan, t };
}
function Macular(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-macular';
  if (t === 'wet-AMD') plan = 'wet-AMD-anti-VEGF';
  return { plan, t };
}
function Strab(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-strabismus';
  if (t === 'surgical') plan = 'strabismus-surgery';
  return { plan, t };
}
function Trauma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ocular-trauma';
  if (t === 'globe-rupture') plan = 'globe-rupture-emergent';
  return { plan, t };
}
module.exports = {
  Visual, Cataract, Glaucoma, Retina, Uveitis, Conjunctivitis, Keratitis, Macular, Strab, Trauma
};
