FILE=credenciados.json
ES_HOST=0.0.0.0

cd /home/ec2-user/buscador-ams/ams-scrapper
/home/ec2-user/.nvm/versions/node/v6.10.2/bin/node src/scrapper.js

if [ -e "$FILE" ] && [ ! -z "$FILE" ]
then

  curl -XDELETE "$ES_HOST:9200/ams"
  curl -H "Content-Type: application/json" -XPOST "$ES_HOST:9200/ams/credenciado/_bulk?pretty&refresh" --data-binary "@$FILE"
  rm $FILE
fi
