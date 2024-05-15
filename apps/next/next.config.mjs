// @ts-check

import withPwa from "next-pwa";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */

const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/events",
        permanent: false,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ["@ygt/db"],
  images: {
    domains: ["localhost", "res.cloudinary.com"],
  },
};

export default withPwa({
  dest: "public",
  disable: process.env.NODE_ENV !== "production",
  importScripts: ["push-listener.js"],
  skipWaiting: true,
})(config);
