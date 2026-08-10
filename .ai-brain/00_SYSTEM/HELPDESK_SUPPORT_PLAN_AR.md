# HELPDESK & SUPPORT PLAN
**Last updated:** 2026-08-10

---

## 1. Helpdesk channels

### Customer-facing

| Channel | Hours | SLA |
|---|---|---|
| In-app help (top-right) | 24/7 | Acknowledge < 1h |
| Email (support@jumanasoft.com) | 24/7 | Acknowledge < 4h |
| Phone (+966 11 XXX XXXX) | 24/7 for Tier 2/3 · business hours for Tier 1 | Acknowledge < 30min |
| Live chat (in-app) | 24/7 | First response < 5min |
| WhatsApp Business | 24/7 for Tier 2/3 | First response < 30min |
| Slack Connect (enterprise) | 24/7 for Tier 3 | First response < 15min |

### Internal-facing

- PagerDuty (24/7 on-call)
- Slack (engineering, ops)
- GitHub Issues (engineering)

---

## 2. Ticket system

### Tools

- **Zendesk** (or open-source: osTicket, Zammad)
- Categories: bug · feature-request · question · incident · security
- Priority: P1 (critical) · P2 (high) · P3 (medium) · P4 (low)

### SLAs

| Priority | Definition | First Response | Resolution |
|---|---|---|---|
| P1 (Critical) | Production down · security breach · data loss | < 15 min | < 4 h |
| P2 (High) | Major feature broken · workaround exists | < 1 h | < 24 h |
| P3 (Medium) | Minor feature broken · workaround available | < 4 h | < 7 d |
| P4 (Low) | Cosmetic · enhancement | < 24 h | < 30 d |

### Ticket lifecycle

```
New → Assigned → In Progress → Resolved → Verified → Closed
                                              ↓
                                          Reopened (if not satisfied)
```

---

## 3. Knowledge base (KB)

### Structure

- **Getting started**
  - First login
  - Set up MFA
  - Navigate the UI

- **Common workflows**
  - Patient registration
  - OPD visit
  - IPD admission
  - Surgery scheduling
  - Lab order + result
  - Pharmacy dispense
  - Billing + insurance claim

- **Admin guides**
  - Add user
  - Set up department
  - Configure facility
  - Set up integration
  - Backup + restore

- **Troubleshooting**
  - Login failed
  - Patient not found
  - NPHIES rejection
  - ZATCA endpoint error
  - Performance slow

- **FAQ**
  - 50 most common questions

- **Glossary**
  - Medical terms
  - Technical terms
  - Saudi-specific terms (Wasfaty, NPHIES, ZATCA)

### Per role

- Doctor KB
- Nurse KB
- Receptionist KB
- Pharmacist KB
- Lab Tech KB
- Radiologist KB
- Cashier KB
- Admin KB

---

## 4. SLA monitoring

### Metrics

| Metric | Target |
|---|---|
| First response time (P1) | < 15 min |
| First response time (P2) | < 1 h |
| First response time (P3) | < 4 h |
| Resolution time (P1) | < 4 h |
| Resolution time (P2) | < 24 h |
| Resolution time (P3) | < 7 d |
| Customer satisfaction | > 4.5/5 |
| First-call resolution | > 70% |
| Ticket reopen rate | < 10% |

### Dashboard

- Grafana + Zendesk API
- Real-time SLA breaches
- Weekly summary report

---

## 5. On-call rotation

### Engineering on-call

- 1 week rotation
- Primary + Secondary
- PagerDuty alert
- Comp time off after rotation

### Customer support on-call

- 1 week rotation
- For P1 / P2 incidents
- Page out to engineering if needed

---

## 6. Customer success

### Roles

- **Customer Success Manager (CSM)** — owns relationship, runs QBR
- **Implementation Specialist** — onboarding + training
- **Technical Account Manager (TAM)** — for Tier 3 enterprise

### QBR (Quarterly Business Review)

- Per Tier 2/3 customer
- Topics: usage, adoption, ROI, roadmap, support tickets, satisfaction
- Deliverable: action items + next quarter goals

### NPS

- Quarterly survey
- Target: > 60
- Detractor follow-up within 48h

---

## 7. Customer feedback loop

### Sources

- In-app feedback (thumbs up/down on every feature)
- Quarterly NPS survey
- Monthly CSM check-in
- QBR
- Support tickets

### Loop

1. **Collect** (in-app + survey + CSM)
2. **Triage** (CSM + Product)
3. **Prioritize** (backlog)
4. **Build** (engineering)
5. **Release** (deploy + announce)
6. **Verify** (back to customer)

---

## 8. Escalation matrix

| Level | When | Who | Response |
|---|---|---|---|
| L1 | Tier 1 customer question | Support agent | < 4h |
| L2 | Technical question | Support engineer | < 24h |
| L3 | Bug / deep technical | Engineering team | < 7d |
| L4 | Production outage | On-call engineer | < 15min |
| L5 | Security breach | Security team + CISO | < 1h |

---

## 9. Self-service tools

- In-app help (top-right icon)
- AI chatbot (RAG over KB)
- Video tutorials (YouTube)
- Documentation portal (Notion or custom)
- Community forum (Discourse or Slack)
- Status page (status.jumanasoft.com)

---

## 10. Vendor management

### Critical vendors

| Vendor | Service | SLA | Backup plan |
|---|---|---|---|
| OpenAI | LLM | 99.9% | Fallback to local Llama |
| Cohere | Reranking | 99.9% | Fallback to local bge |
| Cloudflare | CDN + DDoS | 100% | Multi-CDN |
| Hetzner | Hosting | 99.9% | DR site |
| PostgreSQL | DB | n/a | Backup + restore |
| Redis | Cache + sessions | 99.9% | In-memory fallback |
| Twilio | SMS | 99.95% | Local SMSC |

### Vendor risk review

- Annual review of all critical vendors
- SLA compliance tracking
- Backup plan verification

---

End of helpdesk & support plan.
