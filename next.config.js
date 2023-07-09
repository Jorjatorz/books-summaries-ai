/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      // This is bad practice due to security concerns
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    REACT_APP_CONTENTFUL_SPACE_ID: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
    REACT_APP_CONTENTFUL_ACCESS_TOKEN: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
  }
}

module.exports = nextConfig
