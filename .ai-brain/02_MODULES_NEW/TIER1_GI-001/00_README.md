# GI-001 — Gastroenterology Department Blueprint (Tier-1)

> **Generated:** 2026-08-01
> **Tier:** 1 (autopilot full pack)
> **Status:** ✅ SHIPPED (60 files + README)
> **Mode:** MODE 2 — full blueprint pack

---

## A. Top 10 conditions

| Rank | Condition | ICD-10 | SNOMED |
|------|-----------|--------|--------|
| 1 | GERD | K21 | 235595009 |
| 2 | Peptic ulcer disease (gastric/duod) | K25/K26 | 13200003 / 5187006 |
| 3 | IBD (Crohn/UC) | K50/K51 | 34000006 / 64766004 |
| 4 | IBS | K58 | 271977004 |
| 5 | Hepatitis B/C | B18 | 66071002 / 735538005 |
| 6 | Liver cirrhosis | K74 | 19943007 |
| 7 | Acute pancreatitis | K85 | 75694006 |
| 8 | Colorectal cancer | C18/C19/C20 | 363346000 |
| 9 | GI bleeding (upper/lower) | K92 | 37372002 / 94114001 |
| 10 | Cholelithiasis / cholangitis | K80/K83 | 200771003 / 56726007 |

## B. Top 20 procedures

| Rank | Procedure | CPT/SBMI |
|------|-----------|----------|
| 1 | EGD + biopsy | 43239 |
| 2 | Colonoscopy + polypectomy | 45385 |
| 3 | ERCP + sphincterotomy | 43262 |
| 4 | EUS (diagnostic) | 43238 |
| 5 | Capsule endoscopy | 91110 |
| 6 | Liver biopsy (image-guided) | 47000 |
| 7 | Paracentesis | 49080 |
| 8 | PEG tube placement | 43246 |
| 9 | Variceal band ligation | 43244 |
| 10 | Barrett ablation (RFA) | 43270 |
| 11 | Hemorrhoid banding | 46221 |
| 12 | Fecal microbiota transplant | - |
| 13 | TIPS (radiology-driven) | 37182 |
| 14 | Endoscopic submucosal dissection | 43257 |
| 15 | Balloon enteroscopy | 44367 |
| 16 | ERCP + stent | 43266 |
| 17 | PEG-J tube | 44187 |
| 18 | Endoscopic ultrasound FNA | 43242 |
| 19 | Cyanoacrylate injection (GV) | 43243 |
| 20 | Cholangioscopy | 31627 |

## C. Critical alerts

| Alert | Trigger | Action |
|-------|---------|--------|
| Acute variceal bleed | hematemesis + cirrhosis | STAT EGD + band |
| Acute severe UGIB | hemoglobin drop + melena | STAT EGD + scope |
| Acute cholangitis (Charcot) | fever + jaundice + RUQ pain | STAT ERCP |
| Acute fulminant hepatic failure | INR>1.5 + encephalopathy | STAT ICU + transplant eval |
| Boerhaave | vomiting + chest pain + sepsis | STAT CT + surgical |
| Mesenteric ischemia | pain out of proportion + lactate | STAT CTA + surgery |
| Bowel perforation | free air on CT | STAT surgery |

---

## Files (60 + README)

```
01-04: clinical_top10.md, conditions.md, snomed.md, red_flags.md
05-13: prompt_engineering.md, system_prompt.md, context_window.md,
       workflow_orchestration.md, langchain_chains.md, rag_chains.md,
       vector_store_schema.md, llm_prompts.md, llm_observability.md
14-19: engine_module.md, routes_api.md, middleware_chain.md,
       data_flow.md, erd_diagram.md, openapi_spec.md
20-25: ADR, dbml, migration_up.sql, migration_down.sql, validate, seed
26-31: stitch, wireframes, i18n, design_tokens, user_stories, acceptance_criteria
32-41: business_flow, rbac, pentest, security, secrets, deploy,
       ci_cd, monitoring, backup_dr, incident_response
42-48: jci, iso, pdpl, nphies_zatca, consent, legal, audit
49-52: unit_tests, integration_tests, e2e_tests, test_plan
53-59: user_manual, training, helpdesk, budget, tasks, seo, gtm
60:     closeout
```

---

*ORC — 2026-08-01 — Tier-1 AUTOPILOT batch*
