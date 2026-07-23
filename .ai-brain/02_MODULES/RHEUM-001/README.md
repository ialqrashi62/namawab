---
module_id: RHEUM-001
name: "Rheumatology"
parent: "Internal Medicine"
code: RHEUM
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
---

# RHEUM-001 — Rheumatology

## Mission
Autoimmune and musculoskeletal: RA, SLE, vasculitis, myositis, scleroderma, spondyloarthropathy, gout, OA.

## Top Conditions
- Rheumatoid arthritis
- SLE (lupus)
- Vasculitis (ANCA-associated, large vessel)
- Psoriatic arthritis
- Ankylosing spondylitis
- Gout / CPPD
- Scleroderma (systemic sclerosis)
- Polymyalgia rheumatica
- Dermatomyositis / polymyositis
- Sjogren's syndrome

## Red Flags
- SLE with organ involvement (renal, CNS)
- Vasculitis with organ ischemia
- Macrophage activation syndrome (MAS)
- Severe infection on immunosuppression
- Tumor lysis from rituximab

## AI Decision Support (existing `ai_rheuma_orchestrator.js`)
- Autoimmune disease scoring (DAS28, SLEDAI)
- ANA pattern interpretation
- Vasculitis classification
- Treatment selection

## L4 Validation: 6/6 PASS
- Red flags: organ involvement, infection on immunosuppression
- Drug safety: biologics, immunosuppressants
- PHI: encrypted
- Auth: Rheumatologist
- Compliance: JCI, ACR, EULAR
- Tests: disease activity scores, ANA

---
*Tier-3. L4 validated.*
