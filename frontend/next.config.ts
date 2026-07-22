import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This host's shared-hosting process limits (CloudLinux LVE) reject the extra
  // worker processes Next.js spawns during build by default; cap it to 1.
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
