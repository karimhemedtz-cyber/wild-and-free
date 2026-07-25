import React, { useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { supabase } from '../../lib/supabaseClient';

interface FormData {
  title: string;
  description: string;
  price: number;
  days: number;
  imageUrl: string;
  activities: string;
}

export default function AdminPackageForm() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    price: 0,
    days: 3,
    imageUrl: '',
    activities: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'days' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.title.trim()) throw new Error('Title required');
      if (!formData.description.trim()) throw new Error('Description required');

      const { error: dbError } = await supabase.from('packages').insert([{
        title: formData.title,
        description: formData.description,
        price_usd: formData.price,
        days: formData.days,
        image_url: formData.imageUrl,
        activities_html: formData.activities,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
      }]);

      if (dbError) throw dbError;
      setSuccess('✅ Package created!');
      setFormData({ title: '', description: '', price: 0, days: 3, imageUrl: '', activities: '' });
    } catch (err: any) {
      setError('❌ ' + (err.message || 'Error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create Package</h1>
      
      {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">{success}</div>}
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="Package Title"
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />

      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        placeholder="Price"
        className="w-full px-4 py-2 border rounded mb-4"
        required
      />

      <input
        type="number"
        name="days"
        value={formData.days}
        onChange={handleInputChange}
        placeholder="Days"
        className="w-full px-4 py-2 border rounded mb-4"
      />

      <input
        type="url"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleInputChange}
        placeholder="Image URL"
        className="w-full px-4 py-2 border rounded mb-4"
      />

      <RichTextEditor
        value={formData.description}
        onChange={(html) => setFormData(p => ({ ...p, description: html }))}
        placeholder="Description..."
      />

      <RichTextEditor
        value={formData.activities}
        onChange={(html) => setFormData(p => ({ ...p, activities: html }))}
        placeholder="Activities..."
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400 mt-6"
      >
        {loading ? 'Saving...' : 'Save Package'}
      </button>
    </form>
  );
}
