curl -s -o /dev/null -w "openapi.json=%{http_code}\n" http://localhost:3000/openapi.json ; \
curl -s -o /dev/null -w "api/docs=%{http_code}\n" http://localhost:3000/api/docs ; \
curl -s -o /dev/null -w "api/metrics=%{http_code}\n" http://localhost:3000/api/metrics ; \
curl -s -o /dev/null -w "api/security/rls-audit=%{http_code}\n" http://localhost:3000/api/security/rls-audit ; \
curl -s -o /dev/null -w "api/metrics/alerts=%{http_code}\n" http://localhost:3000/api/metrics/alerts ; \
curl -s -o /dev/null -w "api/health/redis=%{http_code}\n" http://localhost:3000/api/health/redis ; \
curl -s -o /dev/null -w "api/metrics/sessions=%{http_code}\n" http://localhost:3000/api/metrics/sessions ; \
curl -s -o /dev/null -w "api/health=%{http_code}\n" http://localhost:3000/api/health
