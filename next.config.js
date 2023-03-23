const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = {
  reactStrictMode: false,
  webpack(config) {
    config.plugins.push(
      require('unplugin-icons/webpack')({
        compiler: 'jsx',
        jsx: 'react',
      })
    );

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
