import Providers from '@/components/providers'
import './globals.css'

// Done after the video and optional: add page metadata
export const metadata = {
  title: 'FriendZone | Home',
  description: 'Welcome to the FriendZone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='bg-blue-50'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}