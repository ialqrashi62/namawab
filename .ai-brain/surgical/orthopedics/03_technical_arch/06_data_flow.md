POST /orthopedics/:fn → auth middlewares → zod → engine fn (pure) → persist jsonb to ortho_cases → audit insert → 200 envelope
