/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://project-8w7l.onrender.com/:path*',
          },
        ]
      },
};

export default nextConfig;
