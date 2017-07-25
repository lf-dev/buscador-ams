#!/bin/sh

# ---------------
# INSTALACAO JAVA
# ---------------

wget -c --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u131-b11/d54c1d3a095b4ff2b6607d096fa80163/jdk-8u131-linux-x64.rpm

# -install
sudo rpm -i jdk-8u131-linux-x64.rpm

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

# -configura para aceitar conexoes de outros hosts
# -necessario para o scrapper salvar o conteudo. Limitar acesso via SecurityGroup
echo "network.host: 0.0.0.0" | sudo tee -a /etc/elasticsearch/elasticsearch.yml
# -a configuracao de network.host= 0.0.0.0 coloca o ES em modo de producao que
#exige um minimo de 2048 threads para o processo do ES
echo "elasticsearch - nproc 2048" | sudo tee -a /etc/security/limits.conf

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

sudo yum -y install git

# -clona o projeto
git clone https://github.com/lf-dev/buscador-ams.git

# -------------------
# INSTALACAO SERVIDOR
# -------------------

# redirecionando porta 80 para porta 3000
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000

npm install --prefix buscador-ams/server/
pm2 start ./buscador-ams/server/ecosystem.config.js

# -configura pm2 para iniciar servidor no boot
sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v6.10.2/bin /home/ec2-user/.nvm/versions/node/v6.10.2/lib/node_modules/pm2/bin/pm2 startup amazon -u ec2-user --hp /home/ec2-user
pm2 save

# -configura logrotate para pm2
sudo cp ./buscador-ams/server/enviroment/logrotate /etc/logrotate.d/pm2-ec2-user

# -configura crontab para monitorar Elastic Search a cada minuto
echo "* * * * * /home/ec2-user/buscador-ams/server/enviroment/keep_alive_es.sh" > es_cron
crontab es_cron
rm es_cron
