/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/boutique', 
        destination: '/tous-les-equipements', 
        permanent: true, 
      },
      {
        source: '/tapis-de-course',
        destination: '/tapis-roulants',
        permanent: true,
      },
      {
        source: '/produits/tapis-(.*)',
        destination: '/tapis-de-course/tapis-$1',
        permanent: true,
      },
      {
        source: '/produits/velo-(.*)',
        destination: '/velos/velo-$1',
        permanent: true,
      },
      {
        source: '/produits/rameur-(.*)', // Utilisation d'une regex pour capturer la partie dynamique
        destination: '/rameurs/rameur-$1', // Réutilisation de la partie capturée avec $1
        permanent: true,
      },
      
    ];
  },
};

module.exports = nextConfig;