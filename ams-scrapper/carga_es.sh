#!/bin/sh
FILE=$1

if [ -e "$FILE" ] && [ ! -z "$FILE" ]
then

  curl -XDELETE 'localhost:9200/ams'
  curl -H "Content-Type: application/json" -XPOST 'localhost:9200/ams/credenciado/_bulk?pretty&refresh' --data-binary "@$1"
  rm $1
fi
