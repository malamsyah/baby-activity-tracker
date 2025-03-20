import './globals.css'

export const metadata = {
  title: 'Baby Activity Tracker',
  description: 'Track your baby\'s daily activities including diaper changes, feedings, and sleep',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
