export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold mb-4">🦁 Wise Warrior Safaris</h4>
            <p className="text-gray-400">Your gateway to unforgettable African adventures</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="text-gray-400 space-y-2">
              <li><a href="/" className="hover:text-orange-600">Home</a></li>
              <li><a href="/packages" className="hover:text-orange-600">Packages</a></li>
              <li><a href="/admin" className="hover:text-orange-600">Admin</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Destinations</h4>
            <ul className="text-gray-400 space-y-2">
              <li>Tanzania</li>
              <li>Kenya</li>
              <li>Uganda</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contact</h4>
            <p className="text-gray-400">Email: info@wisesafaris.com</p>
            <p className="text-gray-400">Phone: +255 xxx xxx xxx</p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Wise Warrior Safaris. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
