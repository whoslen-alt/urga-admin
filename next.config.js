const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '3.0.91.173',
      },
      {
        protocol: 'http',
        hostname: '103.168.56.230',
      },
      {
        protocol: 'https',
        hostname: 'api.urga.mn',
      },
      {
        protocol: 'https',
        hostname: 'test.urga.mn',
      },
      {
        protocol: 'http',
        hostname: 'api.urga.mn',
      },
    ],
  },
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
