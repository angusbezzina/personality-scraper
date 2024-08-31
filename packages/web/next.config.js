const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: Boolean(process.env.ANALYZE),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins];
    }

    return config;
  },
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      "@langchain/core/messages",
      "@langchain/core/outputs",
      "@langchain/core/prompts",
      "@langchain/openai",
      "@personality-scraper/api/client",
      "@personality-scraper/api/server",
      "@personality-scraper/components",
      "@personality-scraper/services",
      "@phosphor-icons/react",
      "@phosphor-icons/react/dist/ssr",
    ],
  },
  transpilePackages: [
    "@personality-scraper/api/client",
    "@personality-scraper/api/server",
    "@personality-scraper/common",
    "@personality-scraper/components",
    "@personality-scraper/constants",
    "@personality-scraper/styles",
    "@personality-scraper/types",
    "@personality-scraper/services",
    "@personality-scraper/ai",
  ],
};

module.exports = withBundleAnalyzer(nextConfig);
