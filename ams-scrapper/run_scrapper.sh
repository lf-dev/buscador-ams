#!/bin/sh

CREDENCIADOS=credenciados_es_batch.json
ESTADOS=estados_es_batch.json
CIDADES=cidades_es_batch.json
BAIRROS=bairros_es_batch.json
ESPECIALIDADES=especialidades_es_batch.json

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
/home/ec2-user/.nvm/versions/node/v6.10.2/bin/node script/exportar-propriedades-elasticsearch.js

if [ -e "$CREDENCIADOS" ] && [ ! -z "$CREDENCIADOS" ]
then

  curl -XDELETE "$ES_HOST:9200/ams"
  curl -H "Content-Type: application/json" -XPOST "$ES_HOST:9200/ams/credenciado/_bulk?pretty&refresh" --data-binary "@$CREDENCIADOS"

  curl -H "Content-Type: application/json" -XPOST "$ES_HOST:9200/ams/estado/_bulk?pretty&refresh" --data-binary "@$ESTADOS"
  curl -H "Content-Type: application/json" -XPOST "$ES_HOST:9200/ams/cidade/_bulk?pretty&refresh" --data-binary "@$CIDADES"
  curl -H "Content-Type: application/json" -XPOST "$ES_HOST:9200/ams/bairro/_bulk?pretty&refresh" --data-binary "@$BAIRROS"
  curl -H "Content-Type: application/json" -XPOST "$ES_HOST:9200/ams/especialidade/_bulk?pretty&refresh" --data-binary "@$ESPECIALIDADES"

  rm $CREDENCIADOS
  rm $ESTADOS
  rm $CIDADES
  rm $BAIRROS
  rm $ESPECIALIDADES
fi
