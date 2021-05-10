const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@font-family': ["'Open Sans'", 'san-serif'].join(', '),
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
