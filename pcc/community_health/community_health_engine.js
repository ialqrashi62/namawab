// P3-BC: Community-Health Engine — 10 pure functions
const Engine = {};

Engine.CommunityRiskAssessment = function ({ population = 'urban-low-income', sdoh = { economic: 'high', education: 'low', housing: 'insecure', food: 'insecure' }, age = 35 } = {}) {
  let risk;
  if (sdoh.economic === 'high' && sdoh.housing === 'insecure' && sdoh.food === 'insecure') risk = 'very-high-community-need';
  else if (sdoh.economic === 'moderate' || sdoh.education === 'low') risk = 'high-community-need';
  else if (sdoh.housing === 'insecure' || sdoh.food === 'insecure') risk = 'moderate-community-need';
  else if (age >= 65) risk = 'elderly-and-need-eval';
  else if (population === 'rural-frontier') risk = 'rural-access-barriers';
  else risk = 'low-community-need';
  return { risk, recommendation: 'community-resource-mapping-and-CHW' };
};

Engine.HealthDisparities = function ({ race = 'minority', insurance = 'uninsured', language = 'non-English', chronicDisease = 'multiple' } = {}) {
  let disparity;
  if (race === 'minority' && insurance === 'uninsured' && language === 'non-English') disparity = 'triple-disparity-and-CMS-OE-eligible';
  else if (race === 'minority' && chronicDisease === 'multiple') disparity = 'chronic-disease-disparity';
  else if (insurance === 'uninsured') disparity = 'access-barriers-and-FQHC-referral';
  else if (language === 'non-English') disparity = 'language-barriers-and-interpreter';
  else if (race === 'minority') disparity = 'minority-disparity-and-CRW';
  else disparity = 'no-disparity-identified';
  return { disparity, recommendation: 'cultural-competent-care-and-CMS-OE' };
};

Engine.SDOH = function ({ housing = 'insecure', food = 'insecure', transport = 'limited', education = 'low', safety = 'unsafe' } = {}) {
  let issues = 0;
  if (housing === 'insecure') issues++;
  if (food === 'insecure') issues++;
  if (transport === 'limited') issues++;
  if (education === 'low') issues++;
  if (safety === 'unsafe') issues++;
  let plan;
  if (issues >= 3) plan = 'comprehensive-SDOH-eval-and-CHW-and-housing';
  else if (issues >= 1) plan = 'targeted-SDOH-and-referral';
  else plan = 'standard-SDOH-screen';
  return { plan, recommendation: 'Z-code-and-AHC-HRSN-screen' };
};

Engine.HealthLiteracy = function ({ literacy = 'low', language = 'non-English', teachBack = 'no', caregiver = 'present' } = {}) {
  let plan;
  if (literacy === 'low' && language === 'non-English' && teachBack === 'no') plan = 'teach-back-and-interpreter-and-visual';
  else if (literacy === 'low' && caregiver === 'none') plan = 'low-literacy-materials-and-chw';
  else if (language === 'non-English') plan = 'professional-interpreter-and-bilingual-materials';
  else if (literacy === 'low') plan = 'low-literacy-and-teach-back';
  else if (teachBack === 'no') plan = 'teach-back-and-ask-me-3';
  else plan = 'standard-health-literacy';
  return { plan, recommendation: 'PLAIN-materials-and-teach-back' };
};

Engine.VaccinationOutreach = function ({ age = 35, vaccines = 'routine', population = 'underserved', hesitancy = 'moderate' } = {}) {
  let plan;
  if (hesitancy === 'severe' && population === 'underserved') plan = 'culturally-tailored-messaging-and-trusted-messenger';
  else if (hesitancy === 'severe') plan = 'motivational-interviewing-and-strong-rec';
  else if (age >= 65 && vaccines === 'routine') plan = 'routine-elderly-flu-pneumo-COVID';
  else if (age < 18 && vaccines === 'routine') plan = 'pediatric-routine-and-school-screen';
  else if (vaccines === 'travel') plan = 'travel-medicine-clinic';
  else if (population === 'underserved') plan = 'FQHC-and-mobile-clinic';
  else plan = 'standard-vaccination';
  return { plan, recommendation: 'community-outreach-and-QI' };
};

Engine.CommunityMaternal = function ({ maternalAge = 25, prenatalCare = 'inadequate', income = 'low', transport = 'limited' } = {}) {
  let risk;
  if (prenatalCare === 'inadequate' && income === 'low' && transport === 'limited') risk = 'high-risk-maternal-need-CDC-PER';
  else if (prenatalCare === 'inadequate') risk = 'inadequate-prenatal-care-and-NFP';
  else if (maternalAge >= 35) risk = 'advanced-maternal-age-and-genetic-counsel';
  else if (maternalAge < 20) risk = 'teen-pregnancy-and-ICN';
  else if (income === 'low' && transport === 'limited') risk = 'transport-and-income-barriers';
  else if (prenatalCare === 'late') risk = 'late-prenatal-and-catch-up';
  else risk = 'standard-prenatal';
  return { risk, recommendation: 'NFP-and-WIC-and-MD' };
};

Engine.CommunityMental = function ({ depression = 'high', suicide = 'no', substance = 'no', access = 'limited' } = {}) {
  let plan;
  if (suicide === 'yes' && access === 'limited') plan = 'crisis-team-and-tele-psych';
  else if (substance === 'yes' && depression === 'high') plan = 'co-occurring-SUD-and-depression';
  else if (depression === 'high' && access === 'limited') plan = 'tele-psych-and-CHW';
  else if (depression === 'moderate' && access === 'limited') plan = 'group-therapy-and-CHW';
  else if (substance === 'yes') plan = 'MAT-and-SUD-program';
  else plan = 'standard-MH-screen';
  return { plan, recommendation: 'community-mental-health-and-988' };
};

Engine.CommunityScreening = function ({ age = 50, sdoh = 'low', lastScreen = 'overdue', access = 'limited' } = {}) {
  let plan;
  if (lastScreen === 'overdue' && access === 'limited') plan = 'mobile-clinic-and-CHW-screen';
  else if (age >= 50 && lastScreen === 'overdue') plan = 'cancer-screen-and-PCP-referral';
  else if (sdoh === 'high' && access === 'limited') plan = 'FQHC-and-CHW-screen';
  else if (lastScreen === 'recent') plan = 'maintain-and-monitor';
  else plan = 'standard-screen';
  return { plan, recommendation: 'community-screen-and-CMS-OE' };
};

Engine.CommunityOutbreak = function ({ pathogen = 'flu', cases = 5, population = '5k', severity = 'moderate' } = {}) {
  let plan;
  if (cases >= 20 && severity === 'severe') plan = 'outbreak-declare-and-public-health-emergency';
  else if (cases >= 10 && severity === 'moderate') plan = 'outbreak-investigation-and-surveillance';
  else if (cases >= 5) plan = 'cluster-investigation-and-control';
  else if (pathogen === 'COVID' || pathogen === 'measles') plan = 'vaccine-clinic-and-contact-tracing';
  else if (pathogen === 'food') plan = 'food-safety-and-recall';
  else plan = 'standard-surveillance';
  return { plan, recommendation: 'public-health-dept-and-EPI' };
};

Engine.CommunityEval = function ({ program = 'FQHC', reach = '5k', outcomes = 'improved', cost = 'low' } = {}) {
  let evaluation;
  if (program === 'FQHC' && reach >= 5 && outcomes === 'improved' && cost === 'low') evaluation = 'highly-effective-FQHC-and-replicate';
  else if (outcomes === 'improved' && cost === 'low') evaluation = 'effective-program-and-scale';
  else if (outcomes === 'mixed') evaluation = 'mixed-results-and-pivot';
  else if (outcomes === 'no-change') evaluation = 'no-effect-and-redesign';
  else if (cost === 'high' && outcomes === 'improved') evaluation = 'high-cost-but-effective';
  else evaluation = 'standard-program-eval';
  return { evaluation, recommendation: 'annual-eval-and-quality-improvement' };
};

module.exports = Engine;
