<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Helpdesk Runbook (L1/L2/L3)

## L1 (Front-line, 0-15 min)
- User cannot log in → check session, clear cookies, retry
- Slow cath lab page → check Network tab, force refresh
- DICOM not loading → check PACS status, retry
- Voice call escalation: 0-5 min response

## L2 (Technical, 15-60 min)
- RLS error → verify tenant context, contact DBA
- 500 error → check logs (/var/log/nama-medical-erp/cath-lab.log)
- API timeout → check rate limit headers
- D2B timer stuck → check NTP sync, restart service

## L3 (Engineering, 1-4h)
- DB deadlock → kill session, analyze query
- Migration failure → rollback, contact DBA
- LLM hallucination reported → log to LangSmith, escalate to AIE
- Security incident → isolate, contact InfoSec

## Common FAQs
**Q: How do I register a new patient for cath?**
A: Search MPI by national ID. If not found, register new patient. Then create encounter.

**Q: Where do I find prior cath images?**
A: Patient header → "View Old" → DICOM viewer.

**Q: How do I activate STEMI?**
A: Top-right "Code STEMI" button. Confirms within 5 sec.

**Q: D2B timer says >90 min — what do I do?**
A: Document exception reason (patient delay, transfer, capacity, etc.). QA reviews monthly.

**Q: How do I cosign a stent implant?**
A: Open the procedure → Stent tab → "Cosign" button. Both operator+assistant must sign.

**Q: I cannot find a Heart Team MDT decision — what now?**
A: You cannot schedule TAVR/MitraClip/Watchman without MDT. Contact Structural Heart Coordinator.

**Q: Patient refuses blood products — what about cath?**
A: Document refusal in consent. For emergency STEMI, do not delay life-saving procedure.

**Q: SFDA UDI scanner not working — what to do?**
A: Manual entry + photo evidence + supervisor approval. Replace scanner ASAP.

**Q: DAPT 2-MD cosign — both MDs in same room?**
A: No, can be sequential with timestamps. Both signatures within 30 min.

---
*Section 29 of CARD-002. DSL voice. L1 DRAFT.*