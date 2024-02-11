import './env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [{ hostname: 'cdn.sanity.io' }],
  },
};

export default nextConfig;
