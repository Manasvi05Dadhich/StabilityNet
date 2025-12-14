import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Some wallet deps pull in optional modules that aren't needed for web builds.
    // Alias them to lightweight shims so Next/Webpack can bundle successfully.
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@react-native-async-storage/async-storage": path.resolve(
        __dirname,
        "lib/shims/async-storage.ts",
      ),
      "pino-pretty": path.resolve(__dirname, "lib/shims/pino-pretty.ts"),
    };

    return config;
  },
};

export default nextConfig;
