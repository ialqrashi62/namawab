# GI-001 — Data Flow + Red Flags + Design Tokens

## GI Bleed
```
1. Resuscitation
2. GBS / AIMS65
3. PPI
4. Type & cross
5. EGD within 12-24h
6. Hemostasis
7. Variceal band ligation (if variceal)
8. TIPS (refractory)
```

## IBD Flare
```
1. Severity (Mayo, CDAI)
2. Trigger check
3. Steroid
4. Biologic escalation
5. Surgery consult
```

## Cirrhosis Decompensation
```
1. Find trigger (infection, GI bleed, electrolyte, sedatives)
2. Antibiotics (SBP prophylaxis)
3. Lactulose
4. Albumin
5. Paracentesis (large)
6. TIPS (refractory ascites)
```

## Red Flags
- Massive GI bleed (GBS ≥12)
- Hepatic encephalopathy
- Acute liver failure
- Acute cholangitis
- Perforation
- Acute pancreatitis (severe)
- Bowel ischemia
- Toxic megacolon

## Design Tokens — Severity
| Token | Hex | Use |
|---|---|---|
| `--gi-low` | #10B981 | Stable |
| `--gi-mod` | #F59E0B | Moderate |
| `--gi-high` | #DC2626 | Critical bleed |
| `--gi-liver-fail` | #7C3AED | Liver failure |
