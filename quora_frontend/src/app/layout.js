import { Inter } from 'next/font/google'
import { Montserrat } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })
const mont = Montserrat({subsets: ['latin']})


export const metadata = {
  title: 'TransportSimple',
  description: 'Assessment',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={mont.className}>{children}</body>
    </html>
  )
}
