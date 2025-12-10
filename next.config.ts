import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
    images: {
      loader: 'custom',
      loaderFile: './src/utils/cloudinaryLoader.ts',
    },
    

};

export default nextConfig;
