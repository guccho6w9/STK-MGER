const nextConfig = {
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
  // Esta configuración le dice a Next.js que ignore los errores de ESLint
  // durante el proceso de compilación, permitiendo que el despliegue continúe.
  // Es una solución temporal para los errores en archivos autogenerados.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;