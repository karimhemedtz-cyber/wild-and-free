export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Wise Warrior Safaris</h1>
          <p className="text-xl mb-8">Experience the Magic of East Africa</p>
          <p className="text-lg mb-8 opacity-90">Unforgettable safari adventures through Tanzania, Kenya, and Uganda</p>
          <a href="/packages" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
            Explore Packages
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border-l-4 border-orange-600">
              <h3 className="text-2xl font-bold mb-4">Expert Guides</h3>
              <p className="text-gray-600">Experienced wildlife experts who know every corner of the African savanna</p>
            </div>
            <div className="p-8 border-l-4 border-amber-600">
              <h3 className="text-2xl font-bold mb-4">Luxury Camps</h3>
              <p className="text-gray-600">Stay in premium lodges and camps with world-class amenities</p>
            </div>
            <div className="p-8 border-l-4 border-orange-600">
              <h3 className="text-2xl font-bold mb-4">Best Prices</h3>
              <p className="text-gray-600">Competitive rates without compromising on quality and experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for an Adventure?</h2>
          <p className="text-lg text-gray-700 mb-8">Browse our safari packages and start planning your African dream vacation today</p>
          <a href="/packages" className="inline-block bg-orange-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-orange-700 transition">
            View All Packages
          </a>
        </div>
      </section>
    </div>
  )
}
