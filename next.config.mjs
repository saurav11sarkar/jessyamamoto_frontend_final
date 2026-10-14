<<<<<<< HEAD
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://api.jetsetcares.org/api/v1",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
};

export default nextConfig;
=======
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "https://api.jetsetcares.org/api/v1",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "avatar.iran.liara.run",
      },
    ],
  },
};

export default nextConfig;
>>>>>>> 625d7c0e359d8d6ca0c4c82058e615a0280314e3
