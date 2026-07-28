<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# NEPH-002 — Helpdesk

## L1
- Cannot find patient → check MPI by national ID
- Trough lab not showing → check lab import
- Crossmatch result delayed → contact HLA lab

## L2
- SCOT report failed → check API key, retry
- Pair exchange match run failed → check pool integrity
- Trough >20 = auto-block, contact MD immediately

## L3
- Migration failed → DBA rollback
- Security incident → InfoSec

## FAQs
**Q: How to add patient to waitlist?**
A: Workup complete → MDT approval → POST /waitlist.

**Q: Donor for specific recipient?**
A: Search donor registry, run match via GET /matching.

**Q: Trough >20 = ?**
A: HARD BLOCK. Hold dose + escalate immediately.

**Q: SCOT report?**
A: Auto-filed 7 days post-transplant. Check status in procedure detail.

---
*Section 29 of NEPH-002. L1 DRAFT.*