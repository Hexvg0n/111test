/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "**",
      }
    ]
  },
  // Dodaj te sekcje
  trailingSlash: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Forwarded-Proto",
            value: "https"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          }
        ]
      }
    ]
  },
  // Jeśli używasz statycznych assetów przez CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://dripez.pl' : '',
};

export default nextConfig;