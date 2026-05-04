const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::grid.grid", {
  config: {
    find: {
      auth: false,
    },
    findOne: {
      auth: false,
    },
  },
});
