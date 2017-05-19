#!/bin/sh

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
# npm -g install pm2

# --------------
# INSTALACAO GIT
# --------------

sudo yum -y install git

# -clona o projeto
git clone https://github.com/lf-dev/buscador-ams.git

# -------------------
# INSTALACAO SCRAPPER
# -------------------

npm install --prefix buscador-ams/ams-scrapper/
# pm2 start ./buscador-ams/ams-scrapper/ecosystem.config.js

# -configura pm2 para iniciar servidor no boot
# sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v6.10.2/bin /home/ec2-user/.nvm/versions/node/v6.10.2/lib/node_modules/pm2/bin/pm2 startup amazon -u ec2-user --hp /home/ec2-user
# pm2 save

# -configura crontab para atualizar Elastic Search quando existir arquivo de credenciados
# echo "* * * * * /home/ec2-user/buscador-ams/ams-scrapper/carga_es.sh /home/ec2-user/buscador-ams/ams-scrapper/credenciados.json" > es_cron
# crontab es_cron
# rm es_cron
