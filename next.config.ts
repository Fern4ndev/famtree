import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // La foto viaja en el FormData de la Server Action (máx 2 MB + overhead).
    // El límite por defecto (1 MB) la rechaza con "Failed to fetch".
    serverActions: { bodySizeLimit: "3mb" },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'media.daily.dev',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
};

export default nextConfig;
