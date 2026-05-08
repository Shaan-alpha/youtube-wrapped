import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin Turbopack's workspace root to this directory so it doesn't walk up
  // and pick the wrong parent when the repo is nested in OneDrive.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
