import Providers from '@/components/providers'
import './globals.css'
import connectDB from "@/lib/dbConnection"

// Done after the video and optional: add page metadata
export const metadata = {
  title: 'FriendZone | Home',
  description: 'Welcome to the FriendZone',
}
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  await connectDB().then(res => {
    console.log("Databse connected Sucessfully");
  }).catch(err => {
    console.log(err)
  })
  return (
    <html lang='en'>
      <body className='bg-blue-50'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}