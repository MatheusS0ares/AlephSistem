import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Resolve workspace root conflict in local monorepo env (harmless on Vercel)
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Security + performance
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
