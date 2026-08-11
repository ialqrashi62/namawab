"""
Build Stitch HTML pages for all dept modules (token-saver approach).
Each page uses shared nama-tokens.css + nama-api.js + nama-i18n.js.
"""
from pathlib import Path
import sys

OUTDIR = Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE\namaweb_waveA_subagent\public\departments")

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

DEPT_PAGES = [
    {
        "slug": "emergency",
        "title_key": "emergency.title",
        "subtitle_key": "emergency.subtitle",
        "forms": [
            ("form-triage", "/api/emergency/triage", "result-triage", [
                ("patient_id", "common.patient_id", "number"),
                ("chief_complaint", "emergency.chief_complaint", "text"),
                ("heart_rate", "emergency.heart_rate", "number", {"min": 0, "max": 300}),
                ("systolic_bp", "emergency.systolic_bp", "number", {"min": 0, "max": 300}),
                ("spo2_pct", "emergency.spo2", "number", {"min": 0, "max": 100}),
                ("rr_per_min", "emergency.rr", "number", {"min": 0, "max": 80}),
                ("gcs_total", "emergency.gcs", "number", {"min": 3, "max": 15}),
            ]),
        ]
    },
    {
        "slug": "endocrinology",
        "title_key": "endocrinology.title",
        "subtitle_key": "endocrinology.subtitle",
        "forms": [
            ("form-glycemic", "/api/endocrine/glycemic/assess", "result-glycemic", [
                ("patient_id", "common.patient_id", "number"),
                ("patient_type", "patient_type", "select", ["type1", "type2", "pregnancy", "elderly", "frail", "pediatric"]),
                ("age", "age", "number", {"min": 0, "max": 120}),
                ("tir_pct", "tir_pct", "number", {"min": 0, "max": 100}),
                ("hba1c", "hba1c", "number", {"min": 3, "max": 20}),
            ]),
            ("form-thyroid", "/api/endocrine/thyroid/interpret", "result-thyroid", [
                ("patient_id", "common.patient_id", "number"),
                ("tsh", "endocrinology.tsh", "number", {"step": "0.01"}),
                ("ft4", "endocrinology.ft4", "number", {"step": "0.01"}),
            ]),
        ]
    },
    {
        "slug": "pediatrics",
        "title_key": "pediatrics.title",
        "subtitle_key": "pediatrics.subtitle",
        "forms": [
            ("form-apgar", "/api/pediatrics/apgar", "result-apgar", [
                ("patient_id", "common.patient_id", "number"),
                ("appearance", "pediatrics.appearance", "number", {"min": 0, "max": 2}),
                ("pulse", "pediatrics.pulse", "number", {"min": 0, "max": 2}),
                ("grimace", "pediatrics.grimace", "number", {"min": 0, "max": 2}),
                ("activity", "pediatrics.activity", "number", {"min": 0, "max": 2}),
                ("respiration", "pediatrics.respiration", "number", {"min": 0, "max": 2}),
            ]),
            ("form-vitals", "/api/pediatrics/vitals", "result-vitals", [
                ("patient_id", "common.patient_id", "number"),
                ("age_years", "age_years", "number", {"min": 0, "max": 18, "step": "0.5"}),
                ("heart_rate", "heart_rate", "number", {"min": 0, "max": 300}),
                ("rr_per_min", "rr_per_min", "number", {"min": 0, "max": 100}),
                ("systolic_bp", "systolic_bp", "number", {"min": 0, "max": 250}),
            ]),
        ]
    },
    {
        "slug": "surgery",
        "title_key": "surgery.title",
        "subtitle_key": "surgery.subtitle",
        "forms": [
            ("form-asa", "/api/surgery/asa", "result-asa", [
                ("patient_id", "common.patient_id", "number"),
                ("asa_class", "surgery.asa_class", "number", {"min": 1, "max": 6}),
                ("emergency", "surgery.emergency", "checkbox"),
            ]),
            ("form-timeout", "/api/surgery/timeout", "result-timeout", [
                ("patient_id", "common.patient_id", "number"),
                ("phase", "surgery.phase", "select", ["sign_in", "time_out", "sign_out"]),
                ("completed_items", "surgery.completed_items", "text"),
            ]),
        ]
    },
    {
        "slug": "pharmacy",
        "title_key": "pharmacy.title",
        "subtitle_key": "pharmacy.subtitle",
        "forms": [
            ("form-interactions", "/api/pharmacy/interactions", "result-interactions", [
                ("patient_id", "common.patient_id", "number"),
                ("drugs", "pharmacy.drugs", "text"),
            ]),
            ("form-renal-dose", "/api/pharmacy/renal-dose", "result-renal-dose", [
                ("patient_id", "common.patient_id", "number"),
                ("drug_name", "pharmacy.drug_name", "text"),
                ("standard_dose_mg", "pharmacy.standard_dose_mg", "number", {"min": 0.01, "max": 5000, "step": "0.01"}),
                ("frequency_per_day", "pharmacy.frequency_per_day", "number", {"min": 1, "max": 24}),
                ("age", "age", "number", {"min": 0, "max": 120}),
                ("weight_kg", "weight_kg", "number", {"min": 0.5, "max": 300, "step": "0.1"}),
                ("serum_creatinine_mg_dl", "serum_creatinine_mg_dl", "number", {"min": 0.1, "max": 30, "step": "0.01"}),
                ("sex", "sex", "select", ["male", "female"]),
            ]),
        ]
    },
    {
        "slug": "oncology",
        "title_key": "oncology.title",
        "subtitle_key": "oncology.subtitle",
        "forms": [
            ("form-tnm", "/api/oncology/tnm", "result-tnm", [
                ("patient_id", "common.patient_id", "number"),
                ("T", "oncology.T", "number", {"min": 0, "max": 4}),
                ("N", "oncology.N", "number", {"min": 0, "max": 3}),
                ("M", "oncology.M", "number", {"min": 0, "max": 1}),
            ]),
            ("form-chemo", "/api/oncology/chemo-dose", "result-chemo", [
                ("patient_id", "common.patient_id", "number"),
                ("drug_name", "drug_name", "text"),
                ("dose_per_m2", "oncology.dose_per_m2", "number", {"min": 0.01, "max": 5000, "step": "0.01"}),
                ("height_cm", "oncology.height_cm", "number", {"min": 30, "max": 250}),
                ("weight_kg", "oncology.weight_kg", "number", {"min": 0.5, "max": 300, "step": "0.1"}),
                ("dose_unit", "dose_unit", "select", ["mg_per_m2", "auc"]),
            ]),
        ]
    },
    {
        "slug": "nephrology",
        "title_key": "nephrology.title",
        "subtitle_key": "nephrology.subtitle",
        "forms": [
            ("form-ckd", "/api/nephrology/ckd-stage", "result-ckd", [
                ("patient_id", "common.patient_id", "number"),
                ("age", "age", "number", {"min": 0, "max": 120}),
                ("sex", "sex", "select", ["male", "female"]),
                ("creatinine_mg_dL", "creatinine_mg_dL", "number", {"min": 0.1, "max": 30, "step": "0.01"}),
                ("albuminuria_category", "nephrology.albuminuria", "select", ["A1", "A2", "A3"]),
            ]),
        ]
    },
    {
        "slug": "obgyn",
        "title_key": "obgyn.title",
        "subtitle_key": "obgyn.subtitle",
        "forms": [
            ("form-bishop", "/api/obgyn/bishop-score", "result-bishop", [
                ("patient_id", "common.patient_id", "number"),
                ("dilation_cm", "obgyn.dilation_cm", "number", {"min": 0, "max": 10, "step": "0.5"}),
                ("effacement_pct", "effacement_pct", "number", {"min": 0, "max": 100}),
                ("station", "station", "number", {"min": -5, "max": 5}),
                ("consistency", "consistency", "select", ["firm", "medium", "soft"]),
                ("position", "position", "select", ["posterior", "mid", "anterior"]),
            ]),
        ]
    },
]

def render_form(name, endpoint, fields):
    rows = []
    for f in fields:
        field_name = f[0]
        i18n_key = f[1]
        field_type = f[2]
        extra = f[3] if len(f) > 3 else {}
        attrs = []
        if field_type == "number":
            attrs.append(f"type=\"number\"")
            if "min" in extra: attrs.append(f"min=\"{extra['min']}\"")
            if "max" in extra: attrs.append(f"max=\"{extra['max']}\"")
            if "step" in extra: attrs.append(f"step=\"{extra['step']}\"")
        elif field_type == "checkbox":
            pass
        elif field_type == "select":
            pass
        else:
            attrs.append("type=\"text\"")
        attrs.append("required")
        attr_str = " ".join(attrs)

        if field_type == "checkbox":
            row = f'''            <div class="form-row">
                <label data-i18n="{i18n_key}">{field_name}</label>
                <input class="input" name="{field_name}" type="checkbox" />
            </div>'''
        elif field_type == "select":
            opts = extra if isinstance(extra, list) else []
            opts_html = "\n".join([f'                    <option value="{o}">{o}</option>' for o in opts])
            row = f'''            <div class="form-row">
                <label data-i18n="{i18n_key}">{field_name}</label>
                <select class="select" name="{field_name}" required>
{opts_html}
                </select>
            </div>'''
        else:
            row = f'''            <div class="form-row">
                <label data-i18n="{i18n_key}">{field_name}</label>
                <input class="input" name="{field_name}" {attr_str} />
            </div>'''
        rows.append(row)
    return "\n".join(rows)

def render_page(dept):
    slug = dept["slug"]
    forms_html = []
    binds = []
    for form_id, endpoint, result_id, fields in dept["forms"]:
        rows = render_form(form_id, endpoint, fields)
        forms_html.append(f'''    <div class="card">
        <form id="{form_id}">
{rows}
            <div class="form-row">
                <button type="submit" class="btn btn-primary" data-i18n="common.submit">Submit</button>
            </div>
        </form>
        <div id="{result_id}" class="result-block">
            <h3 data-i18n="common.result">Result</h3>
            <pre id="{result_id}-text"></pre>
        </div>
    </div>''')
        binds.append(f"    bind('{form_id}', '{endpoint}', '{result_id}');")

    return f'''<!DOCTYPE html>
<html lang="ar-SA" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title data-i18n="{dept['title_key']}">{slug.title()} - NamaMedical</title>
<link rel="stylesheet" href="/css/nama-tokens.css" />
</head>
<body>
<div class="container">
    <h1 data-i18n="{dept['title_key']}">{slug.title()}</h1>
    <div class="dept-meta" data-i18n="{dept['subtitle_key']}">{slug} module</div>

    <div style="text-align:left;margin-bottom:16px">
        <button class="btn btn-warning" id="lang-toggle" data-i18n="common.toggle_lang">EN</button>
    </div>

{chr(10).join(forms_html)}
</div>

<script src="/js/nama-i18n.js"></script>
<script src="/js/nama-api.js"></script>
<script>
    NamaI18n.onLoad((dict, locale) => {{
        document.documentElement.lang = locale;
        document.documentElement.dir  = locale === 'ar' ? 'rtl' : 'ltr';
        document.querySelectorAll('[data-i18n]').forEach(el => {{
            const key = el.getAttribute('data-i18n');
            el.textContent = NamaI18n.t(key, el.textContent);
        }});
        const btn = document.getElementById('lang-toggle');
        btn.textContent = locale === 'ar' ? 'EN' : 'AR';
    }});
    document.getElementById('lang-toggle').addEventListener('click', () => {{
        const next = NamaI18n.current() === 'ar' ? 'en' : 'ar';
        NamaI18n.loadLocale(next);
    }});

    async function bind(formId, endpoint, resultId) {{
        document.getElementById(formId).addEventListener('submit', async (e) => {{
            e.preventDefault();
            const fd = new FormData(e.target);
            const body = Object.fromEntries(fd.entries());
            const out = document.getElementById(resultId);
            out.classList.add('visible');
            document.getElementById(resultId + '-text').textContent = NamaI18n.t('common.loading');
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

print(f"\nTotal pages: {len(DEPT_PAGES)}")
