# CARD-301_STROKE — Chaining Patterns

## Pattern 1: Sequential Decision Chain (Code Stroke)
```
[TLKW Input] → [NIHSS Calc] → [Contraindication Check] → [Thrombolysis Decision]
                                                              ↓
                                                      [BP Target Decision]
                                                              ↓
                                                      [Thrombectomy Routing]
                                                              ↓
                                                      [Disposition Order]
```

## Pattern 2: Parallel Scoring Fan-Out
```
[Patient Data] → [NIHSS Calc] (parallel)
              → [ASPECTS] (parallel)
              → [ICH Score] (parallel)
              → [ABCD2] (parallel, if TIA)
              → [CHA2DS2-VASc] (parallel, if AF)
              → [HAS-BLED] (parallel, if anticoag)
              → [Aggregate Report]
```

## Pattern 3: Retrieval-Augmented Generation (RAG)
```
[Query] → [Embed Query] → [pgvector similarity search] 
       → [Top-10 chunks from clinical_knowledge_vectors]
       → [Rerank by AHA/ASA recency]
       → [Compress to top-5]
       → [LLM with citations]
       → [Safety Check]
       → [Log ai_cds_log]
       → [Return to clinician]
```

## Pattern 4: Workflow Orchestrator (Code Stroke SLA Tracker)
```
[Code Stroke Activation] → [Start Timer]
       ↓
[Patient Arrival] → [Reset Timer]
       ↓
[CT Complete] → [Compute door_to_ct] → [If >25 min: alert]
       ↓
[Treatment Decision] → [If eligible: order_set]
       ↓
[Drug Administered] → [Compute door_to_needle] → [If >60 min: alert + log]
       ↓
[Stroke Unit Admission] → [If >3h: alert]
       ↓
[Discharge Bundle] → [Verify 5 elements]
       ↓
[30-day Follow-up] → [Schedule + reminder]
```

## Pattern 5: Multi-Agent Consultation
```
[Stroke Case] → [Triage Agent] (severity)
            → [Imaging Agent] (CT/CTA/MRI interpretation)
            → [Decision Agent] (thrombolysis/thrombectomy)
            → [Pharmacy Agent] (dosing + interactions)
            → [Consent Agent] (Arabic consent forms)
            → [Coordinator Agent] (consensus + escalation)
```

## Pattern 6: Closed-Loop Outcome Tracking
```
[Treatment] → [24h CT] → [Hemorrhagic transformation detection]
         → [Day 7 mRS] → [Functional outcome]
         → [Day 30 mRS] → [Final outcome]
         → [GWTG-S database upload] → [Quality dashboard]
```

## Pattern 7: Patient Engagement
```
[Discharge] → [Send Arabic education material]
           → [Schedule 30-day appointment]
           → [Medication reminders via SMS/WhatsApp]
           → [Risk factor checklist]
           → [Follow-up outcomes → EMR update]
```

## Pattern 8: Telestroke Network
```
[Spoke Hospital] → [Drip-and-Ship Protocol]
                → [Video consultation with hub neurologist]
                → [Real-time image sharing]
                → [Joint treatment decision]
                → [Transfer if thrombectomy needed]
                → [Hub follows up within 24h]
```
