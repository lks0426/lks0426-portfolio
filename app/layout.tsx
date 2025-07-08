import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LKS0426 - Full-Stack Developer & AI Enthusiast',
  description: 'Personal portfolio showcasing full-stack development projects, AI applications, and cloud architecture expertise',
  keywords: ['full-stack developer', 'AI', 'cloud architect', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'LKS0426' }],
  openGraph: {
    title: 'LKS0426 - Full-Stack Developer & AI Enthusiast',
    description: 'Building innovative solutions at the intersection of AI and modern web technologies',
    type: 'website',
    locale: 'en_US',
    url: 'https://lks0426.com',
    siteName: 'LKS0426 Portfolio'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LKS0426 - Full-Stack Developer & AI Enthusiast',
    description: 'Building innovative solutions at the intersection of AI and modern web technologies',
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
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}