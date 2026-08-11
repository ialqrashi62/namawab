"""
Build 5 more dept HTML pages + navigation hub + i18n entries.
"""
from pathlib import Path
import sys

OUTDIR = Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb_waveA_subagent\public\departments")

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DEPT_PAGES = [
    {
        "slug": "pulmonology",
        "forms": [
            ("form-asthma", "/api/pulmonology/asthma-control", "result-asthma", [
                ("patient_id", "common.patient_id", "number"),
                ("current_step", "current_step", "number", {"min": 1, "max": 6}),
                ("fev1_pct", "fev1_pct", "number", {"min": 5, "max": 150}),
                ("act_score", "act_score", "number", {"min": 0, "max": 25}),
            ]),
            ("form-copd", "/api/pulmonology/copd-severity", "result-copd", [
                ("patient_id", "common.patient_id", "number"),
                ("fev1_pct", "fev1_pct", "number", {"min": 5, "max": 150}),
                ("cat_score", "cat_score", "number", {"min": 0, "max": 40}),
                ("exacerbations_last_12m", "exacerbations_last_12m", "number", {"min": 0, "max": 20}),
            ]),
        ]
    },
    {
        "slug": "gi",
        "forms": [
            ("form-bleed", "/api/gi/bleed-risk", "result-bleed", [
                ("patient_id", "common.patient_id", "number"),
                ("hemoglobin_g_dL", "hemoglobin", "number", {"min": 1, "max": 25, "step": "0.1"}),
                ("sex", "sex", "select", ["male", "female"]),
                ("systolic_bp_mmHg", "systolic_bp", "number", {"min": 30, "max": 280}),
                ("pulse_bpm", "pulse_bpm", "number", {"min": 0, "max": 250}),
                ("BUN_mmol_L", "BUN", "number", {"min": 0, "max": 100, "step": "0.1"}),
                ("melena", "melena", "checkbox"),
                ("syncope", "syncope", "checkbox"),
                ("age", "age", "number", {"min": 0, "max": 120}),
                ("hepatic_disease", "hepatic_disease", "checkbox"),
                ("cardiac_failure", "cardiac_failure", "checkbox"),
                ("source", "source", "select", ["upper", "lower", "unknown"]),
            ]),
        ]
    },
    {
        "slug": "rheumatology",
        "forms": [
            ("form-das28", "/api/rheumatology/das28", "result-das28", [
                ("patient_id", "common.patient_id", "number"),
                ("tender_joints_28", "tender_joints", "number", {"min": 0, "max": 28}),
                ("swollen_joints_28", "swollen_joints", "number", {"min": 0, "max": 28}),
                ("crp_mg_L", "crp_mg_L", "number", {"min": 0, "max": 500, "step": "0.1"}),
                ("patient_global_vas_0_100", "patient_global_vas_0_100", "number", {"min": 0, "max": 100}),
            ]),
        ]
    },
    {
        "slug": "orthopedics",
        "forms": [
            ("form-frax", "/api/orthopedics/bone-density", "result-frax", [
                ("patient_id", "common.patient_id", "number"),
                ("age", "age", "number", {"min": 0, "max": 120}),
                ("sex", "sex", "select", ["male", "female"]),
                ("weight_kg", "weight_kg", "number", {"min": 0.5, "max": 300, "step": "0.1"}),
                ("prior_fracture", "prior_fracture", "checkbox"),
                ("femoral_neck_bmd_tscore", "femoral_neck_bmd_tscore", "number", {"min": -10, "max": 10, "step": "0.1"}),
            ]),
        ]
    },
    {
        "slug": "neurology",
        "forms": [
            ("form-nihss", "/api/neurology/nihss", "result-nihss", [
                ("patient_id", "common.patient_id", "number"),
                ("consciousness_lvlc", "consciousness_lvlc", "number", {"min": 0, "max": 3}),
                ("consciousness_lvl1a", "consciousness_lvl1a", "number", {"min": 0, "max": 2}),
                ("consciousness_lvl1b", "consciousness_lvl1b", "number", {"min": 0, "max": 2}),
                ("best_gaze", "best_gaze", "number", {"min": 0, "max": 2}),
                ("visual_field", "visual_field", "number", {"min": 0, "max": 3}),
                ("facial_palsy", "facial_palsy", "number", {"min": 0, "max": 3}),
                ("motor_arm_left", "motor_arm_left", "number", {"min": 0, "max": 4}),
                ("motor_arm_right", "motor_arm_right", "number", {"min": 0, "max": 4}),
                ("motor_leg_left", "motor_leg_left", "number", {"min": 0, "max": 4}),
                ("motor_leg_right", "motor_leg_right", "number", {"min": 0, "max": 4}),
                ("limb_ataxia", "limb_ataxia", "number", {"min": 0, "max": 2}),
                ("sensory", "sensory", "number", {"min": 0, "max": 2}),
                ("language", "language", "number", {"min": 0, "max": 3}),
                ("dysarthria", "dysarthria", "number", {"min": 0, "max": 2}),
                ("extinction_inattention", "extinction_inattention", "number", {"min": 0, "max": 2}),
            ]),
        ]
    },
]

def render_form(name, fields):
    rows = []
    for f in fields:
        field_name, i18n_key, field_type, *rest = f
        extra = rest[0] if rest else {}
        if field_type == "number":
            attrs = ["type=\"number\""]
            if "min" in extra: attrs.append(f"min=\"{extra['min']}\"")
            if "max" in extra: attrs.append(f"max=\"{extra['max']}\"")
            if "step" in extra: attrs.append(f"step=\"{extra['step']}\"")
            attr_str = " ".join(attrs)
            rows.append(f'''            <div class="form-row">
                <label>{i18n_key}</label>
                <input class="input" name="{field_name}" {attr_str} required />
            </div>''')
        elif field_type == "checkbox":
            rows.append(f'''            <div class="form-row">
                <label>{i18n_key}</label>
                <input class="input" name="{field_name}" type="checkbox" />
            </div>''')
        elif field_type == "select":
            opts = extra if isinstance(extra, list) else []
            opts_html = "\n".join([f'                    <option value="{o}">{o}</option>' for o in opts])
            rows.append(f'''            <div class="form-row">
                <label>{i18n_key}</label>
                <select class="select" name="{field_name}" required>
{opts_html}
                </select>
            </div>''')
    return "\n".join(rows)

def render_page(dept):
    slug = dept["slug"]
    forms_html = []
    binds = []
    for form_id, endpoint, result_id, fields in dept["forms"]:
        rows = render_form(form_id, fields)
        forms_html.append(f'''    <div class="card">
        <form id="{form_id}">
{rows}
            <div class="form-row">
                <button type="submit" class="btn btn-primary">Submit</button>
            </div>
        </form>
        <div id="{result_id}" class="result-block">
            <h3>Result</h3>
            <pre id="{result_id}-text"></pre>
        </div>
    </div>''')
        binds.append(f"    bind('{form_id}', '{endpoint}', '{result_id}');")

    return f'''<!DOCTYPE html>
<html lang="ar-SA" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>{slug.title()} - NamaMedical</title>
<link rel="stylesheet" href="/css/nama-tokens.css" />
</head>
<body>
<div class="container">
    <h1>{slug.title()}</h1>
    <div class="dept-meta">{slug} module</div>

{chr(10).join(forms_html)}
</div>

<script src="/js/nama-api.js"></script>
<script>
    async function bind(formId, endpoint, resultId) {{
        document.getElementById(formId).addEventListener('submit', async (e) => {{
            e.preventDefault();
            const fd = new FormData(e.target);
            const body = Object.fromEntries(fd.entries());
            const out = document.getElementById(resultId);
            out.classList.add('visible');
            document.getElementById(resultId + '-text').textContent = 'Loading...';
            try {{
                const r = await NamaApi.apiPost(endpoint, body);
                document.getElementById(resultId + '-text').textContent = JSON.stringify(r, null, 2);
            }} catch (err) {{
                document.getElementById(resultId + '-text').textContent = 'Error: ' + err.message;
            }}
        }});
    }}
{chr(10).join(binds)}
</script>
</body>
</html>
'''

for dept in DEPT_PAGES:
    out_file = OUTDIR / f"{dept['slug']}.html"
    out_file.write_text(render_page(dept), encoding="utf-8")
    print(f"  +1 {dept['slug']}.html")

# Navigation hub
nav = '''<!DOCTYPE html>
<html lang="ar-SA" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Departments - NamaMedical</title>
<link rel="stylesheet" href="/css/nama-tokens.css" />
<style>
    .dept-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 16px;
    }
    .dept-card {
        background: var(--nama-card);
        border: 1px solid var(--nama-border);
        border-radius: var(--nama-radius);
        padding: 20px;
        text-decoration: none;
        color: var(--nama-text);
        text-align: center;
        transition: all 0.2s;
    }
    .dept-card:hover {
        transform: translateY(-3px);
        box-shadow: var(--nama-shadow-lg);
        border-color: var(--nama-primary);
    }
    .dept-icon { font-size: 40px; margin-bottom: 8px; }
    .dept-name { font-weight: 600; color: var(--nama-primary); }
    .dept-tag { font-size: 11px; color: var(--nama-muted); margin-top: 4px; }
</style>
</head>
<body>
<div class="container">
    <h1>الأقسام الطبية — Departments</h1>
    <div class="dept-meta">
        14 dept modules · Stitch token-saver pages · AR/EN i18n
    </div>

    <div class="dept-grid">
        <a class="dept-card" href="cardiology.html"><div class="dept-icon">❤️</div><div class="dept-name">أمراض القلب</div><div class="dept-tag">Cardiology</div></a>
        <a class="dept-card" href="emergency.html"><div class="dept-icon">🚨</div><div class="dept-name">الطوارئ</div><div class="dept-tag">Emergency</div></a>
        <a class="dept-card" href="endocrinology.html"><div class="dept-icon">🩺</div><div class="dept-name">الغدد الصماء</div><div class="dept-tag">Endocrinology</div></a>
        <a class="dept-card" href="pediatrics.html"><div class="dept-icon">👶</div><div class="dept-name">طب الأطفال</div><div class="dept-tag">Pediatrics</div></a>
        <a class="dept-card" href="surgery.html"><div class="dept-icon">🔪</div><div class="dept-name">الجراحة</div><div class="dept-tag">Surgery</div></a>
        <a class="dept-card" href="pharmacy.html"><div class="dept-icon">💊</div><div class="dept-name">الصيدلية</div><div class="dept-tag">Pharmacy</div></a>
        <a class="dept-card" href="oncology.html"><div class="dept-icon">🎗️</div><div class="dept-name">الأورام</div><div class="dept-tag">Oncology</div></a>
        <a class="dept-card" href="nephrology.html"><div class="dept-icon">🩻</div><div class="dept-name">أمراض الكلى</div><div class="dept-tag">Nephrology</div></a>
        <a class="dept-card" href="obgyn.html"><div class="dept-icon">🤰</div><div class="dept-name">النساء والولادة</div><div class="dept-tag">OBGYN</div></a>
        <a class="dept-card" href="pulmonology.html"><div class="dept-icon">🫁</div><div class="dept-name">أمراض الجهاز التنفسي</div><div class="dept-tag">Pulmonology</div></a>
        <a class="dept-card" href="gi.html"><div class="dept-icon">🥼</div><div class="dept-name">الجهاز الهضمي</div><div class="dept-tag">Gastroenterology</div></a>
        <a class="dept-card" href="rheumatology.html"><div class="dept-icon">🦴</div><div class="dept-name">الروماتيزم</div><div class="dept-tag">Rheumatology</div></a>
        <a class="dept-card" href="orthopedics.html"><div class="dept-icon">🦵</div><div class="dept-name">العظام</div><div class="dept-tag">Orthopedics</div></a>
        <a class="dept-card" href="neurology.html"><div class="dept-icon">🧠</div><div class="dept-name">الأعصاب</div><div class="dept-tag">Neurology</div></a>
    </div>
</div>
</body>
</html>
'''

(OUTDIR / "hub.html").write_text(nav, encoding="utf-8")
print("  +1 hub.html (navigation)")
print(f"\nTotal pages: {len(DEPT_PAGES) + 1}")
