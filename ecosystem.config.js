module.exports = {
  apps : [{
    name   : "Plants",
    script : "./app.js",
     env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}
