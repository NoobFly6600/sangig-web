import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ntlktyoufvsxhdaecwsh.supabase.co",
        pathname: "/storage/v1/object/public/**", // allows all public images
      },
    ],
  },
};

export default nextConfig;
