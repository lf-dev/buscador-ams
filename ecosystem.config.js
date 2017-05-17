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
      cwd       : './buscador-ams/server',
      env_production : {
        NODE_ENV: 'production'
      }
    },

    // Scrapper
    {
      name      : 'scrapper',
      script    : 'src/scrapper.js',
      cwd       : './buscador-ams/ams-scrapper',
      cron_restart      : '0 3 * * *'
    }
  ]
}
