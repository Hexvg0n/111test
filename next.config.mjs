/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
          {
            source: '/api/:path*',
            headers: [
              { key: 'Access-Control-Allow-Credentials', value: 'true' },
              { key: 'Access-Control-Allow-Origin', value: process.env.NEXTAUTH_URL },
              { key: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' }
            ]
          }
        ];
      }
};

export default nextConfig;
