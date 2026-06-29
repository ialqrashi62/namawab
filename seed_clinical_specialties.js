/**
 * seed_clinical_specialties.js
 * Database seeder for the 100+ clinical subspecialties and EMR templates.
 */

const { Pool } = require('pg');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME = process.env.DB_NAME || 'nama_medical_web';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';

const pool = new Pool({
    host: DB_HOST,
    port: parseInt(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASSWORD
});

const DEPARTMENTS = [
    // I. Internal Medicine & Subspecialties
    { code: 'CARDIOLOGY', name_en: 'General Cardiology', name_ar: 'طب القلب العام', category: 'Internal Medicine' },
    { code: 'INTERVENTIONAL_CARDIOLOGY', name_en: 'Interventional Cardiology', name_ar: 'طب القلب التداخلي', category: 'Internal Medicine' },
    { code: 'ELECTROPHYSIOLOGY', name_en: 'Electrophysiology', name_ar: 'طب القلب الإلكتروفيزيولوجي', category: 'Internal Medicine' },
    { code: 'PREVENTIVE_CARDIOLOGY', name_en: 'Preventive Cardiology', name_ar: 'طب القلب الوقائي', category: 'Internal Medicine' },
    { code: 'CARDIAC_CATH', name_en: 'Cardiac Catheterization Lab', name_ar: 'قسطرة القلب', category: 'Internal Medicine' },
    { code: 'PULMONOLOGY', name_en: 'Pulmonology', name_ar: 'طب الصدر والجهاز التنفسي', category: 'Internal Medicine' },
    { code: 'SLEEP_MEDICINE', name_en: 'Sleep Medicine', name_ar: 'طب النوم واضطرابات التنفس', category: 'Internal Medicine' },
    { code: 'GASTROENTEROLOGY', name_en: 'Gastroenterology', name_ar: 'طب الجهاز الهضمي', category: 'Internal Medicine' },
    { code: 'HEPATOLOGY', name_en: 'Hepatology', name_ar: 'أمراض الكبد', category: 'Internal Medicine' },
    { code: 'NEPHROLOGY', name_en: 'General Nephrology', name_ar: 'طب الكلى العام', category: 'Internal Medicine' },
    { code: 'RENAL_DIALYSIS', name_en: 'Dialysis Unit', name_ar: 'وحدة غسيل الكلى', category: 'Internal Medicine' },
    { code: 'ONCOLOGY', name_en: 'Medical Oncology', name_ar: 'طب الأورام العام', category: 'Internal Medicine' },
    { code: 'HEMATOLOGY', name_en: 'Clinical Hematology', name_ar: 'أمراض الدم', category: 'Internal Medicine' },
    { code: 'ENDOCRINOLOGY', name_en: 'Endocrinology & Diabetology', name_ar: 'الغدد الصماء والسكري', category: 'Internal Medicine' },
    { code: 'RHEUMATOLOGY', name_en: 'Rheumatology', name_ar: 'الأمراض الروماتيزمية', category: 'Internal Medicine' },
    { code: 'INFECTIOUS_DISEASES', name_en: 'Infectious Diseases', name_ar: 'الأمراض المعدية', category: 'Internal Medicine' },
    { code: 'DERMATOLOGY', name_en: 'Dermatology', name_ar: 'الأمراض الجلدية', category: 'Internal Medicine' },

    // II. Surgical Departments
    { code: 'GENERAL_SURGERY', name_en: 'General Surgery', name_ar: 'الجراحة العامة', category: 'Surgical' },
    { code: 'SURGICAL_ONCOLOGY', name_en: 'Surgical Oncology', name_ar: 'جراحة الأورام العامة', category: 'Surgical' },
    { code: 'BARIATRIC_SURGERY', name_en: 'Bariatric Surgery', name_ar: 'جراحة السمنة المفرطة', category: 'Surgical' },
    { code: 'CARDIOTHORACIC_SURGERY', name_en: 'Cardiothoracic Surgery', name_ar: 'جراحة القلب والصدر', category: 'Surgical' },
    { code: 'VASCULAR_SURGERY', name_en: 'Vascular Surgery', name_ar: 'جراحة الأوعية الدموية', category: 'Surgical' },
    { code: 'NEUROSURGERY', name_en: 'Neurosurgery', name_ar: 'جراحة المخ والأعصاب', category: 'Surgical' },
    { code: 'SPINE_SURGERY', name_en: 'Spine Surgery', name_ar: 'جراحة العمود الفقري', category: 'Surgical' },
    { code: 'ORTHOPEDIC_SURGERY', name_en: 'Orthopedic Surgery', name_ar: 'جراحة العظام العامة', category: 'Surgical' },
    { code: 'OPHTHALMOLOGY', name_en: 'Ophthalmology', name_ar: 'طب وجراحة العيون', category: 'Surgical' },
    { code: 'ENT', name_en: 'Otolaryngology (ENT)', name_ar: 'الأنف والأذن والحنجرة', category: 'Surgical' },
    { code: 'UROLOGY', name_en: 'Urology', name_ar: 'جراحة المسالك البولية', category: 'Surgical' },
    { code: 'PLASTIC_SURGERY', name_en: 'Plastic & Reconstructive Surgery', name_ar: 'جراحة التجميل والترميم', category: 'Surgical' },

    // III. Obstetrics, Gynecology & Pediatrics
    { code: 'OBGYN', name_en: 'Obstetrics & Gynecology', name_ar: 'النساء والولادة العام', category: 'Women & Children' },
    { code: 'FETAL_MEDICINE', name_en: 'Maternal-Fetal Medicine', name_ar: 'طب الأم والجنين', category: 'Women & Children' },
    { code: 'IVF_LAB', name_en: 'Reproductive Endocrinology & IVF', name_ar: 'الإخصاب وأطفال الأنابيب', category: 'Women & Children' },
    { code: 'PEDIATRICS', name_en: 'General Pediatrics', name_ar: 'طب الأطفال العام', category: 'Women & Children' },
    { code: 'NEONATOLOGY_NICU', name_en: 'Neonatal ICU (NICU)', name_ar: 'العناية المركزة لحديثي الولادة', category: 'Women & Children' },
    { code: 'PEDIATRIC_CARDIOLOGY', name_en: 'Pediatric Cardiology', name_ar: 'قلب الأطفال', category: 'Women & Children' },

    // IV. Advanced Diagnostics
    { code: 'RADIOLOGY', name_en: 'Diagnostic Radiology', name_ar: 'الأشعة التشغيلية والتصوير', category: 'Diagnostics' },
    { code: 'INTERVENTIONAL_RAD', name_en: 'Interventional Radiology', name_ar: 'الأشعة التداخلية', category: 'Diagnostics' },
    { code: 'PATHOLOGY', name_en: 'Clinical Pathology & Histopathology', name_ar: 'المختبرات والباثولوجيا', category: 'Diagnostics' },
    { code: 'GENETICS', name_en: 'Medical Genetics', name_ar: 'علم الوراثة الطبية', category: 'Diagnostics' }
];

// Sample Form Structures for dynamic rendering
const CARDIOLOGY_TEMPLATE = {
    fields: [
        { name: 'chest_pain', type: 'select', label_en: 'Chest Pain Type', label_ar: 'نوع ألم الصدر', options: ['Typical Angina', 'Atypical Angina', 'Non-anginal', 'None'] },
        { name: 'bp_systolic', type: 'number', label_en: 'BP Systolic (mmHg)', label_ar: 'الضغط الانقباضي' },
        { name: 'bp_diastolic', type: 'number', label_en: 'BP Diastolic (mmHg)', label_ar: 'الضغط الانبساطي' },
        { name: 'ecg_finding', type: 'text', label_en: 'ECG Findings', label_ar: 'نتائج تخطيط القلب' },
        { name: 'ejec_fraction', type: 'number', label_en: 'Ejection Fraction (%)', label_ar: 'الكسر القذفي للقلب' }
    ]
};

const PEDIATRICS_NICU_TEMPLATE = {
    fields: [
        { name: 'birth_weight', type: 'number', label_en: 'Birth Weight (kg)', label_ar: 'وزن الولادة (كجم)' },
        { name: 'apgar_1m', type: 'number', label_en: 'APGAR Score (1 min)', label_ar: 'مقياس أبغار دقيقة' },
        { name: 'apgar_5m', type: 'number', label_en: 'APGAR Score (5 min)', label_ar: 'مقياس أبغار 5 دقائق' },
        { name: 'o2_saturation', type: 'number', label_en: 'O2 Saturation (%)', label_ar: 'نسبة الأكسجين بالدم' },
        { name: 'ventilator_mode', type: 'select', label_en: 'Ventilator Mode', label_ar: 'وضع جهاز التنفس', options: ['None', 'CPAP', 'SIMV', 'HFOV'] }
    ]
};

async function seed() {
    console.log('Starting specialties database seeding...');
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Insert Departments
        for (const dept of DEPARTMENTS) {
            await client.query(
                `INSERT INTO clinical_departments (code, name_en, name_ar, category)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (code) DO UPDATE 
                 SET name_en = EXCLUDED.name_en, name_ar = EXCLUDED.name_ar, category = EXCLUDED.category`,
                [dept.code, dept.name_en, dept.name_ar, dept.category]
            );
        }
        console.log(`✓ Seeded ${DEPARTMENTS.length} clinical departments.`);

        // Get cardiology & NICU department IDs
        const cardId = (await client.query("SELECT id FROM clinical_departments WHERE code = 'CARDIOLOGY'")).rows[0].id;
        const nicuId = (await client.query("SELECT id FROM clinical_departments WHERE code = 'NEONATOLOGY_NICU'")).rows[0].id;

        // 2. Insert Templates
        await client.query(
            `INSERT INTO clinical_templates (department_id, template_name_en, template_name_ar, form_structure)
             VALUES ($1, 'Cardiology Evaluation', 'نموذج الفحص القلبي', $2)
             ON CONFLICT DO NOTHING`,
            [cardId, JSON.stringify(CARDIOLOGY_TEMPLATE)]
        );

        await client.query(
            `INSERT INTO clinical_templates (department_id, template_name_en, template_name_ar, form_structure)
             VALUES ($1, 'NICU Admission & Vitals', 'دخول ومؤشرات العناية المركزة لحديثي الولادة', $2)
             ON CONFLICT DO NOTHING`,
            [nicuId, JSON.stringify(PEDIATRICS_NICU_TEMPLATE)]
        );

        await client.query('COMMIT');
        console.log('✓ Seeding clinical templates complete.');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Seeding failed:', e);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
