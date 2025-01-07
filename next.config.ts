import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "supply-tracker"; // Your GitHub repo name

const nextConfig: NextConfig = {
  output: 'export',
  assetPrefix: isProd ? `/${repoName}/` : "",
  basePath: isProd ? `/${repoName}` : "",
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
};

export default nextConfig;