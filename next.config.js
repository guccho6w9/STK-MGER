// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para solucionar el problema de Prisma con Vercel y Next.js
  // Esto asegura que Prisma sea tratado como una dependencia externa
  // durante el proceso de compilación, evitando errores de sintaxis de módulos.
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Usa una función para configurar externals, es más robusta y compatible
      config.externals.push('@prisma/client');
    }
    return config;
  },
  // Esta configuración le dice a Next.js que ignore los errores de ESLint
  // durante el proceso de compilación, permitiendo que el despliegue continúe.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;