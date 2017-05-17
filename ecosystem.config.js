module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // Server
    {
      name      : 'server',
      script    : 'src/server.js',
      cwd       : './server',
      env_production : {
        NODE_ENV: 'production'
      }
    },

    // Scrapper
    {
      name      : 'scrapper',
      script    : 'scr/scrapper',
      cwd       : './ams-scrapper',
      cron_restart      : '0 3 * * *'
    }
  ]
}
