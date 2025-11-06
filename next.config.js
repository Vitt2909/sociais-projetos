/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com'],
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
