module.exports = ({ env }) => [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "https:"],
          "media-src": ["'self'", "data:", "blob:", "https:"],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: "strapi::cors",
    config: {
      origin: env
        .array("CORS_ORIGINS", ["http://localhost:3000", "http://127.0.0.1:3000"])
        .filter(Boolean),
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
      headers: ["Content-Type", "Authorization", "Origin", "Accept"],
      keepHeaderOnError: true,
    },
  },
  "strapi::query",
  {
    name: "strapi::body",
    config: {
      formLimit: env("STRAPI_FORM_LIMIT", "1mb"),
      jsonLimit: env("STRAPI_JSON_LIMIT", "1mb"),
      textLimit: env("STRAPI_TEXT_LIMIT", "1mb"),
      formidable: {
        maxFileSize: env.int("STRAPI_UPLOAD_MAX_FILE_SIZE", 10 * 1024 * 1024),
      },
    },
  },
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
