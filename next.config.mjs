/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the Claude preview dev server to coexist with the user's own
  // `next dev` in this directory by using a separate .next dir when
  // NEXT_DIST_DIR is set. Next.js's lockfile is per-distDir, so this
  // sidesteps the "another next dev is already running" check.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
};

export default nextConfig;
