module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      '/': { page: '/' },
      '/current': { page: '/current' },
      '/archive': { page: '/archive' },
    }
  },
}
