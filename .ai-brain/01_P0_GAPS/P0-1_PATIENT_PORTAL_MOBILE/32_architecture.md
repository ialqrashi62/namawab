# P0-1 Patient Portal — Architecture

## Component Diagram

```
Mobile App (iOS/Android/PWA):
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│Dashboard │ │ Booking  │ │ Lab View │ │ Caregiver│
└─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
Express Router (09_router.js):
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ /appoint.│ │/teleheal.│ │ /lab     │ │/caregiver│
└─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘
      │             │             │             │
      ▼             ▼             ▼             ▼
Pure Engine (08_engine.js):
┌──────────────────────────────────────────────────────┐
│ identityVerification | appointmentBooking              │
│ telehealthEligibility | labResultsDisclosure          │
│ refillRequestValidation | caregiverProxyAccess         │
│ selfReportedVitals | fhirExport | insuranceVerification│
│ pushNotificationPriority | consentWithdrawal            │
│ healthRiskScore                                        │
└────────────────────────┬────────────────────────────�
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │  Vector DB   │  │  External    │
│  (5 tables)  │  │  (pgvector)  │  │  APIs:       │
│  FORCE RLS   │  │  HNSW index  │  │  - Nafath    │
└──────────────┘  └──────────────┘  │  - Mawid     │
                                    │  - Wateen    │
                                    │  - Sehhaty   │
                                    │  - SFDA      │
                                    └──────────────┘
```

## Security Layers
- TLS 1.3, CSP, HSTS
- Nafath SSO + biometric
- 2FA for sensitive operations (bill pay >500 SAR, consent changes)
- Force RLS + tenant isolation
- Hash-chained audit 7+ yr (PDPL requirement)
- PHI encrypted at rest (rails #7)
- No PHI in logs (rails #12)
- Critical lab requires clinician verification

## Scalability
- Mobile app cache (offline support)
- CDN for static assets
- Redis cache (TTL 5 min for FHIR)
- PM2 cluster (2 instances)
- HNSW vector index

## Monitoring
- Prometheus: RPS, latency, error
- Custom: Appointment booking rate, telehealth adoption, refill success rate
- PagerDuty: Critical lab alert SLA breach
- PostHog: Patient behavior analytics

## Mobile-Specific
- Push notifications (APNS/FCM)
- Offline mode (cached data)
- Biometric login
- Dark mode
- RTL support (Arabic primary)
