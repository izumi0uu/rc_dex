module.exports = {
  apps: [
    {
      name: 'dexs-ui',
      cwd: './',
      script: './start-pump-ui.sh',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      log_file: './logs/dexs-ui.log',
      out_file: './logs/dexs-ui-out.log',
      error_file: './logs/dexs-ui-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
}; 