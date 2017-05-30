#!/bin/sh

FILE=credenciados_es_batch.json

if [ ! -v ES_HOST ]
then
	echo "variavel ES_HOST nao declarada!"
  echo "inclua em /etc/enviroment a linha com o IP do Elastic Search"
  echo "ES_HOST=xxx.xxx.xxx.xxx"
  exit 1
fi

cd /home/ec2-user/buscador-ams/ams-scrapper
/home/ec2-user/.nvm/versions/node/v6.10.2/bin/node src/scrapper.js
/home/ec2-user/.nvm/versions/node/v6.10.2/bin/node script/exportar-credenciados-elasticsearch.js

if [ -e "$FILE" ] && [ ! -z "$FILE" ]
then

  curl -XDELETE "$ES_HOST:9200/ams"
  curl -H "Content-Type: application/json" -XPOST "$ES_HOST:9200/ams/credenciado/_bulk?pretty&refresh" --data-binary "@$FILE"
  rm $FILE
fi
