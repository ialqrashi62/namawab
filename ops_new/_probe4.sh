#!/usr/bin/env bash
echo P4_START
echo P4_PUBLIC_PLANS:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/api/public/plans)
echo P4_SUPER_ADMIN_NO_AUTH:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/api/super-admin/plans)
echo P4_PCC_CATALOG:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/api/v1/pcc-catalog/modules)
echo P4_CARD_LIST:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/api/v1/pcc-cardiology-ext102/list)
echo P4_CARD_CALL:$(curl -sk -o /dev/null -w '%{http_code}' -X POST https://jumanasoft.com/api/v1/pcc-cardiology-ext102/call/CardGenExt -H 'Content-Type: application/json' -d '{}')
echo P4_OPENAPI_YAML:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/openapi-pcc.yaml)
echo P4_SITEMAP:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/sitemap.xml)
echo P4_SW:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/sw.js)
echo P4_OFFLINE:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/offline.html)
echo P4_MANIFEST:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/manifest.json)
echo P4_HOME:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/)
echo P4_PCC_CATALOG_HTML:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/pcc-catalog/)
echo P4_END