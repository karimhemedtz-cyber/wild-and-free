import React from 'react';
import DOMPurify from 'dompurify';

interface Package {
  id: string;
  title: string;
  description: string;
  activities_html: string;
  price_usd: number;
  days: number;
  image_url: string;
}

interface Props {
  package: Package;
  onBook?: (id: string) => void;
}

export default function PackageCard({ package: pkg, onBook }: Props) {
  const sanitizedDesc = DOMPurify.sanitize(pkg.description);
  const sanitizedActivities = DOMPurify.sanitize(pkg.activities_html);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition border border-gray-200">
      {pkg.image_url && (
        <img
          src={pkg.image_url}
          alt={pkg.title}
          className="w-full h-56 object-cover hover:scale-105 transition"
        />
      )}

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.title}</h3>

        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <span className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full">
            📅 {pkg.days} days
          </span>
          <span className="text-2xl font-bold text-green-600">${pkg.price_usd}</span>
        </div>

        {/* Formatted Description */}
        <div
          className="text-gray-700 leading-relaxed mb-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedDesc }}
        />

        {/* Formatted Activities */}
        {sanitizedActivities && (
          <div className="mb-4">
            <h4 className="font-bold text-gray-900 mb-2">Activities:</h4>
            <div
              className="text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: sanitizedActivities }}
            />
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={() => onBook?.(pkg.id)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            🎫 Book Now
          </button>
          <button className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-bold hover:bg-blue-50 transition">
            📖 Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
