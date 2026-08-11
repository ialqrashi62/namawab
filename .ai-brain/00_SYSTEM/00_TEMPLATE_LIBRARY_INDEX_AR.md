# NamaMedical — Template Library Index
## 30+ قالب جاهز للـ AUTOPILOT / LOOP / MULTI-AGENT

> هذا الملف هو المؤشر الرئيسي لكل القوالب الجاهزة في `.ai-brain/00_SYSTEM/`.
> كل قالب مُصمَّم بحيث لو ملأت المتغيرات (department, kpis, scope) ينتج ملف نهائي مباشرة.

---

## القوالب (35 قالب)

### A. Architecture & Design (5)
1. `01_ARCHITECTURE_TEMPLATE_AR.md` — Architecture diagram + components
2. `02_DATA_MODEL_TEMPLATE_AR.md` — ERD, tables, relationships
3. `03_DESIGN_SYSTEM_TEMPLATE_AR.md` — MD3 tokens, components
4. `04_STYLE_GUIDE_TEMPLATE_AR.md` — colors, typography, spacing
5. `05_WIREFRAME_TEMPLATE_AR.md` — page layouts (Stitch-ready)

### B. API & Data (5)
6. `06_OPENAPI_TEMPLATE.yaml` — OpenAPI 3.0 spec
7. `07_USER_STORIES_TEMPLATE_AR.md` — user stories + acceptance
8. `08_TEST_CASES_TEMPLATE_AR.md` — test plan
9. `09_SEEDER_TEMPLATE.json` — anonymized fixtures
10. `10_MIGRATION_TEMPLATE.sql` — up/down migration

### C. Backend & Logic (4)
11. `11_ENGINE_TEMPLATE.js` — pure function engine
12. `12_ROUTER_TEMPLATE.js` — Express router + middleware
13. `13_RBAC_POLICIES_TEMPLATE.js` — role permissions
14. `14_ERROR_CODES_TEMPLATE.js` — error codebook

### D. AI & RAG (4)
15. `15_PROMPT_REGISTRY_TEMPLATE.json` — versioned prompts
16. `16_SYSTEM_PROMPT_TEMPLATE.md` — multi-locale system prompt
17. `17_LANGCHAIN_TEMPLATE.js` — chain spec
18. `18_RAG_PIPELINE_TEMPLATE.js` — chunk + embed + retrieve

### E. Compliance & Security (4)
19. `19_SECURITY_THREAT_MODEL_TEMPLATE_AR.md` — STRIDE
20. `20_COMPLIANCE_MATRIX_TEMPLATE_AR.md` — PDPL/NPHIES/CBAHI/ZATCA
21. `21_PENETRATION_TEST_TEMPLATE_AR.md` — pentest report
22. `22_AUDIT_TRAIL_TEMPLATE_AR.md` — hash-chained audit spec

### F. Operations (4)
23. `23_DEPLOY_RUNBOOK_TEMPLATE_AR.md` — deploy steps
24. `24_INCIDENT_PLAYBOOK_TEMPLATE_AR.md` — rollback
25. `25_CICD_PIPELINE_TEMPLATE.yml` — GitHub Actions
26. `26_OBSERVABILITY_TEMPLATE.yaml` — Prometheus + Grafana

### G. Frontend (4)
27. `27_HTML_PAGE_TEMPLATE.html` — Stitch MD3 page
28. `28_I18N_KEYS_TEMPLATE.json` — 4-locale keys
29. `29_USER_MANUAL_TEMPLATE_AR.md` — Arabic user guide
30. `30_TRAINING_VIDEO_SCRIPT_TEMPLATE_AR.md` — video script

### H. Project Management (5)
31. `31_AGILE_BOARD_TEMPLATE.json` — Scrum board
32. `32_BUDGET_TRACKER_TEMPLATE.json` — token + cost budget
33. `33_GTM_STRATEGY_TEMPLATE_AR.md` — go-to-market
34. `34_HELPDESK_TEMPLATE_AR.md` — support system
35. `35_SEO_OPTIMIZATION_TEMPLATE_AR.md` — SEO meta + sitemap

---

## طريقة الاستخدام

```bash
# 1. اختر القسم
DEPT="cardiology"
WAVE="W06"

# 2. انسخ القوالب إلى مجلد القسم
mkdir -p .ai-brain/02_MODULES/$DEPT/{prompts,docs,api,frontend,legal,ops}
cp .ai-brain/00_SYSTEM/01_ARCHITECTURE_TEMPLATE_AR.md .ai-brain/02_MODULES/$DEPT/docs/01_ARCHITECTURE_AR.md
# ... etc

# 3. ملأ المتغيرات
# DEPT, SCOPE, KPIS, ROUTES, TABLES, SCREENS

# 4. AUTOPILOT يكمل الباقي
node .ai-brain/03_AUTOPILOT/autopilot.js --dept=$DEPT --wave=$WAVE
```

---

> **Status:** مكتبة القوالب مكتملة، 35 قالب جاهز للاستخدام في W06+.
