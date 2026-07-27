// P3-BJ dental_ext_engine.js — 10 pure functions
const Engine = {
  CariesRisk: function (i) {
    const dmft = (i.dmft || 0);
    const sugar = (i.sugar || 'low');
    const fluoride = (i.fluoride || 'yes');
    const saliva = (i.saliva || 'normal');
    if (dmft >= 6 && sugar === 'high' && fluoride === 'no') return { plan: 'high-risk-and-fluoride-varnish-and-sealants' };
    if (dmft >= 3 && sugar === 'high') return { plan: 'high-risk-and-counseling' };
    if (saliva === 'low' && fluoride === 'no') return { plan: 'xerostomia-and-fluoride' };
    if (dmft === 0 && fluoride === 'yes') return { plan: 'low-risk-and-routine' };
    return { plan: 'moderate-risk-and-fluoride' };
  },
  Periodontitis: function (i) {
    const stage = (i.stage || 'I');
    const grade = (i.grade || 'A');
    if (stage === 'IV' && grade === 'C') return { plan: 'advanced-perio-and-surgical-eval' };
    if (stage === 'III' && grade === 'B') return { plan: 'moderate-perio-and-SRP' };
    if (stage === 'II' && grade === 'A') return { plan: 'mild-perio-and-SRP' };
    if (stage === 'I') return { plan: 'gingivitis-and-improved-OH' };
    return { plan: 'evaluate-and-stage' };
  },
  Endocarditis: function (i) {
    const procedure = (i.procedure || 'unknown');
    const risk = (i.risk || 'standard');
    if (procedure === 'dental' && risk === 'high') return { plan: 'antibiotic-prophylaxis' };
    if (procedure === 'dental' && risk === 'standard') return { plan: 'no-prophylaxis' };
    if (procedure === 'GI' && risk === 'high') return { plan: 'no-routine-prophylaxis' };
    if (procedure === 'GU' && risk === 'high' && (i.infection === 'yes')) return { plan: 'antibiotic-prophylaxis' };
    return { plan: 'standard-care' };
  },
  OralCancerScreen: function (i) {
    const lesion = (i.lesion || 'none');
    const duration = (i.duration || 0);
    const risk = (i.risk || 'low');
    if (lesion === 'ulcer' && duration > 14) return { plan: 'urgent-biopsy-and-ENT-referral' };
    if (lesion === 'white-patch' && risk === 'high') return { plan: 'biopsy-and-eval' };
    if (lesion === 'red-patch') return { plan: 'biopsy-and-eval' };
    if (risk === 'high' && lesion === 'none') return { plan: 'annual-screen' };
    return { plan: 'routine-screen' };
  },
  TMJ: function (i) {
    const pain = (i.pain || 'mild');
    const opening = (i.opening || 40);
    const crepitus = (i.crepitus || 'no');
    if (pain === 'severe' && opening < 25) return { plan: 'splint-and-pain-clinic' };
    if (pain === 'moderate' && crepitus === 'yes') return { plan: 'NSAIDs-and-night-guard' };
    if (pain === 'mild') return { plan: 'self-care-and-NSAIDs' };
    if (opening < 30) return { plan: 'PT-and-splint' };
    return { plan: 'monitor-and-evaluate' };
  },
  Trauma: function (i) {
    const type = (i.type || 'unknown');
    const tooth = (i.tooth || 'primary');
    const time = (i.time || 0);
    if (type === 'avulsion' && tooth === 'permanent' && time < 60) return { plan: 'reimplant-and-splint' };
    if (type === 'avulsion' && tooth === 'primary') return { plan: 'do-not-reimplant' };
    if (type === 'fracture' && time < 24) return { plan: 'pulpotomy-or-RCT' };
    if (type === 'luxation') return { plan: 'reposition-and-splint' };
    if (type === 'concussion') return { plan: 'monitor-and-soft-diet' };
    return { plan: 'evaluate-and-treat' };
  },
  Ortho: function (i) {
    const age = (i.age || 12);
    const malocclusion = (i.malocclusion || 'class-I');
    const compliance = (i.compliance || 'good');
    if (age < 12 && malocclusion === 'class-III') return { plan: 'early-interceptive-treatment' };
    if (age >= 12 && malocclusion === 'class-II' && compliance === 'good') return { plan: 'comprehensive-ortho' };
    if (compliance === 'poor') return { plan: 'removable-appliance-or-evaluate' };
    if (age < 12) return { plan: 'monitor-and-mixed-dentition' };
    return { plan: 'evaluate-and-treat' };
  },
  Pediatric: function (i) {
    const age = (i.age || 5);
    const cooperation = (i.cooperation || 'good');
    const procedure = (i.procedure || 'restorative');
    if (age < 3 && cooperation === 'poor') return { plan: 'GA-and-restorative' };
    if (age < 6 && procedure === 'extraction') return { plan: 'behavioral-and-local' };
    if (cooperation === 'good') return { plan: 'local-anesthesia-and-restore' };
    if (age >= 6 && procedure === 'sealant') return { plan: 'sealant-and-fluoride' };
    return { plan: 'behavior-management' };
  },
  MedComplex: function (i) {
    const condition = (i.condition || 'none');
    const procedure = (i.procedure || 'cleaning');
    if (condition === 'warfarin' && procedure === 'extraction') return { plan: 'INR-and-bridge-or-hold' };
    if (condition === 'bisphosphonate' && procedure === 'extraction') return { plan: 'BRONJ-risk-and-consult' };
    if (condition === 'diabetes') return { plan: 'AM-appointment-and-glucose' };
    if (condition === 'radiation-head-neck') return { plan: 'xerostomia-and-pre-med' };
    return { plan: 'standard-care' };
  },
  DentalAbscess: function (i) {
    const severity = (i.severity || 'mild');
    const systemic = (i.systemic || 'no');
    const airway = (i.airway || 'patent');
    if (airway === 'compromised') return { plan: 'emergent-OR-and-airway' };
    if (severity === 'severe' && systemic === 'yes') return { plan: 'IV-abx-and-drainage' };
    if (severity === 'severe') return { plan: 'oral-abx-and-RCT-or-extraction' };
    if (severity === 'moderate') return { plan: 'oral-abx-and-drain' };
    if (severity === 'mild') return { plan: 'RCT-or-extraction-and-NSAID' };
    return { plan: 'evaluate-and-treat' };
  },
};
module.exports = Engine;
