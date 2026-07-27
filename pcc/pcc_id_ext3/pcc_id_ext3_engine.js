// P3-CN pcc_id_ext3_engine v3.52.0
'use strict';
function Cdiff(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-CDI';
  if (t === 'positive') plan = 'CDI-oral-vancomycin';
  else if (t === 'fulminant') plan = 'fulminant-CDI-OR';
  return { plan, t };
}
function Mrsa(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-MRSA';
  if (t === 'colonized') plan = 'MRSA-colonization';
  else if (t === 'active') plan = 'MRSA-active-infection';
  return { plan, t };
}
function Vre(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-VRE';
  if (t === 'colonized') plan = 'VRE-colonization';
  return { plan, t };
}
function Esbl(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ESBL';
  if (t === 'UTI') plan = 'ESBL-UTI';
  return { plan, t };
}
function Tbflu(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-tb-flu';
  if (t === 'confirmed') plan = 'TB-or-flu-treatment';
  return { plan, t };
}
function Malaria(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-malaria';
  if (t === 'P-falciparum') plan = 'P-falciparum-malaria';
  return { plan, t };
}
function Tb(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-TB';
  if (t === 'latent') plan = 'latent-TB';
  else if (t === 'active') plan = 'active-TB-RIPE';
  return { plan, t };
}
function Hiv(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-HIV';
  if (t === 'new-dx') plan = 'new-HIV-dx-ART';
  else if (t === 'stable') plan = 'HIV-stable-ART';
  return { plan, t };
}
function Hep(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hepatitis';
  if (t === 'B-active') plan = 'active-hepB';
  else if (t === 'C-active') plan = 'active-hepC';
  return { plan, t };
}
function Travel(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-travel-illness';
  if (t === 'typhoid') plan = 'typhoid-treatment';
  return { plan, t };
}
module.exports = {
  Cdiff, Mrsa, Vre, Esbl, Tbflu, Malaria, Tb, Hiv, Hep, Travel
};
