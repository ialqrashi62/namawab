"""
PCC Sandbox SDK for Python
Auto-generated for PCC Catalog v3.316.0
1322 modules, 10035 unique functions
Generated: 2026-07-29T05:32:22.718Z
"""

from typing import Any, Dict, List, Optional
import urllib.request
import urllib.parse
import json


class PccClient:
    """Synchronous client for the PCC Sandbox catalog."""

    def __init__(self, base_url: str = "http://localhost:3201", headers: Optional[Dict[str, str]] = None, timeout: float = 30.0):
        self.base_url = base_url.rstrip("/")
        self.headers = headers or {}
        self.timeout = timeout

    def _req(self, method: str, path: str, body: Optional[Dict] = None) -> Any:
        url = self.base_url + path
        data = None
        if body is not None:
            data = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(url, data=data, method=method)
        req.add_header("Content-Type", "application/json")
        for k, v in self.headers.items():
            req.add_header(k, v)
        with urllib.request.urlopen(req, timeout=self.timeout) as res:
            content = res.read().decode("utf-8")
            return json.loads(content) if content else None

    # === Catalog ===
    def catalog(self) -> Dict:
        """List all 1322 modules."""
        return self._req("GET", "/api/v1/pcc-catalog/modules")

    def categories(self) -> Dict:
        """Modules grouped by 255 categories."""
        return self._req("GET", "/api/v1/pcc-catalog/categories")

    def module(self, slug: str) -> Dict:
        """Module detail with functions."""
        return self._req("GET", f"/api/v1/pcc-catalog/module/{slug}")

    # === Search ===
    def search(self, query: str) -> Dict:
        """Full-text search with scoring."""
        return self._req("GET", "/api/v1/pcc-catalog/search?q=" + urllib.parse.quote(query))

    def lookup(self, fn: str) -> Dict:
        """Find modules exposing a function."""
        return self._req("GET", "/api/v1/pcc-catalog/lookup/" + urllib.parse.quote(fn))

    # === Diagnostics ===
    def diagnostics(self) -> Dict:
        """Server diagnostics."""
        return self._req("GET", "/api/v1/pcc-diagnostics/diagnostics")

    def version(self) -> Dict:
        """Version info."""
        return self._req("GET", "/api/v1/pcc-diagnostics/version")

    # === Module operations ===
    def list_module(self, slug: str) -> Dict:
        """Module function list."""
        return self._req("GET", f"/api/v1/{slug}/list")

    def call(self, slug: str, fn: str, input_data: Optional[Dict] = None) -> Dict:
        """Invoke a function."""
        return self._req("POST", f"/api/v1/{slug}/call/{fn}", input_data or {})

    def record(self, slug: str, request: Dict) -> Dict:
        """Record a result with tenant context."""
        return self._req("POST", f"/api/v1/{slug}/record", request)

    def health(self) -> Dict:
        """Health check."""
        return self._req("GET", "/health")


# === Module shortcuts (sample 50) ===
SHORTCUTS = {
    "PccAddictionExt102": {
        "slug": "pcc-addiction-ext102",
        "module": "pcc_addiction_ext102",
        "version": "3.316.0",
        "functions": ['AddGenExt','AddAlcoholExt','AddDrugExt','AddNicotineExt','AddGamblingExt','AddDetoxExt','AddRehabExt','AddRelapseExt','AddMAText','AddFamilyExt'],
    },
    "PccAddictionMed": {
        "slug": "pcc-addiction-med",
        "module": "pcc_addiction_med",
        "version": "3.62.0",
        "functions": ['Audit','Dast','Cage','Motivation','Withdrawal','MatOpioid','MatAlcohol','Overdose','HarmReduction','RelapsePlan'],
    },
    "PccAdmin": {
        "slug": "pcc-admin",
        "module": "pcc_admin",
        "version": "3.41.0",
        "functions": ['Facility','User','Module','Config','Branches','Resource','Backup','Restore','Migration','Health'],
    },
    "PccAdminExt101": {
        "slug": "pcc-admin-ext101",
        "module": "pcc_admin_ext101",
        "version": "3.316.0",
        "functions": ['AdmSchedulingExt','AdmBedManagementExt','AdmStaffingExt','AdmInventoryExt','AdmBillingExt','AdmInsuranceExt','AdmReportingExt','AdmIText','AdmLegalExt','AdmStrategicExt'],
    },
    "PccAdolescentExt101": {
        "slug": "pcc-adolescent-ext101",
        "module": "pcc_adolescent_ext101",
        "version": "3.316.0",
        "functions": ['AdolGeneralExt','AdolPubertyExt','AdolEatingDisExt','AdolSubstanceExt','AdolMentalHealthExt','AdolSexualExt','AdolPregnancyExt','AdolVaccineExt','AdolSportsExt','AdolTransitionExt'],
    },
    "PccAdolescentMedExt102": {
        "slug": "pcc-adolescent-med-ext102",
        "module": "pcc_adolescent_med_ext102",
        "version": "3.316.0",
        "functions": ['AdolGenExt','AdolPubertyExt','AdolMentalExt','AdolSubstExt','AdolSexExt','AdolEatExt','AdolAcneExt','AdolSportsExt','AdolVaccExt','AdolTransitExt'],
    },
    "PccAdolescentMedicine": {
        "slug": "pcc-adolescent-medicine",
        "module": "pcc_adolescent_medicine",
        "version": "3.95.0",
        "functions": ['EatingDisorderAssessment','AdolescentDepressionScreen','PubertyDisorders','AdolescentSubstanceUse','AdolescentSexualHealth','AdolescentImmunizations','AdolescentObesity','AdolescentRiskBehavior','TransitionToAdultCare','AdolescentGynecology'],
    },
    "PccAdrenalHealth": {
        "slug": "pcc-adrenal-health",
        "module": "pcc_adrenal_health",
        "version": "3.71.0",
        "functions": ['CortisolCurve','DHEASLevel','AdrenalFatigue','StressResponse','HPAAxis','AldosteroneBalance','SaltCraving','MorningCortisol','ACTHStimulation','AdrenalCrisis'],
    },
    "PccAdvancedHeartFailure": {
        "slug": "pcc-advanced-heart-failure",
        "module": "pcc_advanced_heart_failure",
        "version": "3.184.0",
        "functions": ['HeartFailureStageAssessmentExt','GDMTOptimizationExt','LVADCandidateSelectionExt','HeartTransplantListingExt','CardioMemsHDExt','InotropeWeaningProtocolExt','PalliativeHFConsultExt','HFReadmissionRiskExt','AmyloidCardiomyopathyScreenExt','CRTResponsePredictionExt'],
    },
    "PccAerospaceExt102": {
        "slug": "pcc-aerospace-ext102",
        "module": "pcc_aerospace_ext102",
        "version": "3.316.0",
        "functions": ['AeroFitnessExt','AeroAltitudeExt','AeroGForceExt','AeroSpaceAdaptExt','AeroMicrogravityExt','AeroRadiationExt','AeroPilotHealthExt','AeroFlightSurgeonExt','AeroSpacePsychExt','AeroEmergExt'],
    },
    "PccAllergyAdvanced": {
        "slug": "pcc-allergy-advanced",
        "module": "pcc_allergy_advanced",
        "version": "3.80.0",
        "functions": ['AnaphylaxisAdvanced','DrugAllergyDelabeling','FoodAllergyOralImmunotherapy','VenomImmunotherapy','AllergicBronchopulmonaryAspergillosis','EosinophilicGranulomatosis','MastCellActivation','ChronicUrticariaRefractory','AllergicRhinoconjunctivitisAdvanced','ContactDermatitisAdvanced'],
    },
    "PccAllergyEnvironmental": {
        "slug": "pcc-allergy-environmental",
        "module": "pcc_allergy_environmental",
        "version": "3.74.0",
        "functions": ['PollenForecast','MoldExposure','DustMite','PetDander','Cockroach','RodentAllergen','IndoorAirQuality','SeasonalStrategy','EnvironmentalControl','AllergenImmunotherapy'],
    },
    "PccAllergyExt100": {
        "slug": "pcc-allergy-ext100",
        "module": "pcc_allergy_ext100",
        "version": "3.316.0",
        "functions": ['AllergicRhinitisExt','AllergicAsthmaExt','AllergicFoodExt','AllergicDrugExt','AllergicUrticariaExt','AllergicAnaphylaxisExt','AllergicContactExt','AllergicVenomExt','AllergicLatexExt','AllergicImmunotherapyExt'],
    },
    "PccAllergyExt102": {
        "slug": "pcc-allergy-ext102",
        "module": "pcc_allergy_ext102",
        "version": "3.316.0",
        "functions": ['AlgGenExt','AlgRhinitisExt','AlgAsthmaExt','AlgFoodExt','AlgDrugExt','AlgInsectExt','AlgLatexExt','AlgUrticariaExt','AlgAnaphyExt','AlgImmunothExt'],
    },
    "PccAllergyImmunology": {
        "slug": "pcc-allergy-immunology",
        "module": "pcc_allergy_immunology",
        "version": "3.61.0",
        "functions": ['Ige','SkinTest','Anaphylaxis','Desensitization','FoodAllergy','DrugAllergy','InsectAllergy','AsthmaAllergy','Immunodeficiency','Biologic'],
    },
    "PccAllergyPrecision": {
        "slug": "pcc-allergy-precision",
        "module": "pcc_allergy_precision",
        "version": "3.70.0",
        "functions": ['AllergenComponent','CrossReactivity','OralAllergy','DrugAllergyGenetics','VenomAllergy','AtopicDermatitis','AllergicRhinitis','AsthmaAllergy','FoodChallenge','Desensitization'],
    },
    "PccAlternativeExt102": {
        "slug": "pcc-alternative-ext102",
        "module": "pcc_alternative_ext102",
        "version": "3.316.0",
        "functions": ['AltChiroExt','AltOsteoExt','AltMassageExt','AltReikiExt','AltHypnoExt','AltBiofeedbackExt','AltAromaExt','AltYogaExt','AltTaiChiExt','AltMeditationExt'],
    },
    "PccAmbulatory": {
        "slug": "pcc-ambulatory",
        "module": "pcc_ambulatory",
        "version": "3.58.0",
        "functions": ['VisitType','Refill','Wellness','ChronicCare','Preventive','Immunization','HgbA1c','BpCheck','Smoking','DrVisit'],
    },
    "PccAnalytics": {
        "slug": "pcc-analytics",
        "module": "pcc_analytics",
        "version": "0.9",
        "functions": ['Aggregate','Group','Trend','Anomaly','Cohort','Funnel','Retention','Conversion','KPI','Report'],
    },
    "PccAnesthExt10": {
        "slug": "pcc-anesth-ext10",
        "module": "pcc_anesth_ext10",
        "version": "3.235.0",
        "functions": ['EXT1AssessmentExt','EXT1ScoreExt','EXT1StageExt','EXT1PlanExt','EXT1RiskExt','EXT1DoseExt','EXT1FrequencyExt','EXT1DurationExt','EXT1FollowupExt','EXT1OutcomeExt'],
    },
    "PccAnesthExt100": {
        "slug": "pcc-anesth-ext100",
        "module": "pcc_anesth_ext100",
        "version": "3.316.0",
        "functions": ['AnesthGeneralExt','AnesthRegionalExt','AnesthLocalExt','AnesthSpinalExt','AnesthEpiduralExt','AnesthSedationExt','AnesthPediatricExt','AnesthObstetricExt','AnesthCardiacExt','AnesthTraumaExt'],
    },
    "PccAnesthExt4": {
        "slug": "pcc-anesth-ext4",
        "module": "pcc_anesth_ext4",
        "version": "3.233.0",
        "functions": ['EXT4AssessmentExt','EXT4ScoreExt','EXT4StageExt','EXT4PlanExt','EXT4RiskExt','EXT4DoseExt','EXT4FrequencyExt','EXT4DurationExt','EXT4FollowupExt','EXT4OutcomeExt'],
    },
    "PccAnesthExt5": {
        "slug": "pcc-anesth-ext5",
        "module": "pcc_anesth_ext5",
        "version": "3.233.0",
        "functions": ['EXT5AssessmentExt','EXT5ScoreExt','EXT5StageExt','EXT5PlanExt','EXT5RiskExt','EXT5DoseExt','EXT5FrequencyExt','EXT5DurationExt','EXT5FollowupExt','EXT5OutcomeExt'],
    },
    "PccAnesthExt6": {
        "slug": "pcc-anesth-ext6",
        "module": "pcc_anesth_ext6",
        "version": "3.233.0",
        "functions": ['EXT6AssessmentExt','EXT6ScoreExt','EXT6StageExt','EXT6PlanExt','EXT6RiskExt','EXT6DoseExt','EXT6FrequencyExt','EXT6DurationExt','EXT6FollowupExt','EXT6OutcomeExt'],
    },
    "PccAnesthExt7": {
        "slug": "pcc-anesth-ext7",
        "module": "pcc_anesth_ext7",
        "version": "3.234.0",
        "functions": ['EXT7AssessmentExt','EXT7ScoreExt','EXT7StageExt','EXT7PlanExt','EXT7RiskExt','EXT7DoseExt','EXT7FrequencyExt','EXT7DurationExt','EXT7FollowupExt','EXT7OutcomeExt'],
    },
    "PccAnesthExt8": {
        "slug": "pcc-anesth-ext8",
        "module": "pcc_anesth_ext8",
        "version": "3.234.0",
        "functions": ['EXT8AssessmentExt','EXT8ScoreExt','EXT8StageExt','EXT8PlanExt','EXT8RiskExt','EXT8DoseExt','EXT8FrequencyExt','EXT8DurationExt','EXT8FollowupExt','EXT8OutcomeExt'],
    },
    "PccAnesthExt9": {
        "slug": "pcc-anesth-ext9",
        "module": "pcc_anesth_ext9",
        "version": "3.234.0",
        "functions": ['EXT9AssessmentExt','EXT9ScoreExt','EXT9StageExt','EXT9PlanExt','EXT9RiskExt','EXT9DoseExt','EXT9FrequencyExt','EXT9DurationExt','EXT9FollowupExt','EXT9OutcomeExt'],
    },
    "PccAnesthesiologyExt102": {
        "slug": "pcc-anesthesiology-ext102",
        "module": "pcc_anesthesiology_ext102",
        "version": "3.316.0",
        "functions": ['AnGenExt','AnGenAnesthExt','AnRegAnesthExt','AnLocalExt','AnAirwayExt','AnMonitExt','AnFluidExt','AnPostopExt','AnComplicExt','AnCriticalExt'],
    },
    "PccAntimicrobialStewardship": {
        "slug": "pcc-antimicrobial-stewardship",
        "module": "pcc_antimicrobial_stewardship",
        "version": "3.77.0",
        "functions": ['EmpiricAntibioticChoice','DeEscalationReview','TherapeuticDrugMonitoring','AllergyCrossReactivity','RenalDoseAdjustment','HepaticDoseAdjustment','DrugInteractionCheck','CultureFollowUp','AntibioticSpectrum','StewardshipMetrics'],
    },
    "PccAorticIntervention": {
        "slug": "pcc-aortic-intervention",
        "module": "pcc_aortic_intervention",
        "version": "3.186.0",
        "functions": ['AorticAneurysmSizingExt','EVARvsOpenRepairExt','AorticDissectionStanfordExt','TypeBAorticDissectionMgtExt','MarfanSurveillanceExt','AorticCoarctationRepairExt','PADIClassificationExt','ABIScreeningExt','CLITreatmentExt','CarotidStenosisMgtExt'],
    },
    "PccAorticSurgery": {
        "slug": "pcc-aortic-surgery",
        "module": "pcc_aortic_surgery",
        "version": "3.189.0",
        "functions": ['ASAssessmentExt','ASScoreExt','ASStageExt','ASPlanExt','ASRiskExt','ASDoseExt','ASFrequencyExt','ASDurationExt','ASFollowupExt','ASOutcomeExt'],
    },
    "PccArrhythmiaAdvanced": {
        "slug": "pcc-arrhythmia-advanced",
        "module": "pcc_arrhythmia_advanced",
        "version": "3.185.0",
        "functions": ['CHA2DS2VASCRecalcExt','HASBLEDRecalcExt','DOACvsWarfarinExt','AFStrokeMechanismExt','LAAClosureCandidateExt','VTStormProtocolExt','SuddenCardiacDeathRiskExt','AnticoagBleedRiskNetExt','AFBurdenMonitorExt','RateControlTargetExt'],
    },
    "PccAudioExt100": {
        "slug": "pcc-audio-ext100",
        "module": "pcc_audio_ext100",
        "version": "3.316.0",
        "functions": ['AudioHearingExt','AudioTinnitusExt','AudioVertigoExt','AudioConductiveExt','AudioSensorineuralExt','AudioPediatricExt','AudioCochlearExt','AudioOtotoxicExt','AudioABRext','AudioVestibularExt'],
    },
    "PccAudit": {
        "slug": "pcc-audit",
        "module": "pcc_audit",
        "version": "0.9",
        "functions": ['Log','Compliance','Retention','Hash','Search','Filter','Range','Export','Alert','Quota'],
    },
    "PccAutoExt246": {
        "slug": "pcc-auto-ext-246",
        "module": "pcc_auto_ext_246",
        "version": "3.274.0",
        "functions": ['X246AssessmentExt','X246ScoreExt','X246StageExt','X246PlanExt','X246RiskExt','X246DoseExt','X246FrequencyExt','X246DurationExt','X246FollowupExt','X246OutcomeExt'],
    },
    "PccAutoExt247": {
        "slug": "pcc-auto-ext-247",
        "module": "pcc_auto_ext_247",
        "version": "3.275.0",
        "functions": ['X247AssessmentExt','X247ScoreExt','X247StageExt','X247PlanExt','X247RiskExt','X247DoseExt','X247FrequencyExt','X247DurationExt','X247FollowupExt','X247OutcomeExt'],
    },
    "PccAutoExt248": {
        "slug": "pcc-auto-ext-248",
        "module": "pcc_auto_ext_248",
        "version": "3.275.0",
        "functions": ['X248AssessmentExt','X248ScoreExt','X248StageExt','X248PlanExt','X248RiskExt','X248DoseExt','X248FrequencyExt','X248DurationExt','X248FollowupExt','X248OutcomeExt'],
    },
    "PccAutoExt249": {
        "slug": "pcc-auto-ext-249",
        "module": "pcc_auto_ext_249",
        "version": "3.275.0",
        "functions": ['X249AssessmentExt','X249ScoreExt','X249StageExt','X249PlanExt','X249RiskExt','X249DoseExt','X249FrequencyExt','X249DurationExt','X249FollowupExt','X249OutcomeExt'],
    },
    "PccAutoExt250": {
        "slug": "pcc-auto-ext-250",
        "module": "pcc_auto_ext_250",
        "version": "3.276.0",
        "functions": ['X250AssessmentExt','X250ScoreExt','X250StageExt','X250PlanExt','X250RiskExt','X250DoseExt','X250FrequencyExt','X250DurationExt','X250FollowupExt','X250OutcomeExt'],
    },
    "PccAutoExt251": {
        "slug": "pcc-auto-ext-251",
        "module": "pcc_auto_ext_251",
        "version": "3.276.0",
        "functions": ['X251AssessmentExt','X251ScoreExt','X251StageExt','X251PlanExt','X251RiskExt','X251DoseExt','X251FrequencyExt','X251DurationExt','X251FollowupExt','X251OutcomeExt'],
    },
    "PccAutoExt252": {
        "slug": "pcc-auto-ext-252",
        "module": "pcc_auto_ext_252",
        "version": "3.276.0",
        "functions": ['X252AssessmentExt','X252ScoreExt','X252StageExt','X252PlanExt','X252RiskExt','X252DoseExt','X252FrequencyExt','X252DurationExt','X252FollowupExt','X252OutcomeExt'],
    },
    "PccAutoExt253": {
        "slug": "pcc-auto-ext-253",
        "module": "pcc_auto_ext_253",
        "version": "3.277.0",
        "functions": ['X253AssessmentExt','X253ScoreExt','X253StageExt','X253PlanExt','X253RiskExt','X253DoseExt','X253FrequencyExt','X253DurationExt','X253FollowupExt','X253OutcomeExt'],
    },
    "PccAutoExt254": {
        "slug": "pcc-auto-ext-254",
        "module": "pcc_auto_ext_254",
        "version": "3.277.0",
        "functions": ['X254AssessmentExt','X254ScoreExt','X254StageExt','X254PlanExt','X254RiskExt','X254DoseExt','X254FrequencyExt','X254DurationExt','X254FollowupExt','X254OutcomeExt'],
    },
    "PccAutoExt255": {
        "slug": "pcc-auto-ext-255",
        "module": "pcc_auto_ext_255",
        "version": "3.277.0",
        "functions": ['X255AssessmentExt','X255ScoreExt','X255StageExt','X255PlanExt','X255RiskExt','X255DoseExt','X255FrequencyExt','X255DurationExt','X255FollowupExt','X255OutcomeExt'],
    },
    "PccAutoExt256": {
        "slug": "pcc-auto-ext-256",
        "module": "pcc_auto_ext_256",
        "version": "3.278.0",
        "functions": ['X256AssessmentExt','X256ScoreExt','X256StageExt','X256PlanExt','X256RiskExt','X256DoseExt','X256FrequencyExt','X256DurationExt','X256FollowupExt','X256OutcomeExt'],
    },
    "PccAutoExt257": {
        "slug": "pcc-auto-ext-257",
        "module": "pcc_auto_ext_257",
        "version": "3.278.0",
        "functions": ['X257AssessmentExt','X257ScoreExt','X257StageExt','X257PlanExt','X257RiskExt','X257DoseExt','X257FrequencyExt','X257DurationExt','X257FollowupExt','X257OutcomeExt'],
    },
    "PccAutoExt258": {
        "slug": "pcc-auto-ext-258",
        "module": "pcc_auto_ext_258",
        "version": "3.278.0",
        "functions": ['X258AssessmentExt','X258ScoreExt','X258StageExt','X258PlanExt','X258RiskExt','X258DoseExt','X258FrequencyExt','X258DurationExt','X258FollowupExt','X258OutcomeExt'],
    },
    "PccAutoExt259": {
        "slug": "pcc-auto-ext-259",
        "module": "pcc_auto_ext_259",
        "version": "3.279.0",
        "functions": ['X259AssessmentExt','X259ScoreExt','X259StageExt','X259PlanExt','X259RiskExt','X259DoseExt','X259FrequencyExt','X259DurationExt','X259FollowupExt','X259OutcomeExt'],
    },
    "PccAutoExt260": {
        "slug": "pcc-auto-ext-260",
        "module": "pcc_auto_ext_260",
        "version": "3.279.0",
        "functions": ['X260AssessmentExt','X260ScoreExt','X260StageExt','X260PlanExt','X260RiskExt','X260DoseExt','X260FrequencyExt','X260DurationExt','X260FollowupExt','X260OutcomeExt'],
    },
    "PccAutoExt261": {
        "slug": "pcc-auto-ext-261",
        "module": "pcc_auto_ext_261",
        "version": "3.279.0",
        "functions": ['X261AssessmentExt','X261ScoreExt','X261StageExt','X261PlanExt','X261RiskExt','X261DoseExt','X261FrequencyExt','X261DurationExt','X261FollowupExt','X261OutcomeExt'],
    },
}