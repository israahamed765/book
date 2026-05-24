/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // هذا السطر هو الأهم لأنه يجبر Next.js على تصدير ملفات HTML ثابتة
  images: {
    unoptimized: true, // مهم جداً لتجنب مشاكل الصور في Next.js عند الرفع
  },
}

module.exports = nextConfig