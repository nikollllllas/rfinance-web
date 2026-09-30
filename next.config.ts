import type { NextConfig } from 'next';

// Proxy same-origin: o cookie httpOnly da API vira first-party no domínio do front.
const apiTarget = (process.env.API_PROXY_TARGET ?? 'https://rfinance-api.onrender.com').replace(/\/+$/, '');

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiTarget}/:path*` }];
  },
};

export default nextConfig;
