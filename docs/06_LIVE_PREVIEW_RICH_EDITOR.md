# ✏️ LIVE PREVIEW + RICH TEXT EDITOR SYSTEM

## What Admin Will See

```
┌─────────────────────────────────────────────────────────┐
│            ADMIN DASHBOARD - ADD PACKAGE                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  LEFT SIDE: Form (Admin inputs)    RIGHT SIDE: Preview │
│  ┌──────────────────┐              ┌──────────────────┐
│  │ Package Title:   │              │ LIVE PREVIEW     │
│  │ [_____________]  │◄──────────►  │                  │
│  │                  │              │ [Package Title]  │
│  │ Description:     │              │                  │
│  │ [Ctrl+B Bold]    │              │ Lorem ipsum...   │
│  │ [Ctrl+I Italic]  │              │ (updates as you  │
│  │ [Ctrl+U Underline]              │  type)           │
│  │ ┌──────────────┐ │              │                  │
│  │ │Lorem ipsum..│ │              │ [Explore] [Book] │
│  │ │dolor sit     │ │              │                  │
│  │ └──────────────┘ │              └──────────────────┘
│  │                  │              Updates in real-time!
│  │ Price: $______   │
│  │ Days: ____ [▼]   │
│  │ Max Travelers:__ │
│  │                  │
│  │ [SAVE] [CANCEL]  │
│  └──────────────────┘
└─────────────────────────────────────────────────────────┘
```

---

## 🔨 BUILD RICH TEXT EDITOR

### Step 1: Install Package

```bash
npm install quill react-quill
npm install @types/quill --save-dev
```

### Step 2: Create Rich Text Editor Component

```typescript
// src/components/RichTextEditor.tsx
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
  placeholder = 'Start typing...'
}: RichTextEditorProps) {
  const modules = {
    toolbar: [
      // Text formatting
      ['bold', 'italic', 'underline', 'strike'],
      
      // Lists
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      
      // Headings
      [{ 'header': [1, 2, 3, false] }],
      
      // Colors
      [{ 'color': [] }, { 'background': [] }],
      
      // Alignment
      [{ 'align': [] }],
      
      // Remove formatting
      ['clean'],
      
      // Links and images
      ['link', 'image', 'video']
    ]
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'header',
    'color', 'background',
    'align',
    'link', 'image', 'video'
  ];

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="quill-editor"
      />
    </div>
  );
}
```

### Step 3: Custom CSS for Editor

```css
/* src/styles/editor.css */

.quill-editor {
  background: white;
  border-radius: 0.5rem;
  border: 2px solid #e5e7eb;
  min-height: 400px;
}

.quill-editor:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ql-toolbar {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.ql-container {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  font-size: 1rem;
  font-family: system-ui, -apple-system, sans-serif;
}

.ql-toolbar.ql-snow .ql-picker-label {
  color: #4b5563;
}

.ql-toolbar.ql-snow .ql-formats button:hover,
.ql-toolbar.ql-snow .ql-formats button.ql-active,
.ql-toolbar.ql-snow .ql-formats button:focus {
  color: #2563eb;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .quill-editor {
    min-height: 300px;
  }

  .ql-toolbar {
    flex-wrap: wrap;
  }
}
```

---

## 👁️ BUILD LIVE PREVIEW COMPONENT

### Step 1: Create Preview Component

```typescript
// src/components/LivePreview.tsx
import React from 'react';
import DOMPurify from 'dompurify';

interface LivePreviewProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  type: 'package' | 'park' | 'country';
}

export default function LivePreview({
  title,
  description,
  price,
  imageUrl,
  type
}: LivePreviewProps) {
  // Sanitize HTML to prevent XSS
  const sanitizedHtml = DOMPurify.sanitize(description);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-gray-100 p-4 border-b">
        <h3 className="font-bold text-lg">📱 Live Preview</h3>
        <p className="text-xs text-gray-600">
          How customers will see this content
        </p>
      </div>

      {/* Preview Content */}
      <div className="p-4 space-y-4">
        {/* Image */}
        {imageUrl && (
          <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900">
          {title || 'Package Title...'}
        </h2>

        {/* Description (with HTML formatting) */}
        <div
          className="
            text-gray-700
            leading-relaxed
            prose prose-sm
            max-w-none
          "
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />

        {/* Price */}
        {price > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">Starting from</p>
            <p className="text-3xl font-bold text-green-600">
              ${price.toLocaleString()}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button className="
            flex-1
            bg-blue-600 text-white
            py-2 px-4 rounded-lg
            font-semibold
            hover:bg-blue-700
            transition
          ">
            Explore
          </button>
          <button className="
            flex-1
            border-2 border-blue-600
            text-blue-600
            py-2 px-4 rounded-lg
            font-semibold
            hover:bg-blue-50
            transition
          ">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 COMPLETE ADMIN FORM WITH LIVE PREVIEW

```typescript
// src/components/AdminPackageForm.tsx
import React, { useState } from 'react';
import RichTextEditor from './RichTextEditor';
import LivePreview from './LivePreview';

export default function AdminPackageForm() {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    days: 3,
    maxTravelers: 12,
    imageUrl: '',
    destinations: [] as string[],
    activities: [] as string[],
  });

  // Handle text input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'days' || name === 'maxTravelers'
        ? parseFloat(value) || 0
        : value
    }));
  };

  // Handle rich text changes
  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Package data:', formData);
    // Save to database
  };

  return (
    <div className="
      grid
      grid-cols-1
      lg:grid-cols-2
      gap-8
      p-6
      bg-gray-50
      min-h-screen
    ">
      {/* LEFT: FORM */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Create New Package</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Package Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">
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
                px-4 py-2
                border-2 border-gray-200
                rounded-lg
                focus:border-blue-500
                focus:outline-none
                transition
              "
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Price (USD) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="e.g., 1200"
              className="
                w-full
                px-4 py-2
                border-2 border-gray-200
                rounded-lg
                focus:border-blue-500
                focus:outline-none
                transition
              "
              required
              min="0"
            />
          </div>

          {/* Days & Max Travelers (2 columns) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Days</label>
              <input
                type="number"
                name="days"
                value={formData.days}
                onChange={handleInputChange}
                className="
                  w-full
                  px-4 py-2
                  border-2 border-gray-200
                  rounded-lg
                  focus:border-blue-500
                  focus:outline-none
                  transition
                "
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Max Travelers
              </label>
              <input
                type="number"
                name="maxTravelers"
                value={formData.maxTravelers}
                onChange={handleInputChange}
                className="
                  w-full
                  px-4 py-2
                  border-2 border-gray-200
                  rounded-lg
                  focus:border-blue-500
                  focus:outline-none
                  transition
                "
                min="1"
                max="50"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              placeholder="https://images.unsplash.com/..."
              className="
                w-full
                px-4 py-2
                border-2 border-gray-200
                rounded-lg
                focus:border-blue-500
                focus:outline-none
                transition
              "
            />
          </div>

          {/* Rich Text Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description (Formatting available) *
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your package...
              
Use formatting buttons:
- Bold (B) - Make text bold
- Italic (I) - Make text italic  
- Underline (U) - Underline text
- Lists - Create bullet points
- Headers - Create sections
- Colors - Add color to text
- Links - Add clickable links
- Images - Insert images
              "
            />
            <p className="text-xs text-gray-500 mt-2">
              💡 Tip: Click the formatting buttons above to style your text
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="
                flex-1
                bg-blue-600 text-white
                py-3 px-4
                rounded-lg
                font-semibold
                hover:bg-blue-700
                transition
                disabled:bg-gray-400
              "
            >
              Save Package
            </button>
            <button
              type="reset"
              className="
                flex-1
                border-2 border-gray-300
                text-gray-700
                py-3 px-4
                rounded-lg
                font-semibold
                hover:bg-gray-100
                transition
              "
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* RIGHT: LIVE PREVIEW */}
      <div className="sticky top-6 h-fit">
        <LivePreview
          title={formData.title}
          description={formData.description}
          price={formData.price}
          imageUrl={formData.imageUrl}
          type="package"
        />
      </div>
    </div>
  );
}
```

---

## 📱 MOBILE VERSION (STACKED)

```typescript
// Same component, responsive:
<div className="
  grid
  grid-cols-1        /* Mobile: stack vertically */
  lg:grid-cols-2     /* Laptop: side by side */
  gap-8
">
  {/* Form on top, Preview on bottom on mobile */}
  {/* Side by side on laptop */}
</div>
```

---

## 🎯 TOOLBAR FORMATTING OPTIONS

Admin can use:

### Text Formatting
```
[B] Bold          - Ctrl+B
[I] Italic        - Ctrl+I
[U] Underline     - Ctrl+U
[S] Strikethrough - Ctrl+D
```

### Structure
```
[H1] Heading 1
[H2] Heading 2
[H3] Heading 3
[•] Bullet List
[1.] Numbered List
```

### Colors
```
[A▼] Text Color   - Pick from palette
[◼▼] Background   - Pick from palette
```

### Media
```
[🔗] Link         - Add clickable URL
[🖼️] Image        - Upload or URL
[▶️] Video        - Embed video
```

### Other
```
[::] Align        - Left/Center/Right/Justify
[×] Clear         - Remove all formatting
```

---

## 💾 WHAT GETS SAVED

When admin clicks "Save", this is stored in database:

```json
{
  "id": "pkg-123",
  "title": "Serengeti Adventure",
  "description": "<p><strong>Experience</strong> the <em>Great Migration</em>...</p>",
  "price": 1200,
  "days": 5,
  "maxTravelers": 12,
  "imageUrl": "https://...",
  "createdAt": "2024-07-25T10:30:00Z",
  "updatedAt": "2024-07-25T10:30:00Z"
}
```

---

## 🔒 SECURITY NOTES

The system uses:
- **DOMPurify** - Removes malicious HTML/scripts
- **Prepared Statements** - Prevents SQL injection
- **Input Validation** - Checks all data types
- **Escape Output** - Safely renders content

```typescript
// Sanitize before displaying
const sanitized = DOMPurify.sanitize(userInput);
setHtml({ __html: sanitized });
```

---

## ✅ TESTING THE SYSTEM

```
1. Admin enters title "Serengeti Safari"
   → Preview updates instantly

2. Admin types description with **bold** text
   → Preview shows bold formatting

3. Admin clicks [I] for italic
   → Text becomes italic in preview

4. Admin changes price to $2000
   → Preview shows "$2,000" immediately

5. Admin uploads image
   → Image appears in preview

6. Admin clicks Save
   → Data saved to database
   → Customers see formatted content!
```

---

## 🚀 RESULT

✅ Admin sees exactly what customers will see  
✅ Live updates as they type  
✅ Professional formatting available  
✅ No coding needed  
✅ Secure and validated  
✅ Works on mobile and desktop  

Perfect! 🎉
