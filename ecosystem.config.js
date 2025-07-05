module.exports = {
  apps: [
    {
      name: "my-backend-app",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}

