/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`,
        pathname: "/storage/v1/object/**",
      },
    ],
  },
};

module.exports = nextConfig;
