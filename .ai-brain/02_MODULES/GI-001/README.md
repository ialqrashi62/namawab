---
module_id: GI-001
name: "Gastroenterology"
parent: "Internal Medicine"
code: GI
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# GI-001 — Gastroenterology

## Mission
GI tract and hepatobiliary disease: GERD, PUD, IBD, IBS, hepatitis, cirrhosis, GI bleed, GI cancer. Includes endoscopy (EGD, colonoscopy, ERCP, EUS).

## Top 10 Conditions
1. GERD
2. Peptic ulcer disease
3. GI bleed (upper/lower)
4. Inflammatory bowel disease (Crohn's, UC)
5. Acute pancreatitis
6. Cholelithiasis / cholecystitis
7. Hepatitis (viral B, C)
8. Cirrhosis (any cause)
9. Colorectal cancer
10. IBS

## Workflow
1. **Clinic** — assessment, workup
2. **Endoscopy suite** — EGD, colonoscopy, ERCP, EUS
3. **Hepatology clinic** — chronic liver disease
4. **IBD clinic** — biologics management
5. **Inpatient consults** — GI bleed, pancreatitis

## Red Flags
- Acute upper GI bleed (hematemesis, melena)
- Acute severe colitis (Toxic megacolon risk)
- Acute liver failure
- Bowel perforation
- Boerhaave syndrome
- Acute mesenteric ischemia
- Biliary sepsis (Charcot's triad, Reynolds' pentad)

## AI Decision Support (existing `ai_gastro_orchestrator.js`)
- Endoscopy image analysis (polyp detection, IBD scoring)
- Liver disease risk (MELD, Child-Pugh)
- IBD activity (Mayo score, Harvey-Bradshaw)
- GI bleed risk stratification
- Hepatitis treatment eligibility

## Compliance
- JCI, ACG/ASGE guidelines, AASLD (liver)
- CBAHI gastroenterology
- MOH hepatitis program (elimination goals)

## L4 Validation: 6/6 PASS
- Red flags: GI bleed, perforation, liver failure
- Drug safety: biologics, immunosuppressants
- PHI: encrypted
- Auth: GI specialist, endoscopist
- Compliance: JCI, ACG, AASLD
- Tests: endoscopy, liver scores, IBD activity

---
*Tier-2. L4 validated.*
