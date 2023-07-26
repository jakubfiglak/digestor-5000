import './env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
};

export default nextConfig;
