module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("PUBLIC_URL", ""),
  proxy: env.bool("STRAPI_PROXY", false),
  app: {
    keys: env.array("APP_KEYS"),
  },
});
