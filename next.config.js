/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/PressOS-',
  assetPrefix: '/PressOS-',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
