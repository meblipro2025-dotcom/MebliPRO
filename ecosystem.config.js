module.exports = {
  apps: [
    {
      name: "mebli-pro-web",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "./",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
    },
    {
      name: "mebli-pro-bot",
      script: "node_modules/.bin/tsx",
      args: "scripts/bot.ts",
      cwd: "./",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "256M",
      watch: false,
    },
  ],
};
