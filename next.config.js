/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'pocsandrdstorageaccount.blob.core.windows.net',
      'kitchen-art.s3.eu-north-1.amazonaws.com',
    ],
  },
}

module.exports = nextConfig
