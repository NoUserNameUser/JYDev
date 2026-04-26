/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Emits a minimal standalone server bundle in .next/standalone for Docker.
  output: "standalone",
};

module.exports = nextConfig;
