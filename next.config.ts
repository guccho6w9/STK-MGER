import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para solucionar el problema de Prisma con Vercel y Next.js
  // Esto asegura que Prisma sea tratado como una dependencia externa
  // durante el proceso de compilación, evitando errores de sintaxis de módulos.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = {
        ...config.externals,
        '@prisma/client': 'commonjs @prisma/client',
      };
    }
    return config;
  },
};

export default nextConfig;
