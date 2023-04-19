/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    typescript: {
      // TODO deuda tecnica: no ignorar erores
      ignoreBuildErrors: true
    }
  },
}

module.exports = nextConfig
