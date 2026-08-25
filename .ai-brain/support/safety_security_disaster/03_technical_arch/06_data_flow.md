POST /safety_security_disaster/:fn → auth middlewares → zod → engine fn (pure) → persist jsonb to incident_records → audit insert → 200 envelope
