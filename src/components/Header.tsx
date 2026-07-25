import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-orange-600">
          🦁 Wise Warrior Safaris
        </Link>
        <nav className="flex gap-8">
          <Link to="/" className="text-gray-700 hover:text-orange-600 transition font-semibold">Home</Link>
          <Link to="/packages" className="text-gray-700 hover:text-orange-600 transition font-semibold">Packages</Link>
          <Link to="/admin" className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition font-semibold">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
