# Helpdesk Plan — Surg-010 (SURG-010)
**Last updated:** 2026-08-10

## Support channels for Surg-010

### Tier 1 (Polyclinic SaaS)
- In-app help (top-right)
- Email: support@jumanasoft.com (4h response)
- Phone: business hours only

### Tier 2 (Hospital SaaS)
- All Tier 1 channels +
- Live chat (in-app, 5min response)
- WhatsApp Business (24/7)

### Tier 3 (Enterprise)
- All Tier 2 channels +
- Slack Connect (24/7, 15min response)
- Dedicated CSM

## Common Surg-010 questions

### How do I perform a Surg-010 workflow?
See user manual §29_user_manual.md (AR + EN).

### Surg-010 compliance
- ZATCA Phase 2: see 31_COMPLIANCE.md
- NPHIES: see insurance module
- CBAHI: see 31_COMPLIANCE.md
- PDPL: see 31_COMPLIANCE.md

### Surg-010 AI orchestrators
See 08_prompt_engineering.md + 10_langchain_chains.md

## SLA matrix

| Priority | Response | Resolution |
|---|---|---|
| P1 (production down) | < 15min | < 4h |
| P2 (major bug) | < 1h | < 24h |
| P3 (minor bug) | < 4h | < 7d |
| P4 (cosmetic) | < 24h | < 30d |

## Escalation path

L1: support agent → L2: support engineer → L3: dev team → L4: on-call engineer

## Self-service

- AI chatbot (RAG over KB)
- Video tutorials (YouTube)
- Documentation portal
- Status page: status.jumanasoft.com
