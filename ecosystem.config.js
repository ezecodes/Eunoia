module.exports = {
  apps: [
    {
      name: 'eunoia_cluster',
      script: 'server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        NODE_ENV: 'production',
      },
     
      error_file: '/tmp/eunoia_cluster_logs/error.log',
      out_file: '/tmp/eunoia_cluster_logs/out.log',
     
      log_rotate_date: true,
      log_max_size: '100M',
      log_max_files: 10,
    },
  ],
};
