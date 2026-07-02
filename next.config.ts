import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { DEFAULT_API_URL, API_PREFIX } from "./lib/api/api-config";

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;
    console.log('🔗 Rewriting to API:', apiUrl);
    return [
      {
        source: `${API_PREFIX}/:path*`,
        destination: `${apiUrl}/:path*`,
      },
    ];
  }
}

  export default withNextIntl(nextConfig);
