/** @type {import('next').NextConfig} */
export default {
  reactStrictMode: true,
  distDir: process.env.NEXT_DIST || ".next",
  allowedDevOrigins: ["*.local", "192.168.*.*", "10.*.*.*"],
};
