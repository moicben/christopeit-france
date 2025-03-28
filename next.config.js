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
      }
    ];
  },
};

module.exports = nextConfig;