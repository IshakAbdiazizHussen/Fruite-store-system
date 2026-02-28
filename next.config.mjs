import { dirname } from "path";
import { fileURLToPath } from "url";

const configDir = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: configDir,
  },
  allowedDevOrigins: [
    "192.168.0.183:3000",
    "localhost:3000",
    "127.0.0.1:3000",
  ],
};

export default nextConfig;
