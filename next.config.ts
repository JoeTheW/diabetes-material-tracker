import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "diabetes-material-tracker"; // Your GitHub repo name

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: isProd ? `/${repoName}/` : "",
  basePath: isProd ? `/${repoName}` : "",
  images: {
    unoptimized: true, // Required for GitHub Pages
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;