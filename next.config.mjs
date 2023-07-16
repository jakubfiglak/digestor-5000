import './env.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
};

export default nextConfig;
