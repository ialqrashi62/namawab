POST /emergency_department/:fn → auth middlewares → zod → engine fn (pure) → persist jsonb to er_encounters → audit insert → 200 envelope
