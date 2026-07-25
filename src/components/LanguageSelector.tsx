/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Globe2, ChevronDown } from 'lucide-react';

/**
 * A minimal "Select Language" control. It shows nothing from Google except
 * the translation itself — no banner, no icon, no "powered by" badge.
 *
 * How it works: `index.html` loads Google's Translate Website widget into a
 * hidden container (#google_translate_element). That widget secretly builds
 * a real <select class="goog-te-combo"> element with every supported
 * language. We never show that element — instead, picking a language here
 * finds it in the DOM and changes its value programmatically, which is all
 * Google needs to translate the page.
 */

// A broad set of world languages (ISO codes Google Translate recognizes).
// "English (Original)" resets the page back to how it was written.
const LANGUAGES: { code: string; label: string }[] = [
  { code: 'en', label: 'English (Original)' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh-CN', label: '中文 (简体)' },
  { code: 'zh-TW', label: '中文 (繁體)' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'ar', label: 'العربية' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'ur', label: 'اردو' },
  { code: 'fa', label: 'فارسی' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'th', label: 'ไทย' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'tl', label: 'Filipino' },
  { code: 'pl', label: 'Polski' },
  { code: 'uk', label: 'Українська' },
  { code: 'ro', label: 'Română' },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'he', label: 'עברית' },
  { code: 'sv', label: 'Svenska' },
  { code: 'fi', label: 'Suomi' },
  { code: 'da', label: 'Dansk' },
  { code: 'no', label: 'Norsk' },
  { code: 'hu', label: 'Magyar' },
  { code: 'cs', label: 'Čeština' },
  { code: 'sk', label: 'Slovenčina' },
  { code: 'bg', label: 'Български' },
  { code: 'sr', label: 'Српски' },
  { code: 'hr', label: 'Hrvatski' },
  { code: 'sl', label: 'Slovenščina' },
  { code: 'et', label: 'Eesti' },
  { code: 'lv', label: 'Latviešu' },
  { code: 'lt', label: 'Lietuvių' },
  { code: 'ka', label: 'ქართული' },
  { code: 'hy', label: 'Հայերեն' },
  { code: 'am', label: 'አማርኛ' },
  { code: 'so', label: 'Soomaali' },
  { code: 'ha', label: 'Hausa' },
  { code: 'yo', label: 'Yorùbá' },
  { code: 'ig', label: 'Igbo' },
  { code: 'zu', label: 'isiZulu' },
  { code: 'xh', label: 'isiXhosa' },
  { code: 'af', label: 'Afrikaans' },
  { code: 'rw', label: 'Kinyarwanda' },
  { code: 'mg', label: 'Malagasy' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'ne', label: 'नेपाली' },
  { code: 'si', label: 'සිංහල' },
  { code: 'my', label: 'မြန်မာ' },
  { code: 'km', label: 'ខ្មែរ' },
  { code: 'lo', label: 'ລາວ' },
];

function findGoogleCombo(): HTMLSelectElement | null {
  return document.querySelector('select.goog-te-combo');
}

function readCurrentLangFromCookie(): string {
  const match = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
  return match ? match[1] : 'en';
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState('en');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(readCurrentLangFromCookie());

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyLanguage = (code: string) => {
    setCurrent(code);
    setOpen(false);

    // Google's combo box is built asynchronously after its script loads.
    // Try right away, then briefly retry if it isn't ready yet.
    let attempts = 0;
    const tryApply = () => {
      const combo = findGoogleCombo();
      if (combo) {
        combo.value = code;
        combo.dispatchEvent(new Event('change'));
        return;
      }
      attempts += 1;
      if (attempts < 20) setTimeout(tryApply, 250);
    };
    tryApply();
  };

  const currentLabel = LANGUAGES.find((l) => l.code === current)?.label || 'English (Original)';

  return (
    <div id="language-selector" ref={containerRef} className="relative">
      <button
        type="button"
        id="language-selector-trigger"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-full text-[11px] font-mono uppercase tracking-wide text-emerald-950 hover:bg-stone-100 transition-colors cursor-pointer"
        title="Select Language"
      >
        <Globe2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{currentLabel}</span>
        <span className="sm:hidden">{current.toUpperCase()}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div
          id="language-selector-menu"
          className="absolute right-0 mt-2 w-56 max-h-80 overflow-y-auto bg-white border border-stone-200 rounded-2xl shadow-xl z-50 py-2"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => applyLanguage(lang.code)}
              className={`w-full text-left px-4 py-2 text-xs font-mono hover:bg-stone-50 transition-colors cursor-pointer ${
                current === lang.code ? 'text-emerald-950 font-bold bg-stone-50' : 'text-stone-600'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}

      {/* Hidden container Google's script mounts its real (functional, but
          visually irrelevant to us) translate element into. Positioned
          off-screen rather than display:none so Google can still build it. */}
      <div
        id="google_translate_element"
        style={{ position: 'absolute', top: '-9999px', left: '-9999px', height: 0, overflow: 'hidden' }}
      ></div>
    </div>
  );
}
