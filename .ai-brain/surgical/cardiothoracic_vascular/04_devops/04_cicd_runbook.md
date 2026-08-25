CI: lint→test→node --check→migration dry-run. CD: scp additive → node --check remote → pm2 reload --wait-ready → health 200 → smoke endpoint.
