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

# -configura crontab para atualizar Elastic Search quando existir arquivo de credenciados
echo "@reboot /home/ec2-user/buscador-ams/ams-scrapper/run_scrapper.sh" > es_cron
crontab es_cron
rm es_cron
