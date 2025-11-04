import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Websmith Kit Docs',
  description: 'Documentation for Websmith Kit component library',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}