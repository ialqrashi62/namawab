// filepath: .ai-brain/03_AUTOPILOT/batch_generate_depts.js
// Batch generate remaining dept pages (urology, plastic_surgery, vascular_surgery, etc.)
// Pattern: nm-stitch-google + nm-frontend-bridge
'use strict';

const fs = require('fs');
const path = require('path');

const COLORS = {
    urology:         '#9333EA',
    plastic_surgery: '#EC4899',
    vascular_surgery:'#BE123C',
    thoracic_surgery:'#C2410C',
    neurosurgery:    '#0F766E',
    trauma_surgery:  '#991B1B',
    anesthesia:      '#7E22CE',
    pain_management: '#0E7490',
    palliative_care: '#52525B',
    rehabilitation:  '#0EA5E9',
    physiotherapy:   '#06B6D4',
    occupational_therapy: '#14B8A6',
    nutrition:       '#65A30D',
    psychiatry:      '#8B5CF6',
    sleep_medicine:  '#1E3A8A',
    genetics:        '#7C2D12',
    immunology:      '#A21CAF',
    allergy:         '#BE185D',
    infectious_disease: '#0F172A',
    dermatology:     '#F472B6',
    radiology:       '#0F766E',
    pathology:       '#475569',
    nuclear_medicine:'#0C4A6E',
    hematology:      '#831843',
    audiology:       '#9333EA',
    speech_therapy:  '#7C3AED',
    social_work:     '#0F766E',
    chaplaincy:      '#A16207',
    infection_control: '#B91C1C',
    wound_care:      '#9D174D',
    burn_unit:       '#C2410C',
    transplant:      '#065F46',
    dialysis:        '#0E7490',
    ivf:             '#9F1239',
    fetal_medicine:  '#831843',
    maternal_fetal:  '#9F1239',
    neonatology:     '#F472B6',
    nicu:            '#0EA5E9',
    picu:            '#06B6D4',
    icu:             '#0891B2',
    ccu:             '#991B1B',
    cicu:            '#BE123C',
    ctu:             '#7C2D12',
    cardiac_rehab:   '#BE123C',
    pulmonary_rehab: '#0EA5E9',
    stroke_unit:     '#7C3AED',
    memory_clinic:   '#6B21A8',
    movement_disorders: '#581C87',
    epilepsy:        '#A21CAF',
    headache:        '#86198F',
    multiple_sclerosis: '#9333EA',
    neuro_oncology:  '#581C87',
    movement:        '#6B21A8'
};

const ICONS = {
    urology: '🩺', plastic_surgery: '💉', vascular_surgery: '🩸',
    thoracic_surgery: '🫁', neurosurgery: '🧠', trauma_surgery: '🚑',
    anesthesia: '💊', pain_management: '⚡', palliative_care: '🕊️',
    rehabilitation: '🏃', physiotherapy: '🤸', occupational_therapy: '🖐️',
    nutrition: '🥗', psychiatry: '🧘', sleep_medicine: '🌙',
    genetics: '🧬', immunology: '🛡️', allergy: '🤧',
    infectious_disease: '🦠', dermatology: '🧴', radiology: '📡',
    pathology: '🔬', nuclear_medicine: '☢️', hematology: '🩸',
    audiology: '👂', speech_therapy: '🗣️', social_work: '🤝',
    chaplaincy: '⛪', infection_control: '🦠', wound_care: '🩹',
    burn_unit: '🔥', transplant: '🫀', dialysis: '💧',
    ivf: '👶', fetal_medicine: '🤰', maternal_fetal: '🤰',
    neonatology: '👶', nicu: '👶', picu: '👶', icu: '🏥', ccu: '❤️',
    cicu: '❤️', ctu: '🫁', cardiac_rehab: '❤️', pulmonary_rehab: '🫁',
    stroke_unit: '🧠', memory_clinic: '🧠', movement_disorders: '🧠',
    epilepsy: '⚡', headache: '🤕', multiple_sclerosis: '🧠',
    neuro_oncology: '🧠', movement: '🧠'
};

function makePage(dept, color, icon) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title data-i18n="${dept}.page_title">${dept} · NamaMedical</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  :root { --md-ref-typeface-brand: 'Cairo','Roboto',sans-serif; --md-sys-color-primary: ${color}; }
  html[lang="en"], html[lang="fr"] { --md-ref-typeface-brand: 'Roboto','Cairo',sans-serif; }
  body { font-family: var(--md-ref-typeface-brand); margin: 0; background: ${color}0A; color: #191C1B; }
  .md-shell { display: grid; grid-template-rows: 64px 1fr; min-height: 100vh; }
  .md-app-bar { display: flex; align-items: center; padding: 0 24px; gap: 16px; background: white; border-bottom: 1px solid rgba(0,0,0,.06); }
  .md-app-bar h1 { font-size: 18px; margin: 0; font-weight: 600; }
  .md-content { padding: 24px; max-width: 1200px; margin: 0 auto; }
  .md-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap: 16px; }
  .md-card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,.06); }
  .md-card-title { margin: 0 0 8px; font-size: 18px; font-weight: 600; color: var(--md-sys-color-primary); }
  .md-btn { display: inline-flex; padding: 10px 24px; border-radius: 999px; border: 0; background: var(--md-sys-color-primary); color: white; font-weight: 500; cursor: pointer; }
  .md-lang-toggle { margin-inline-start: auto; display: flex; gap: 4px; }
  .md-lang-toggle button { background: transparent; border: 1px solid #6F7978; border-radius: 999px; padding: 4px 12px; cursor: pointer; }
  .md-lang-toggle button.active { background: var(--md-sys-color-primary); color: white; border-color: var(--md-sys-color-primary); }
</style>
</head>
<body>
<div class="md-shell">
  <header class="md-app-bar">
    <span style="font-size:24px">${icon}</span>
    <h1 data-i18n="${dept}.page_title">${dept}</h1>
    <div class="md-lang-toggle">
      <button id="btn-ar" class="active" onclick="setLang('ar')">عربي</button>
      <button id="btn-en" onclick="setLang('en')">EN</button>
      <button id="btn-fr" onclick="setLang('fr')">FR</button>
      <button id="btn-ur" onclick="setLang('ur')">UR</button>
    </div>
  </header>
  <main class="md-content">
    <div class="md-grid">
      <div class="md-card">
        <h3 class="md-card-title" data-i18n="${dept}.overview">نظرة عامة</h3>
        <p class="md-card-sub" data-i18n="${dept}.overview_sub">مرضى اليوم، المواعيد، الإجراءات</p>
      </div>
      <div class="md-card">
        <h3 class="md-card-title" data-i18n="${dept}.queue_title">قائمة المرضى</h3>
        <p class="md-card-sub" data-i18n="${dept}.queue_sub">حسب الأولوية والحالة</p>
        <button class="md-btn" data-i18n="${dept}.view_queue">عرض القائمة</button>
      </div>
      <div class="md-card">
        <h3 class="md-card-title" data-i18n="${dept}.form_title">نموذج جديد</h3>
        <p class="md-card-sub" data-i18n="${dept}.form_sub">إضافة تقييم أو إجراء</p>
      </div>
    </div>
  </main>
</div>
<script src="/js/nama-i18n.js"></script>
<script src="/js/nama-api.js"></script>
<script>
async function setLang(lang) {
    localStorage.setItem('nama_lang', lang);
    document.documentElement.dir = (lang === 'ar' || lang === 'ur') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.querySelectorAll('.md-lang-toggle button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + lang).classList.add('active');
    await namaI18n.loadLocale(lang);
    namaI18n.applyTranslations();
}
document.addEventListener('DOMContentLoaded', async () => {
    const lang = localStorage.getItem('nama_lang') || 'ar';
    await setLang(lang);
});
</script>
</body>
</html>`;
}

function makeI18n(dept, displayAr, displayEn) {
    return {
        ar: {
            [`${dept}.page_title`]: displayAr,
            [`${dept}.overview`]: 'نظرة عامة',
            [`${dept}.overview_sub`]: 'مرضى اليوم، المواعيد، الإجراءات',
            [`${dept}.queue_title`]: 'قائمة المرضى',
            [`${dept}.queue_sub`]: 'حسب الأولوية والحالة',
            [`${dept}.view_queue`]: 'عرض القائمة',
            [`${dept}.form_title`]: 'نموذج جديد',
            [`${dept}.form_sub`]: 'إضافة تقييم أو إجراء',
            [`${dept}.back`]: 'عودة'
        },
        en: {
            [`${dept}.page_title`]: displayEn,
            [`${dept}.overview`]: 'Overview',
            [`${dept}.overview_sub`]: 'Today\'s patients, appointments, procedures',
            [`${dept}.queue_title`]: 'Patient queue',
            [`${dept}.queue_sub`]: 'By priority and status',
            [`${dept}.view_queue`]: 'View queue',
            [`${dept}.form_title`]: 'New form',
            [`${dept}.form_sub`]: 'Add assessment or procedure',
            [`${dept}.back`]: 'Back'
        },
        fr: {
            [`${dept}.page_title`]: displayEn,
            [`${dept}.overview`]: 'Aperçu',
            [`${dept}.overview_sub`]: 'Patients du jour, rendez-vous, procédures',
            [`${dept}.queue_title`]: 'File d\'attente',
            [`${dept}.queue_sub`]: 'Par priorité et statut',
            [`${dept}.view_queue`]: 'Voir la file',
            [`${dept}.form_title`]: 'Nouveau formulaire',
            [`${dept}.form_sub`]: 'Ajouter une évaluation ou procédure',
            [`${dept}.back`]: 'Retour'
        },
        ur: {
            [`${dept}.page_title`]: displayEn,
            [`${dept}.overview`]: 'جائزہ',
            [`${dept}.overview_sub`]: 'آج کے مریض، اپائنٹمنٹس، طریقہ کار',
            [`${dept}.queue_title`]: 'مریضوں کی قطار',
            [`${dept}.queue_sub`]: 'ترجیح اور حالت کے مطابق',
            [`${dept}.view_queue`]: 'قطار دیکھیں',
            [`${dept}.form_title`]: 'نیا فارم',
            [`${dept}.form_sub`]: 'تشخیص یا طریقہ کار شامل کریں',
            [`${dept}.back`]: 'واپس'
        }
    };
}

function main() {
    const OUTPUT_BASE = path.join('.ai-brain', '04_FRONTEND');
    let count = 0;

    for (const [dept, color] of Object.entries(COLORS)) {
        const dir = path.join(OUTPUT_BASE, dept);
        fs.mkdirSync(dir, { recursive: true });

        const icon = ICONS[dept] || '🏥';
        const displayAr = dept.replace(/_/g, ' ');
        const displayEn = dept.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // HTML
        fs.writeFileSync(path.join(dir, 'index.html'), makePage(dept, color, icon));

        // i18n files
        const i18n = makeI18n(dept, displayAr, displayEn);
        for (const [locale, keys] of Object.entries(i18n)) {
            fs.writeFileSync(path.join(dir, `i18n_${locale}.json`), JSON.stringify(keys, null, 2));
        }

        count++;
        console.log(`✓ ${dept}`);
    }

    console.log(`\nGenerated ${count} dept frontends.`);
}

main();