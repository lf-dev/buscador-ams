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
    }
  ]
}
