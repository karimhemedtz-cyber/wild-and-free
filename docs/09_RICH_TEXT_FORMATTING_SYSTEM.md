# 📝 RICH TEXT FORMATTING SYSTEM - ADMIN TO USER

## ARCHITECTURE

```
┌─────────────────────────────────────────────────────┐
│             ADMIN DASHBOARD                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Admin enters text with formatting:                  │
│ "Visit **Serengeti** and see the *Great Migration*"│
│                                                     │
│ [B] [I] [U] [List] [H1] [H2] [Links] [Images]      │
│ ┌──────────────────────────────────────────────────┐│
│ │ Visit Serengeti and see the Great Migration    ││
│ └──────────────────────────────────────────────────┘│
│ [SAVE] button                                       │
└─────────────────────────────────────────────────────┘
              ↓
         DATABASE SAVES
     HTML formatted text:
"Visit <strong>Serengeti</strong> and see 
the <em>Great Migration</em>"
              ↓
┌─────────────────────────────────────────────────────┐
│          CUSTOMER/USER WEBSITE                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Package Name                                        │
│                                                     │
│ Visit Serengeti and see the Great Migration        │
│        ↑ BOLD               ↑ ITALIC               │
│                                                     │
│ Formatted text displays perfectly!                  │
│                                                     │
│ [BOOK NOW]                                          │
└─────────────────────────────────────────────────────┘
```

---

## 1️⃣ ADMIN COMPONENT WITH RICH TEXT EDITOR

### File: src/components/AdminPackageForm.tsx

```typescript
import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import { supabase } from '../lib/supabaseClient';

interface FormData {
  title: string;
  description: string;  // This will contain HTML
  price: number;
  days: number;
  imageUrl: string;
  activities: string;  // HTML formatted
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

  // Handle simple text inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'days' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  // Handle rich text editor changes
  const handleDescriptionChange = (htmlContent: string) => {
    setFormData(prev => ({
      ...prev,
      description: htmlContent  // Stores HTML
    }));
  };

  const handleActivitiesChange = (htmlContent: string) => {
    setFormData(prev => ({
      ...prev,
      activities: htmlContent  // Stores HTML
    }));
  };

  // Save to database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate
      if (!formData.title.trim()) {
        throw new Error('Package title is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Description is required');
      }

      // Save to Supabase
      const { error: dbError } = await supabase
        .from('packages')
        .insert([
          {
            title: formData.title,
            description: formData.description,  // HTML is saved here
            price_usd: formData.price,
            days: formData.days,
            image_url: formData.imageUrl,
            activities_html: formData.activities,  // Activities HTML
            slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
            created_at: new Date().toISOString(),
          }
        ]);

      if (dbError) throw dbError;

      setSuccess('Package created successfully!');
      
      // Clear form
      setFormData({
        title: '',
        description: '',
        price: 0,
        days: 3,
        imageUrl: '',
        activities: '',
      });

      // Show success message for 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to save package');
      console.error('Save error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br from-blue-50 to-indigo-50
      p-4 sm:p-6 md:p-8
    ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="
            text-3xl sm:text-4xl md:text-5xl
            font-bold text-gray-900
            mb-2
          ">
            ✏️ Create New Package
          </h1>
          <p className="text-gray-600">
            Use formatting tools to make your package description stand out
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="
            mb-4 p-4 bg-green-100 border-l-4 border-green-500
            text-green-700 rounded
            animate-pulse
          ">
            ✅ {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="
            mb-4 p-4 bg-red-100 border-l-4 border-red-500
            text-red-700 rounded
          ">
            ❌ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="
          bg-white
          rounded-lg
          shadow-xl
          p-6 sm:p-8 md:p-10
          space-y-8
        ">
          {/* Package Title */}
          <div>
            <label className="
              block text-sm font-bold text-gray-700 mb-3
            ">
              Package Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Serengeti 5-Day Adventure"
              className="
                w-full
                px-4 py-3
                border-2 border-gray-200
                rounded-lg
                focus:border-blue-500
                focus:outline-none
                focus:ring-2 focus:ring-blue-200
                transition
                text-base
              "
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 This is the main title customers will see
            </p>
          </div>

          {/* Price & Days (Side by side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="
                block text-sm font-bold text-gray-700 mb-3
              ">
                Price (USD) *
              </label>
              <div className="relative">
                <span className="
                  absolute left-4 top-3
                  text-xl text-gray-400
                ">
                  $
                </span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="1200"
                  className="
                    w-full
                    pl-8 pr-4 py-3
                    border-2 border-gray-200
                    rounded-lg
                    focus:border-blue-500
                    focus:outline-none
                    transition
                    text-base
                  "
                  required
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="
                block text-sm font-bold text-gray-700 mb-3
              ">
                Number of Days *
              </label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                placeholder="5"
                className="
                  w-full
                  px-4 py-3
                  border-2 border-gray-200
                  rounded-lg
                  focus:border-blue-500
                  focus:outline-none
                  transition
                  text-base
                "
                required
                min="1"
                max="60"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="
              block text-sm font-bold text-gray-700 mb-3
            ">
              Package Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="
                w-full
                px-4 py-3
                border-2 border-gray-200
                rounded-lg
                focus:border-blue-500
                focus:outline-none
                transition
                text-base
              "
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="
                  mt-3 h-32 object-cover rounded
                  border-2 border-gray-200
                "
              />
            )}
          </div>

          {/* Description with Rich Text Editor */}
          <div>
            <label className="
              block text-sm font-bold text-gray-700 mb-3
            ">
              Package Description (with formatting) *
            </label>
            <div className="mb-2">
              <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                💡 Use the toolbar below to format your text:
                Click [B] for bold, [I] for italic, add lists, headings, links, images, etc.
              </p>
            </div>
            <RichTextEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your package in detail. Use formatting to highlight key features..."
            />
          </div>

          {/* Activities with Rich Text Editor */}
          <div>
            <label className="
              block text-sm font-bold text-gray-700 mb-3
            ">
              Activities & Highlights (optional)
            </label>
            <RichTextEditor
              value={formData.activities}
              onChange={handleActivitiesChange}
              placeholder="List activities, highlights, and what guests will experience..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="
                flex-1
                bg-blue-600 text-white
                py-3 px-6
                rounded-lg
                font-bold
                hover:bg-blue-700
                active:bg-blue-800
                disabled:bg-gray-400 disabled:cursor-not-allowed
                transition
                text-base
              "
            >
              {loading ? '💾 Saving...' : '✅ Save Package'}
            </button>
            <button
              type="reset"
              className="
                flex-1
                border-2 border-gray-300
                text-gray-700
                py-3 px-6
                rounded-lg
                font-bold
                hover:bg-gray-100
                active:bg-gray-200
                transition
                text-base
              "
            >
              🔄 Clear Form
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-bold text-blue-900 mb-2">💡 How it works:</h3>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Type your package description</li>
            <li>2. Click formatting buttons to add bold, italic, lists, etc.</li>
            <li>3. Click "Save Package"</li>
            <li>4. Visit homepage to see formatted content! 🎉</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
```

---

## 2️⃣ RICH TEXT EDITOR COMPONENT

### File: src/components/RichTextEditor.tsx

```typescript
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Type here...'
}: RichTextEditorProps) {
  const modules = {
    toolbar: [
      // Text formatting
      ['bold', 'italic', 'underline', 'strike'],
      
      // Lists
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      
      // Headings
      [{ 'header': [1, 2, 3, false] }],
      
      // Text alignment
      [{ 'align': [] }],
      
      // Colors
      [{ 'color': [] }, { 'background': [] }],
      
      // Links and images
      ['link', 'image'],
      
      // Clear formatting
      ['clean']
    ]
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'header',
    'align', 'color', 'background',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
}
```

### File: src/styles/editor.css

```css
/* Rich Text Editor Styling */

.rich-text-editor-wrapper {
  width: 100%;
  margin: 0;
  padding: 0;
}

.quill-editor {
  background: white;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
  min-height: 300px;
  font-size: 1rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.quill-editor:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ql-toolbar {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%);
  border-bottom: 2px solid #e5e7eb;
  padding: 0.75rem;
}

.ql-toolbar.ql-snow .ql-stroke {
  stroke: #4b5563;
}

.ql-toolbar.ql-snow .ql-fill,
.ql-toolbar.ql-snow .ql-stroke.ql-fill {
  fill: #4b5563;
}

.ql-toolbar.ql-snow .ql-picker-label {
  color: #4b5563;
}

.ql-toolbar.ql-snow button:hover,
.ql-toolbar.ql-snow button.ql-active,
.ql-toolbar.ql-snow button:focus,
.ql-toolbar.ql-snow select:hover,
.ql-toolbar.ql-snow select.ql-active,
.ql-toolbar.ql-snow select:focus {
  color: #2563eb;
}

.ql-toolbar.ql-snow button:hover .ql-stroke,
.ql-toolbar.ql-snow button.ql-active .ql-stroke,
.ql-toolbar.ql-snow button:focus .ql-stroke,
.ql-toolbar.ql-snow select:hover .ql-stroke,
.ql-toolbar.ql-snow select.ql-active .ql-stroke,
.ql-toolbar.ql-snow select:focus .ql-stroke {
  stroke: #2563eb;
}

.ql-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  border: none;
  font-size: 1rem;
}

.ql-editor {
  min-height: 250px;
  padding: 1rem;
  line-height: 1.6;
  color: #111827;
}

.ql-editor.ql-blank::before {
  color: #9ca3af;
  font-style: italic;
}

/* Format display in editor */
.ql-editor strong {
  font-weight: 700;
}

.ql-editor em {
  font-style: italic;
}

.ql-editor u {
  text-decoration: underline;
}

.ql-editor s {
  text-decoration: line-through;
}

.ql-editor h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.ql-editor h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.ql-editor h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.ql-editor ol, 
.ql-editor ul {
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.ql-editor li {
  margin-bottom: 0.25rem;
}

.ql-editor a {
  color: #2563eb;
  text-decoration: underline;
}

.ql-editor img {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .quill-editor {
    min-height: 250px;
  }

  .ql-toolbar {
    flex-wrap: wrap;
    padding: 0.5rem;
  }

  .ql-toolbar.ql-snow .ql-formats {
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .ql-editor {
    min-height: 200px;
    padding: 0.75rem;
    font-size: 0.95rem;
  }
}
```

---

## 3️⃣ DISPLAY COMPONENT FOR CUSTOMERS

### File: src/components/PackageCard.tsx

```typescript
import React from 'react';
import DOMPurify from 'dompurify';

interface Package {
  id: string;
  title: string;
  description: string;  // Contains HTML from rich editor
  activities_html: string;  // Contains HTML
  price_usd: number;
  days: number;
  image_url: string;
}

interface PackageCardProps {
  package: Package;
  onBook: (id: string) => void;
}

export default function PackageCard({ package: pkg, onBook }: PackageCardProps) {
  // Sanitize HTML to prevent XSS
  const sanitizedDescription = DOMPurify.sanitize(pkg.description);
  const sanitizedActivities = DOMPurify.sanitize(pkg.activities_html);

  return (
    <div className="
      bg-white
      rounded-lg
      shadow-lg
      overflow-hidden
      hover:shadow-xl
      transition
      border border-gray-200
    ">
      {/* Image */}
      <div className="
        w-full
        h-48 sm:h-56 md:h-64
        overflow-hidden
        bg-gray-200
      ">
        <img
          src={pkg.image_url}
          alt={pkg.title}
          className="
            w-full h-full object-cover
            hover:scale-105 transition
          "
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Title */}
        <h3 className="
          text-xl sm:text-2xl font-bold
          text-gray-900 mb-2
        ">
          {pkg.title}
        </h3>

        {/* Days & Price */}
        <div className="
          flex justify-between items-center
          mb-4 pb-4 border-b border-gray-200
        ">
          <span className="
            text-sm text-gray-600
            bg-blue-50 px-3 py-1 rounded-full
          ">
            📅 {pkg.days} days
          </span>
          <span className="
            text-2xl font-bold text-green-600
          ">
            ${pkg.price_usd}
          </span>
        </div>

        {/* Description with HTML formatting */}
        <div className="
          text-gray-700 leading-relaxed mb-4
          prose prose-sm max-w-none
          text-sm sm:text-base
        "
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />

        {/* Activities if present */}
        {sanitizedActivities && (
          <div className="mb-4">
            <h4 className="font-bold text-gray-900 mb-2">Activities & Highlights:</h4>
            <div className="
              text-gray-700
              prose prose-sm max-w-none
              text-sm sm:text-base
            "
              dangerouslySetInnerHTML={{ __html: sanitizedActivities }}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="
          flex gap-3
          pt-4 border-t border-gray-200
        ">
          <button
            onClick={() => onBook(pkg.id)}
            className="
              flex-1
              bg-blue-600 text-white
              py-2 px-4 rounded-lg
              font-bold
              hover:bg-blue-700
              active:bg-blue-800
              transition
              text-sm sm:text-base
            "
          >
            🎫 Book Now
          </button>
          <button className="
            flex-1
            border-2 border-blue-600
            text-blue-600
            py-2 px-4 rounded-lg
            font-bold
            hover:bg-blue-50
            transition
            text-sm sm:text-base
          ">
            📖 Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 4️⃣ DATABASE SCHEMA

### Supabase Table: packages

```sql
CREATE TABLE packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,  -- Contains HTML from rich editor
  activities_html text,        -- Contains HTML for activities
  price_usd numeric(10, 2) NOT NULL,
  days int NOT NULL,
  image_url text,
  slug text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

The `description` and `activities_html` columns store HTML like:
```html
<p>Visit <strong>Serengeti</strong> and see the <em>Great Migration</em></p>
<ul>
  <li>Game drives</li>
  <li>Hot air balloon</li>
</ul>
```

---

## 5️⃣ INSTALLATION & SETUP

### Step 1: Install Packages

```bash
npm install quill react-quill dompurify isomorphic-dompurify
npm install -D @types/quill
```

### Step 2: Create Files

Copy the code above into:
- `src/components/AdminPackageForm.tsx`
- `src/components/RichTextEditor.tsx`
- `src/components/PackageCard.tsx`
- `src/styles/editor.css`

### Step 3: Import in App

```typescript
// src/App.tsx
import AdminPackageForm from './components/AdminPackageForm';
import PackageCard from './components/PackageCard';
import './styles/editor.css';

export default function App() {
  return (
    <div>
      {/* Admin section */}
      {isAdmin && <AdminPackageForm />}
      
      {/* Customer section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map(pkg => (
          <PackageCard key={pkg.id} package={pkg} onBook={handleBook} />
        ))}
      </div>
    </div>
  );
}
```

### Step 4: Test

```bash
npm run dev
# Visit http://localhost:5173
# Admin creates package with formatted text
# Customer homepage shows formatted content
```

---

## ✨ FORMATTING OPTIONS ADMIN CAN USE

```
[B]         Bold text
[I]         Italic text
[U]         Underline text
[S]         Strikethrough

[H1]        Heading 1
[H2]        Heading 2
[H3]        Heading 3

[•]         Bullet list
[1]         Numbered list

[<]         Align left
[∷]         Align center
[>]         Align right
[≡]         Justify

[🎨]        Text color
[◼]         Background color

[🔗]        Add link
[🖼]        Add image

[✕]        Clear formatting
```

---

## 🎯 WHAT CUSTOMERS SEE

### Mobile View
```
┌─────────────────────────┐
│  [Package Image]        │
│                         │
│  Serengeti Adventure    │
│  📅 5 days  $1200       │
│                         │
│  Visit Serengeti and    │
│  see the Great          │
│  Migration. You'll      │
│  experience:            │
│                         │
│  • Game drives          │
│  • Hot air balloon      │
│  • Cultural visits      │
│                         │
│  [BOOK NOW] [LEARN MORE]│
└─────────────────────────┘
```

### Desktop View
```
┌──────────────────────────────────┐
│ [Image]                          │
│                                  │
│ Serengeti Adventure              │
│ 📅 5 days           $1200         │
│                                  │
│ Visit Serengeti and see the      │
│ Great Migration. You'll          │
│ experience:                      │
│                                  │
│ • Game drives                    │
│ • Hot air balloon                │
│ • Cultural visits                │
│                                  │
│ [BOOK NOW]  [LEARN MORE]         │
└──────────────────────────────────┘
```

---

## ✅ SUMMARY

**How it works:**

1. ✅ Admin types in rich text editor
2. ✅ Clicks formatting buttons (B, I, U, lists, etc)
3. ✅ Clicks "Save Package"
4. ✅ HTML is stored in database
5. ✅ Customer visits website
6. ✅ Formatted content displays (bold, italic, lists, etc)
7. ✅ All responsive (mobile + desktop)
8. ✅ Safe from XSS attacks (sanitized)

**Result:** Professional formatted content on website! 🎉
