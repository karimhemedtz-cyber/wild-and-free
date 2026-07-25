import { useState, useEffect } from 'react'

export default function PackagesPage() {
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: 'Serengeti Safari',
      price: 2500,
      days: 5,
      image: '🦁',
      description: 'Experience the great wildebeest migration and witness the raw beauty of Serengeti National Park'
    },
    {
      id: 2,
      name: 'Kilimanjaro Trek',
      price: 1800,
      days: 6,
      image: '⛰️',
      description: 'Climb Africa\'s highest peak with experienced guides and full logistical support'
    },
    {
      id: 3,
      name: 'Zanzibar Beach',
      price: 1500,
      days: 4,
      image: '🏝️',
      description: 'Relax on pristine white sandy beaches and explore the historic Stone Town'
    },
    {
      id: 4,
      name: 'Ngorongoro Crater',
      price: 2000,
      days: 3,
      image: '🌋',
      description: 'Descend into the world\'s largest volcanic crater and spot the Big Five in their natural habitat'
    },
    {
      id: 5,
      name: 'Lake Victoria Tour',
      price: 1200,
      days: 2,
      image: '🚤',
      description: 'Cruise on Africa\'s largest lake and visit local fishing villages'
    },
    {
      id: 6,
      name: 'Masai Cultural Experience',
      price: 900,
      days: 2,
      image: '🪶',
      description: 'Immerse yourself in Masai culture and traditions with authentic village visits'
    }
  ])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-5xl font-bold text-center mb-4">Safari Packages</h1>
        <p className="text-center text-gray-600 text-lg mb-12">Choose from our carefully curated safari experiences</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
              <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-8 text-white text-6xl flex items-center justify-center h-48">
                {pkg.image}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                
                <div className="flex justify-between items-center mb-6 py-4 border-t border-b">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="text-lg font-bold">{pkg.days} Days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price per person</p>
                    <p className="text-2xl font-bold text-orange-600">${pkg.price}</p>
                  </div>
                </div>

                <button className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
