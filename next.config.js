/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['@supabase/supabase-js'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        resend: 'resend',
      });
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gstatic.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.thegazette.news",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "sprintcouriers.co.bw",
        port: "",
        pathname: "/**",
      },
      // Supabase domains for business and other images
      {
        protocol: "https",
        hostname: "olxfihpifzfziukutcaq.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "fvmazhbawgqwtopxysnn.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;