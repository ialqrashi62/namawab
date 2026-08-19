# P0-3 BCMA Workflow Orchestration

## BPMN-Lite Flow

```
[Start] → [Nurse Scans Patient Wristband] → [Lookup Active Orders] → [Nurse Scans Drug] → [5 Rights Check]
                                                                                                    ↓
                                                                                          [Pass?] --NO--> [Block + Alert]
                                                                                                    ↓ YES
                                                                                          [Allergy Check]
                                                                                                    ↓
                                                                                          [Interaction Check]
                                                                                                    ↓
                                                                                          [High-Alert?] --YES--> [2-Nurse Verify]
                                                                                                    ↓ NO
                                                                                          [Administer + Log] → [End]
```

## SLA Timers
- 5 Rights check: < 200ms
- Allergy check: < 500ms
- Drug interaction: < 1s
- High-alert 2-nurse: < 5min (witness must respond)

## Error Paths
- Block: requires prescriber override with reason code
- Refusal: nurse records reason, pharmacy notified
- Omitted: documented, charge not generated
- Missed (>30min late): flagged for late-dose protocol