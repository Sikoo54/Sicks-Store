// Next.js config: AVIF/WebP image formats + long image cache for perf.
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    // Allow product images uploaded to Supabase Storage.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mihkbyarybqnefxmooau.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
