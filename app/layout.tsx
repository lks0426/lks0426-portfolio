import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LKS0426 - 全栈开发者 & AI 技术爱好者',
  description: '个人作品集，展示全栈开发项目、AI应用和云架构专业技能',
  keywords: ['全栈开发者', 'AI', '云架构师', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'LKS0426' }],
  openGraph: {
    title: 'LKS0426 - 全栈开发者 & AI 技术爱好者',
    description: '在AI与现代Web技术交汇处构建创新解决方案',
    type: 'website',
    locale: 'zh_CN',
    url: 'https://lks0426.com',
    siteName: 'LKS0426 作品集'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LKS0426 - 全栈开发者 & AI 技术爱好者',
    description: '在AI与现代Web技术交汇处构建创新解决方案',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}