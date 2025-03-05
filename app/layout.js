import "./globals.css"
import Navigation from "./components/Navigation"

export const metadata = {
  title: "Snuff Specification Builder",
  description: "A tool for building snuff specifications",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Snuff Specification Builder</h1>
          <Navigation />
        </header>
        <main className="flex-grow container mx-auto p-4">{children}</main>
        <footer className="bg-gray-200 p-4 text-center">
          <p>&copy; 2025 Snuff Specification Builder</p>
        </footer>
      </body>
    </html>
  )
}

