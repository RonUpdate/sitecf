/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // Изменено с true на пустой объект для Next.js 15
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Добавляем опцию для очистки кэша маршрутов
  onDemandEntries: {
    // период (в мс), в течение которого страница должна оставаться в буфере
    maxInactiveAge: 25 * 1000,
    // количество страниц, которые должны быть сохранены в буфере
    pagesBufferLength: 2,
  },
}

export default nextConfig
