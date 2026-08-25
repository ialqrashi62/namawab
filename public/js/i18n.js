// filepath: namaweb/public/js/i18n.js
// Multi-language support for NamaMedical UI
// Pattern: i18n-fixer + 4-locale (AR/EN/FR/UR)
'use strict';

const I18N = {
    // ============ Common ============
    'common.api_online': { ar: '✓ API متصل', en: '✓ API online', fr: '✓ API en ligne', ur: '✓ API آن لائن' },
    'common.api_error': { ar: '✗ خطأ API', en: '✗ API error', fr: '✗ Erreur API', ur: '✗ API خرابی' },
    'common.offline': { ar: '✗ غير متصل', en: '✗ offline', fr: '✗ hors ligne', ur: '✗ آف لائن' },
    'common.checking': { ar: '⏳ جاري التحقق', en: '⏳ checking...', fr: '⏳ vérification...', ur: '⏳ چیک ہو رہا ہے' },
    'common.run': { ar: 'تشغيل', en: 'Run', fr: 'Exécuter', ur: 'چلائیں' },
    'common.running': { ar: 'جاري التشغيل...', en: 'Running...', fr: 'En cours...', ur: 'چل رہا ہے...' },
    'common.invalid_json': { ar: 'JSON غير صالح', en: 'Invalid JSON', fr: 'JSON invalide', ur: 'غلط JSON' },
    'common.error': { ar: 'خطأ', en: 'Error', fr: 'Erreur', ur: 'خرابی' },
    'common.back_home': { ar: '← الرئيسية', en: '← Home', fr: '← Accueil', ur: '← ہوم' },
    'common.back_depts': { ar: '← الأقسام', en: '← Departments', fr: '← Départements', ur: '← محکمے' },
    'common.docs': { ar: '📄 التوثيق', en: '📄 Docs', fr: '📄 Docs', ur: '📄 دستاویزات' },
    'common.health': { ar: 'الحالة', en: 'Health', fr: 'Santé', ur: 'حالت' },
    'common.select_lang': { ar: 'اللغة', en: 'Language', fr: 'Langue', ur: 'زبان' },
    // ============ Department page ============
    'dept.assessments': { ar: 'التقييمات المتاحة', en: 'Available Assessments', fr: 'Évaluations Disponibles', ur: 'دستیاب تشخیصات' },
    'dept.click_run': { ar: 'انقر "تشغيل" لتشغيل محرك التقييم. المدخل بصيغة JSON.', en: 'Click "Run" to execute an assessment engine. Input is JSON.', fr: 'Cliquez sur "Exécuter" pour lancer un moteur d\'évaluation. L\'entrée est en JSON.', ur: 'تشخیصی انجن چلانے کے لیے "چلائیں" پر کلک کریں۔ ان پٹ JSON ہے۔' },
    'dept.no_assessments': { ar: 'لا توجد محركات تقييم متاحة.', en: 'No assessment engines available yet.', fr: 'Aucun moteur d\'évaluation disponible.', ur: 'ابھی تک کوئی تشخیصی انجن دستیاب نہیں ہے۔' },
    'dept.endpoint': { ar: 'نقطة النهاية', en: 'Endpoint', fr: 'Point de terminaison', ur: 'اینڈ پوائنٹ' },
    // ============ Hub page ============
    'hub.title': { ar: '🏥 مركز الأقسام', en: '🏥 Departments Hub', fr: '🏥 Centre des Départements', ur: '🏥 محکموں کا مرکز' },
    'hub.subtitle': { ar: '62 قسم سريري · حالة مباشرة · تنقل بين الأقسام', en: '62 clinical departments · Live health status · Cross-department navigation', fr: '62 départements cliniques · État en direct · Navigation inter-départements', ur: '62 کلینیکل محکمے · لائیو حالت · محکموں کے درمیان نیویگیشن' },
    'hub.total_depts': { ar: 'إجمالي الأقسام', en: 'Total Departments', fr: 'Départements Totaux', ur: 'کل محکمے' },
    'hub.healthy': { ar: 'يعمل', en: 'Healthy', fr: 'Sains', ur: 'صحت مند' },
    'hub.issues': { ar: 'مشاكل', en: 'Issues', fr: 'Problèmes', ur: 'مسائل' },
    'hub.ai_status': { ar: 'مساعد AI', en: 'AI Co-Pilot', fr: 'Co-Pilote IA', ur: 'AI معاون' },
    'hub.search': { ar: 'ابحث عن قسم...', en: 'Search department…', fr: 'Rechercher un département…', ur: 'محکمہ تلاش کریں…' },
    'hub.all_status': { ar: 'كل الحالات', en: 'All Status', fr: 'Tous Les Statuts', ur: 'تمام حالتیں' },
    'hub.healthy_only': { ar: 'يعمل فقط', en: 'Healthy', fr: 'Sains', ur: 'صحت مند' },
    'hub.issues_only': { ar: 'مشاكل فقط', en: 'Issues', fr: 'Problèmes', ur: 'مسائل' },
    'hub.reverify': { ar: '↻ إعادة التحقق', en: '↻ Re-verify', fr: '↻ Re-vérifier', ur: '↻ دوبارہ تصدیق' },
    'hub.all': { ar: 'الكل', en: 'All', fr: 'Tous', ur: 'سب' },
    'hub.updated': { ar: 'تحديث', en: 'Updated', fr: 'Mis à jour', ur: 'اپ ڈیٹ' },
    'hub.empty': { ar: 'لا توجد أقسام تطابق عوامل التصفية.', en: 'No departments match your filters.', fr: 'Aucun département ne correspond à vos filtres.', ur: 'کوئی محکمہ آپ کے فلٹرز سے مماثل نہیں ہے۔' },
    // ============ Groups ============
    'group.all': { ar: 'الكل', en: 'All', fr: 'Tous', ur: 'سب' },
    'group.cardiology': { ar: 'القلب', en: 'Cardiology', fr: 'Cardiologie', ur: 'قلب' },
    'group.critical': { ar: 'العناية المركزة', en: 'Critical Care', fr: 'Soins Critiques', ur: 'اہم نگہداشت' },
    'group.neuro': { ar: 'الأعصاب', en: 'Neurology', fr: 'Neurologie', ur: 'اعصاب' },
    'group.surgical': { ar: 'الجراحة', en: 'Surgical', fr: 'Chirurgical', ur: 'جراحی' },
    'group.pediatric': { ar: 'طب الأطفال', en: 'Pediatric', fr: 'Pédiatrique', ur: 'اطفال' },
    'group.mental': { ar: 'الصحة النفسية', en: 'Mental Health', fr: 'Santé Mentale', ur: 'ذہنی صحت' },
    'group.diagnostic': { ar: 'التشخيص', en: 'Diagnostic', fr: 'Diagnostique', ur: 'تشخیص' },
    'group.ai': { ar: 'بالذكاء الاصطناعي', en: 'AI-Powered', fr: 'Propulsé par IA', ur: 'AI سے چلنے والا' },
    'group.rehab': { ar: 'إعادة التأهيل', en: 'Rehabilitation', fr: 'Rééducation', ur: 'توانبخشی' },
    // ============ Station index ============
    'station.title': { ar: '🏥 فهرس الأقسام المباشر', en: '🏥 Live Station Index', fr: '🏥 Index des Stations en Direct', ur: '🏥 لائیو اسٹیشن انڈیکس' },
    'station.subtitle': { ar: 'كل الـ 59 قسماً سريريا يعمل على jumanasoft.com', en: 'All 59 clinical departments running live on jumanasoft.com', fr: 'Les 59 départements cliniques en direct sur jumanasoft.com', ur: 'تمام 59 کلینیکل محکمے jumanasoft.com پر چل رہے ہیں' },
    'station.total_depts': { ar: 'إجمالي الأقسام', en: 'Total Departments', fr: 'Départements Totaux', ur: 'کل محکمے' },
    'station.new_wave': { ar: 'جديد هذه الموجة', en: 'New This Wave', fr: 'Nouveau Cette Vague', ur: 'اس لہر میں نیا' },
    'station.last_verified': { ar: 'آخر تحقق', en: 'Last Verified', fr: 'Dernière Vérification', ur: 'آخری تصدیق' },
    'station.ai': { ar: '🤖', en: '🤖', fr: '🤖', ur: '🤖' },
    'station.new_label': { ar: 'جديد', en: 'NEW', fr: 'NOUVEAU', ur: 'نیا' },
    'station.live_label': { ar: 'مباشر', en: 'LIVE', fr: 'EN DIRECT', ur: 'لائیو' },
    'station.online': { ar: '✓ متصل', en: '✓ online', fr: '✓ en ligne', ur: '✓ آن لائن' },
    'station.checking': { ar: '⏳ جاري التحقق...', en: '⏳ checking...', fr: '⏳ vérification...', ur: '⏳ چیک ہو رہا ہے...' },
    // ============ Departments ============
    'dept.family_medicine': { ar: 'طب الأسرة', en: 'Family Medicine', fr: 'Médecine Familiale', ur: 'فیملی میڈیسن' },
    'dept.geriatrics': { ar: 'طب الشيخوخة', en: 'Geriatrics', fr: 'Gériatrie', ur: 'بزرگوں کی دیکھ بھال' },
    'dept.dental': { ar: 'طب الأسنان', en: 'Dental', fr: 'Dentisterie', ur: 'دانت' },
    'dept.ophthalmology': { ar: 'طب العيون', en: 'Ophthalmology', fr: 'Ophtalmologie', ur: 'آنکھوں کا طب' },
    'dept.ent': { ar: 'الأنف والأذن والحنجرة', en: 'ENT', fr: 'ORL', ur: 'ENT' },
    'dept.sports_medicine': { ar: 'طب الرياضة', en: 'Sports Medicine', fr: 'Médecine du Sport', ur: 'کھیلوں کا طب' },
    'dept.neurology': { ar: 'طب الأعصاب', en: 'Neurology', fr: 'Neurologie', ur: 'اعصاب' },
    'dept.orthopedics': { ar: 'العظام', en: 'Orthopedics', fr: 'Orthopédie', ur: 'ہڈیوں کا طب' },
    'dept.surgery': { ar: 'الجراحة', en: 'Surgery', fr: 'Chirurgie', ur: 'جراحی' },
    'dept.cardiology': { ar: 'أمراض القلب', en: 'Cardiology', fr: 'Cardiologie', ur: 'قلب' },
    'dept.oncology': { ar: 'طب الأورام', en: 'Oncology', fr: 'Oncologie', ur: 'سرطان کا طب' },
    'dept.allergy': { ar: 'الحساسية', en: 'Allergy', fr: 'Allergie', ur: 'الرجی' },
    'dept.anesthesia': { ar: 'التخدير', en: 'Anesthesia', fr: 'Anesthésie', ur: 'بے ہوشی' },
    'dept.audiology': { ar: 'السمعيات', en: 'Audiology', fr: 'Audiologie', ur: 'سمعیات' },
    'dept.burn_unit': { ar: 'وحدة الحروق', en: 'Burn Unit', fr: 'Unité des Brûlés', ur: 'جلنے کا یونٹ' },
    'dept.cardiac_rehab': { ar: 'تأهيل القلب', en: 'Cardiac Rehab', fr: 'Réadaptation Cardiaque', ur: 'دل کی توانبخشی' },
    'dept.ccu': { ar: 'العناية التاجية', en: 'CCU', fr: 'Unité de Soins Coronariens', ur: 'کورونری یونٹ' },
    'dept.cicu': { ar: 'العناية القلبية المركزة', en: 'CICU', fr: 'USIC Cardiaque', ur: 'دل کی ICU' },
    'dept.ctu': { ar: 'وحدة التجارب السريرية', en: 'CTU', fr: 'Unité de Recherche Clinique', ur: 'کلینیکل ٹرائل یونٹ' },
    'dept.dermatology': { ar: 'الجلدية', en: 'Dermatology', fr: 'Dermatologie', ur: 'جلد' },
    'dept.dialysis': { ar: 'غسيل الكلى', en: 'Dialysis', fr: 'Dialyse', ur: 'ڈائیلاسز' },
    'dept.epilepsy': { ar: 'الصرع', en: 'Epilepsy', fr: 'Épilepsie', ur: 'مرگی' },
    'dept.fetal_medicine': { ar: 'طب الجنين', en: 'Fetal Medicine', fr: 'Médecine Fœtale', ur: 'جنین کی دیکھ بھال' },
    'dept.genetics': { ar: 'علم الوراثة', en: 'Genetics', fr: 'Génétique', ur: 'جینیات' },
    'dept.headache': { ar: 'الصداع', en: 'Headache', fr: 'Céphalée', ur: 'سر درد' },
    'dept.hematology': { ar: 'أمراض الدم', en: 'Hematology', fr: 'Hématologie', ur: 'خون کی بیماری' },
    'dept.icu': { ar: 'العناية المركزة', en: 'ICU', fr: 'Unité de Soins Intensifs', ur: 'ICU' },
    'dept.immunology': { ar: 'علم المناعة', en: 'Immunology', fr: 'Immunologie', ur: 'مدافعتی نظام' },
    'dept.infection_control': { ar: 'مكافحة العدوى', en: 'Infection Control', fr: 'Contrôle des Infections', ur: 'انفیکشن کنٹرول' },
    'dept.infectious_disease': { ar: 'الأمراض المعدية', en: 'Infectious Disease', fr: 'Maladies Infectieuses', ur: 'متعدی امراض' },
    'dept.ivf': { ar: 'أطفال الأنابيب', en: 'IVF', fr: 'FIV', ur: 'IVF' },
    'dept.maternal_fetal': { ar: 'طب الأم والجنين', en: 'Maternal-Fetal', fr: 'Materno-Fœtal', ur: 'ماں اور جنین' },
    'dept.memory_clinic': { ar: 'عيادة الذاكرة', en: 'Memory Clinic', fr: 'Clinique Mémoire', ur: 'یادداشت کلینک' },
    'dept.movement': { ar: 'اضطرابات الحركة', en: 'Movement', fr: 'Troubles du Mouvement', ur: 'حرکت' },
    'dept.movement_disorders': { ar: 'اضطرابات الحركة', en: 'Movement Disorders', fr: 'Troubles du Mouvement', ur: 'حرکت کی خرابی' },
    'dept.multiple_sclerosis': { ar: 'التصلب المتعدد', en: 'Multiple Sclerosis', fr: 'Sclérose En Plaques', ur: 'ایم ایس' },
    'dept.neonatology': { ar: 'طب حديثي الولادة', en: 'Neonatology', fr: 'Néonatologie', ur: 'نوزائیدہ' },
    'dept.neuro_oncology': { ar: 'أورام الأعصاب', en: 'Neuro-Oncology', fr: 'Neuro-Oncologie', ur: 'نیورو آنکولوجی' },
    'dept.neurosurgery': { ar: 'جراحة الأعصاب', en: 'Neurosurgery', fr: 'Neurochirurgie', ur: 'نیورو سرجری' },
    'dept.nicu': { ar: 'العناية المركزة لحديثي الولادة', en: 'NICU', fr: 'Unité de Soins Intensifs Néonatals', ur: 'NICU' },
    'dept.nuclear_medicine': { ar: 'الطب النووي', en: 'Nuclear Medicine', fr: 'Médecine Nucléaire', ur: 'نیوکلیئر میڈیسن' },
    'dept.nutrition': { ar: 'التغذية', en: 'Nutrition', fr: 'Nutrition', ur: 'غذائیت' },
    'dept.occupational_therapy': { ar: 'العلاج الوظيفي', en: 'Occupational Therapy', fr: 'Ergothérapie', ur: 'پیشہ ورانہ تھراپی' },
    'dept.pain_management': { ar: 'إدارة الألم', en: 'Pain Management', fr: 'Gestion de la Douleur', ur: 'درد کا انتظام' },
    'dept.palliative_care': { ar: 'الرعاية التلطيفية', en: 'Palliative Care', fr: 'Soins Palliatifs', ur: 'متوازن نگہداشت' },
    'dept.pathology': { ar: 'علم الأمراض', en: 'Pathology', fr: 'Pathologie', ur: 'پیتھالوجی' },
    'dept.physiotherapy': { ar: 'العلاج الطبيعي', en: 'Physiotherapy', fr: 'Kinésithérapie', ur: 'فیزیوتھراپی' },
    'dept.picu': { ar: 'العناية المركزة للأطفال', en: 'PICU', fr: 'Unité de Soins Intensifs Pédiatriques', ur: 'PICU' },
    'dept.plastic_surgery': { ar: 'الجراحة التجميلية', en: 'Plastic Surgery', fr: 'Chirurgie Plastique', ur: 'پلاسٹک سرجری' },
    'dept.psychiatry': { ar: 'الطب النفسي', en: 'Psychiatry', fr: 'Psychiatrie', ur: 'نفسیات' },
    'dept.pulmonary_rehab': { ar: 'تأهيل الرئة', en: 'Pulmonary Rehab', fr: 'Réadaptation Pulmonaire', ur: 'پھیپھڑوں کی توانبخشی' },
    'dept.radiology': { ar: 'الأشعة', en: 'Radiology', fr: 'Radiologie', ur: 'ریڈیولاجی' },
    'dept.rehabilitation': { ar: 'إعادة التأهيل', en: 'Rehabilitation', fr: 'Rééducation', ur: 'توانبخشی' },
    'dept.sleep_medicine': { ar: 'طب النوم', en: 'Sleep Medicine', fr: 'Médecine du Sommeil', ur: 'نیند کا طب' },
    'dept.social_work': { ar: 'الخدمة الاجتماعية', en: 'Social Work', fr: 'Travail Social', ur: 'سماجی کام' },
    'dept.speech_therapy': { ar: 'علاج النطق', en: 'Speech Therapy', fr: 'Orthophonie', ur: 'تقریر کا علاج' },
    'dept.stroke_unit': { ar: 'وحدة السكتة الدماغية', en: 'Stroke Unit', fr: 'Unité AVC', ur: 'اسٹروک یونٹ' },
    'dept.thoracic_surgery': { ar: 'جراحة الصدر', en: 'Thoracic Surgery', fr: 'Chirurgie Thoracique', ur: 'سینے کی سرجری' },
    'dept.transplant': { ar: 'زرع الأعضاء', en: 'Transplant', fr: 'Transplantation', ur: 'ٹرانسپلانٹ' },
    'dept.trauma_surgery': { ar: 'جراحة الصدمات', en: 'Trauma Surgery', fr: 'Chirurgie Traumatologique', ur: 'ٹروما سرجری' },
    'dept.urology': { ar: 'المسالك البولية', en: 'Urology', fr: 'Urologie', ur: 'یورولوجی' },
    'dept.vascular_surgery': { ar: 'جراحة الأوعية', en: 'Vascular Surgery', fr: 'Chirurgie Vasculaire', ur: 'خون کی نالیوں کی سرجری' },
    'dept.wound_care': { ar: 'العناية بالجروح', en: 'Wound Care', fr: 'Soins des Plaies', ur: 'زخم کی دیکھ بھال' },
    'dept.ai': { ar: 'مساعد الذكاء الاصطناعي', en: 'AI Co-Pilot', fr: 'Co-Pilote IA', ur: 'AI معاون' }
};

// ============ I18nController ============
class I18n {
    constructor() {
        this.locale = this.detectLocale();
    }
    detectLocale() {
        const stored = localStorage.getItem('nama-locale');
        if (stored && I18N['common.run'][stored]) return stored;
        const browser = (navigator.language || 'en').substring(0, 2).toLowerCase();
        if (['ar', 'en', 'fr', 'ur'].includes(browser)) return browser;
        return 'en';
    }
    setLocale(locale) {
        if (I18N['common.run'][locale]) {
            this.locale = locale;
            localStorage.setItem('nama-locale', locale);
            document.documentElement.lang = locale;
            document.documentElement.dir = (locale === 'ar' || locale === 'ur') ? 'rtl' : 'ltr';
            this.apply();
        }
    }
    t(key) {
        const entry = I18N[key];
        if (!entry) return key;
        return entry[this.locale] || entry.en || key;
    }
    apply() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.t(key);
            if (text) el.textContent = text;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
        });
        if (document.getElementById('langSelect')) {
            document.getElementById('langSelect').value = this.locale;
        }
    }
}

const i18n = new I18n();
window.i18n = i18n;
document.addEventListener('DOMContentLoaded', () => {
    i18n.apply();
    const sel = document.getElementById('langSelect');
    if (sel) {
        sel.addEventListener('change', e => i18n.setLocale(e.target.value));
    }
});
