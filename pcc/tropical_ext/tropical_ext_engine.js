// P3-AU: Tropical-Ext Engine — 10 pure functions
const Engine = {};

Engine.MalariaAssessment = function ({ fever = true, travel = 'sub-saharan-africa', prophylaxis = 'none', parasitemia = 0 } = {}) {
  let pathway;
  if (fever && travel === 'sub-saharan-africa' && parasitemia > 0) pathway = 'malaria-confirmed-artesunate-or-ACT';
  else if (fever && travel === 'sub-saharan-africa' && prophylaxis === 'none') pathway = 'malaria-suspected-test-and-treat';
  else if (fever && travel === 'sub-saharan-africa' && prophylaxis === 'mefloquine') pathway = 'breakthrough-malaria-test-and-treat';
  else if (fever && travel === 'tropical') pathway = 'malaria-possible-test';
  else pathway = 'low-risk-malaria';
  return { pathway, recommendation: pathway.includes('confirmed') || pathway.includes('suspected') ? 'test-and-ACT' : 'monitor' };
};

Engine.DengueFever = function ({ fever = true, rash = false, thrombocytopenia = false, plasmaLeakage = false, warningSigns = false } = {}) {
  let classification;
  if (plasmaLeakage) classification = 'severe-dengue-DSS-emergent';
  else if (warningSigns && thrombocytopenia) classification = 'dengue-with-warning-signs-admit';
  else if (thrombocytopenia) classification = 'dengue-without-warning-signs-monitor';
  else if (fever && rash) classification = 'dengue-suspected-test-and-monitor';
  else if (fever) classification = 'febrile-illness-dengue-consider';
  else classification = 'no-dengue';
  return { classification, recommendation: classification.includes('severe') || classification.includes('warning') ? 'admit-and-IVF' : classification.includes('suspected') ? 'test-and-monitor' : 'monitor' };
};

Engine.TyphoidFever = function ({ fever = true, roseSpots = false, hepatosplenomegaly = false, relativeBradycardia = false, bloodCulture = 'pending' } = {}) {
  let diagnosis;
  if (bloodCulture === 'positive' || (fever && roseSpots && hepatosplenomegaly && relativeBradycardia)) diagnosis = 'typhoid-confirmed-or-strongly-suspected';
  else if (fever && relativeBradycardia && hepatosplenomegaly) diagnosis = 'typhoid-suspected';
  else if (fever && (roseSpots || hepatosplenomegaly)) diagnosis = 'enteric-fever-consider';
  else diagnosis = 'low-likelihood-typhoid';
  return { diagnosis, recommendation: diagnosis.includes('confirmed') || diagnosis.includes('suspected') ? 'ceftriaxone-or-azithromycin' : 'monitor' };
};

Engine.TropicalWorm = function ({ presentation = 'eosinophilia', traveler = 'returning', exposure = 'freshwater' } = {}) {
  let diagnosis;
  if (presentation === 'eosinophilia' && exposure === 'freshwater') diagnosis = 'schistosomiasis-test-and-praziquantel';
  else if (presentation === 'eosinophilia' && exposure === 'soil') diagnosis = 'strongyloidiasis-or-hookworm-test';
  else if (presentation === 'eosinophilia' && exposure === 'food') diagnosis = 'taenia-or-other-food-borne';
  else if (presentation === 'skin-larva') diagnosis = 'cutaneous-larva-migrans-or-schistosome-dermatitis';
  else if (traveler === 'returning' && exposure === 'freshwater') diagnosis = 'schistosomiasis-high-suspicion';
  else diagnosis = 'unspecified-worm-evaluate';
  return { diagnosis, recommendation: diagnosis.includes('schisto') || diagnosis.includes('strongyloides') ? 'ID-consult-and-test' : 'monitor' };
};

Engine.TuberculosisRisk = function ({ bcg = false, exposure = 'household', ppd = 0, symptoms = 'none' } = {}) {
  let risk;
  if (ppd >= 15 && symptoms === 'cough') risk = 'latent-TB-convert-and-active-consider';
  else if (ppd >= 10 && exposure === 'household') risk = 'latent-TB-treat';
  else if (ppd >= 5 && exposure === 'household') risk = 'latent-TB-consider-treatment';
  else if (ppd >= 5) risk = 'low-risk-monitor';
  else if (exposure === 'high-risk-area') risk = 'high-risk-monitor-and-recheck';
  else risk = 'low-risk';
  return { risk, recommendation: risk.includes('latent') || risk.includes('active') ? 'INH-or-RIPE-and-ID-consult' : 'monitor' };
};

Engine.TropicalSkin = function ({ rash = 'maculopapular', fever = false, travel = 'tropical' } = {}) {
  let diagnosis;
  if (rash === 'maculopapular' && fever && travel === 'tropical') diagnosis = 'dengue-or-chikungunya-or-zika';
  else if (rash === 'vesicular' && travel === 'africa') diagnosis = 'monkeypox-or-rickettsialpox';
  else if (rash === 'petechial' && fever) diagnosis = 'meningococcemia-or-viral-hemorrhagic';
  else if (rash === 'migratory' && travel === 'central-america') diagnosis = 'cutaneous-larva-migrans';
  else if (rash === 'ulcerative' && travel === 'africa') diagnosis = 'cutaneous-leishmaniasis-or-Buruli-ulcer';
  else diagnosis = 'unspecified-rash';
  return { diagnosis, recommendation: diagnosis.includes('meningo') || diagnosis.includes('hemorrhagic') ? 'emergent-ID-and-isolation' : 'ID-consult' };
};

Engine.RabiesPostExposure = function ({ animal = 'dog', bite = 'yes', location = 'high-risk', priorVaccination = 'none' } = {}) {
  let pathway;
  if (animal === 'bat' || (bite === 'yes' && animal === 'dog' && location === 'high-risk')) pathway = 'rabies-immune-globulin-and-vaccine-series';
  else if (bite === 'yes' && location === 'high-risk' && priorVaccination === 'none') pathway = 'rabies-post-exposure-prophylaxis-RIG-and-vaccine';
  else if (priorVaccination === 'pre-exposure') pathway = 'rabies-vaccine-only-2-doses';
  else if (bite === 'scratch' && location === 'low-risk') pathway = 'rabies-vaccine-consider';
  else pathway = 'rabies-not-needed';
  return { pathway, recommendation: pathway.includes('globulin') || pathway.includes('vaccine') ? 'RIG-and-vaccine-immediately' : 'monitor' };
};

Engine.TravelersDiarrhea = function ({ duration = 0, bloodInStool = false, fever = false, dehydration = 'mild' } = {}) {
  let classification;
  if (duration >= 14) classification = 'persistent-diarrhea-evaluate-parasites';
  else if (bloodInStool && fever) classification = 'dysentery-Shigella-or-Campylobacter';
  else if (bloodInStool) classification = 'bloody-diarrhea-invasive-bacteria';
  else if (fever) classification = 'febrile-diarrhea-invasive-bacteria-or-typhoid';
  else if (dehydration === 'severe') classification = 'severe-dehydration-IVF-and-electrolytes';
  else if (dehydration === 'moderate') classification = 'moderate-ORS-and-monitor';
  else classification = 'mild-self-limiting';
  return { classification, recommendation: classification.includes('severe') || classification.includes('dysentery') ? 'azithromycin-or-cipro-and-IVF' : 'ORS-and-monitor' };
};

Engine.YellowFever = function ({ fever = true, jaundice = false, travel = 'west-africa', vaccine = 'none' } = {}) {
  let diagnosis;
  if (fever && jaundice && travel === 'west-africa') diagnosis = 'yellow-fever-high-suspicion-urgent-test';
  else if (fever && (vaccine === 'none') && travel === 'endemic') diagnosis = 'yellow-fever-risk-vaccinate-or-avoid';
  else if (fever && travel === 'endemic') diagnosis = 'yellow-fever-consider';
  else diagnosis = 'low-risk-yellow-fever';
  return { diagnosis, recommendation: diagnosis.includes('high-suspicion') ? 'isolation-and-test' : diagnosis.includes('risk') ? 'vaccinate-and-protect' : 'monitor' };
};

Engine.ChikungunyaAssessment = function ({ fever = true, severeJointPain = true, rash = false, travel = 'tropical' } = {}) {
  let diagnosis;
  if (fever && severeJointPain && travel === 'tropical') diagnosis = 'chikungunya-confirmed-or-suspected';
  else if (fever && severeJointPain) diagnosis = 'chikungunya-or-dengue-or-other-arbovirus';
  else if (fever && rash && travel === 'tropical') diagnosis = 'zika-or-chikungunya-or-dengue';
  else if (fever && travel === 'tropical') diagnosis = 'arbovirus-spectrum-consider';
  else diagnosis = 'low-likelihood-chikungunya';
  return { diagnosis, recommendation: diagnosis.includes('confirmed') || diagnosis.includes('suspected') ? 'supportive-care-and-ID-consult' : 'monitor' };
};

module.exports = Engine;
