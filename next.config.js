/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb', // Allow larger uploads
    },
  },
};

module.exports = nextConfig;
