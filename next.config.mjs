/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // ⚠️ CRITICAL FIX: Stops the "Internal Assertion Failed" crash
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' } // ✅ Allows your Property images to load
    ],
  },
};

export default nextConfig;