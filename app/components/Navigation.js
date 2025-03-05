import Link from "next/link"

export default function Navigation() {
  return (
    <nav className="bg-blue-500 p-2">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="text-white hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/builder" className="text-white hover:underline">
            Builder
          </Link>
        </li>
        <li>
          <Link href="/about" className="text-white hover:underline">
            About
          </Link>
        </li>
      </ul>
    </nav>
  )
}

