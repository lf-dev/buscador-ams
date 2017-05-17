#!/bin/bash

# ---------------
# INSTALACAO JAVA
# ---------------
# adaptado de: https://gist.github.com/rtfpessoa/17752cbf7156bdf32c59

java_base_version="8"
java_sub_version="73"
java_base_build="02"

java_version="${java_base_version}u${java_sub_version}"
java_build="b${java_base_build}"
java_version_with_build="${java_version}-${java_build}"

# -download
wget --no-cookies --header "Cookie: gpw_e24=xxx; oraclelicense=accept-securebackup-cookie;" "http://download.oracle.com/otn-pub/java/jdk/${java_version_with_build}/jdk-${java_version}-linux-x64.rpm"
# -install
sudo rpm -i jdk-${java_version}-linux-x64.rpm
# -instalacao alternativa
sudo /usr/sbin/alternatives --install /usr/bin/java java /usr/java/jdk1.${java_base_version}.0_${java_sub_version}/bin/java 20000
# -configura como padrao
sudo /usr/sbin/alternatives --config java
# -exporta java home
export JAVA_HOME=/usr/java/default

# -------------------------
# INSTALACAO ELASTIC SEARCH
# -------------------------

sudo rpm -i https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.4.0.rpm

# -configura ES como servico e configurar para iniciar automaticamente
sudo chkconfig --add elasticsearch
sudo chkconfig --levels 3 elasticsearch on

# -configura memoria maxima de 100Mb
sudo sed -i 's/Xmx2g/Xmx100m/g' /etc/elasticsearch/jvm.options
sudo sed -i 's/Xms2g/Xms100m/g' /etc/elasticsearch/jvm.options

# -inicia servico do ES
sudo service elasticsearch start

# -----------------
# INSTALACAO NODEJS
# -----------------

# -instala o nvm (node version manager)
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# -instala o node js
nvm install 6.10.2

# -pm2
npm -g install pm2

# --------------
# INSTALACAO GIT
# --------------

sudo -y yum install git

# -clona o projeto
git clone https://github.com/lf-dev/buscador-ams.git

# ------------------------------
# INSTALACAO SCRAPPER & SERVIDOR
# ------------------------------

pm2 start ./buscador-ams/ecosystem.config.js


# curl -H "Content-Type: application/json" -XPOST 'localhost:9200/ams/credenciado/_bulk?pretty&refresh' --data-binary "@credenciados.json"

# TODO: tratar falha no site da AMS
# TODO: agendar scrapper e carga em cron
