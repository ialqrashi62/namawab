# P0-3 BCMA Business Flow

## 1. Order Entry
Provider writes medication order in CPOE → pharmacy verifies → order released to MAR.

## 2. BCMA Verification (at bedside)
Nurse opens BCMA app → scans patient → scans drug → system checks 5 Rights + allergy + interactions.

## 3. Administration
After all checks pass → nurse administers → app logs timestamp + nurse ID + dose.

## 4. Post-Administration
MAR updated → pharmacy charge triggered → eMAR displayed in patient chart.

## 5. Late-Dose Detection
If scheduled_time + 30min passes without administration, system flags for late-dose review.

## 6. Override Workflow
When blocked, nurse can override with reason. High-alert overrides require 2 signatures (nurse + charge).