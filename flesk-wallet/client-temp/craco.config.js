const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {
      // Désactiver le traitement CSS pour Leaflet
      webpackConfig.module.rules.forEach(rule => {
        if (rule.oneOf) {
          rule.oneOf.forEach(oneOfRule => {
            if (oneOfRule.test && oneOfRule.test.toString().includes('css')) {
              oneOfRule.exclude = /leaflet\.css$/;
            }
          });
        }
      });

      // Ajouter une règle simple pour Leaflet CSS
      webpackConfig.module.rules.push({
        test: /leaflet\.css$/,
        use: ['style-loader', 'css-loader'],
        include: path.resolve(__dirname, 'node_modules/leaflet'),
      });

      // Ajouter une règle pour les images
      webpackConfig.module.rules.push({
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      });

      return webpackConfig;
    },
  },
}; 