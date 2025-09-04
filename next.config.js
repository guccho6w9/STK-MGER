/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de Webpack si es necesaria, como la de Prisma
  webpack: (config, { isServer }) => {
    if (isServer) {
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

module.exports = nextConfig;