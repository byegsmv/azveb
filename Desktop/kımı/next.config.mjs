import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // Fix Turbopack workspace root detection
  turbopack: {
    root: ".",
  },
  // Allow cross-origin dev access from local network devices
  allowedDevOrigins: ["192.168.1.101"],
  // Transpile Three.js packages that ship ESM
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
};

export default withNextIntl(nextConfig);
