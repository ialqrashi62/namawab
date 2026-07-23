# GI-001 — OpenAPI + Routes + Middleware (combined)

```yaml
openapi: 3.1.0
info:
  title: NamaMedical GI API
  version: 1.0.0
security:
  - bearerAuth: []
paths:
  /gi/encounters:
    get:
      summary: List GI encounters
    post:
      summary: Create encounter
  /gi/encounters/{id}/endoscopies:
    get:
      summary: List endoscopies
    post:
      summary: Add endoscopy
  /gi/encounters/{id}/medications:
    post:
      summary: Order medication
  /gi/encounters/{id}/liver:
    get:
      summary: Get liver scores
    post:
      summary: Calculate liver scores
  /gi/encounters/{id}/bleed:
    get:
      summary: Get bleed assessment
    post:
      summary: Add bleed assessment
  /gi/risk/childpugh:
    post:
      summary: Child-Pugh
  /gi/risk/meld:
    post:
      summary: MELD
  /gi/risk/meldna:
    post:
      summary: MELD-Na
  /gi/risk/gbs:
    post:
      summary: Glasgow-Blatchford
  /gi/risk/aims65:
    post:
      summary: AIMS65
  /gi/risk/bisap:
    post:
      summary: BISAP
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
```

## Middleware
- requireAuth, requireTenantScope, requireRole (gastroenterologist, hepatologist, GI nurse)
- validateBody
- auditMiddleware

## Red Flags
- Massive GI bleed (GBS ≥12)
- Hepatic encephalopathy
- Acute liver failure (INR >1.5 + encephalopathy)
- Acute cholangitis (Charcot triad)
- Perforation
- Acute pancreatitis (severe)
