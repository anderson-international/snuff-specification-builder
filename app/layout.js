import "./globals.css"

export const metadata = {
  title: "Snuff Specification Builder",
  description: "A tool for building snuff specifications",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

