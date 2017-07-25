#!/bin/sh
service=elasticsearch

if (( $(ps -ef | grep -v grep | grep $service | wc -l) == 0 ))
then
  echo "$(date) iniciando $service !"
  sudo service $service start
fi
