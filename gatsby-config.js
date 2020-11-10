const path = require('path')

const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development";
console.log(`Using environment config: '${activeEnv}'`);
require("dotenv").config({
  path: `.env.${activeEnv}`,
})

module.exports = {
  plugins: [`gatsby-plugin-sass`,
  {
    resolve: `gatsby-plugin-create-client-paths`,
    options: { prefixes: [`/*`] },
  },
  {
    resolve: `gatsby-plugin-alias-imports`,
    options: {
      alias: {
        "@components": 'src/components',
        "@actions": 'src/actions',
        "@configs": 'src/configs',
        "@data": 'src/data',
        "@helpers": 'src/helpers',
        "@hooks": 'src/hooks',
        "@i18n": 'src/i18n',
        "@images": 'src/images',
        "@pages": 'src/pages',
        "@providers": 'src/providers',
        "@reducers": 'src/reducers',
        "@store": 'src/store',
        "@styles": 'src/styles',
      },
      extensions: []
    }
  },
  `gatsby-plugin-react-helmet`,
  {
    resolve: "gatsby-plugin-google-tagmanager",
    options: {
      id: process.env.GTM_ID,
      includeInDevelopment: true,
    },
  },
  ],
}
