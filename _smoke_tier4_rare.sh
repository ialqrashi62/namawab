#!/bin/bash
for p in rareblys raremito rareport raremast rareamyl raresarc rarewn raremarfan rareeds rareppgl rarecn rarenf; do
  echo "--- $p health ---"
  curl -s -m 5 http://127.0.0.1:3000/api/${p}/health
  echo
done
