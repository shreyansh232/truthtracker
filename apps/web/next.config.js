// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
  },
  images: {
    domains: [
      "static.theprint.in",
      "images.unsplash.com", // Keep this if you're using Unsplash images
      "example.com",
      "www.theweek.in" // Keep this if you're using example.com images
      // Add any other domains you need to load images from
    ],
  },
};

export default nextConfig;
