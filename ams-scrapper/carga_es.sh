#!/bin/sh

if test -e credenciados.json
then
  curl -XDELETE 'localhost:9200/ams'
  curl -H "Content-Type: application/json" -XPOST 'localhost:9200/ams/credenciado/_bulk?pretty&refresh' --data-binary "@credenciados.json"
  rm credenciados.json
fi
