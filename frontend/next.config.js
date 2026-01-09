/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  },
  webpack: (config) => {
    // Add alias for '@' to resolve to 'src' folder
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    return config;
  },
};

module.exports = nextConfig;


module.exports = nextConfig