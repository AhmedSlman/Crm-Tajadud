module.exports = {
  apps: [{
    name: 'crm-agency',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    cwd: '/var/www/crm-app',  // Update this path on your server
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    // Restart on crash
    min_uptime: '10s',
    max_restarts: 10,
  }]
};

