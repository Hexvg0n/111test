/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Akceptuje wszystkie hostname
        port: "",
        pathname: "**", // Akceptuje wszystkie ścieżki
      },
      {
        protocol: "http",
        hostname: "**",
        port: "",
        pathname: "**",
      }
    ]
  }
};

export default nextConfig;
