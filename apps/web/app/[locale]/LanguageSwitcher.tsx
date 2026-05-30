"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const languages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "od", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" }
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus management: when dropdown opens, select current language and focus listbox
  useEffect(() => {
    if (open) {
      const currentIndex = languages.findIndex((l) => l.code === locale);
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
      listboxRef.current?.focus();
    }
  }, [open, locale]);

  const switchLanguage = (code: string) => {
    router.replace(pathname, { locale: code });
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((i) => Math.min(i + 1, languages.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(languages.length - 1);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < languages.length) {
          switchLanguage(languages[focusedIndex].code);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const current = languages.find((l) => l.code === locale) || languages[0];

  return (
    <div className="relative" ref={ref}>
      <button
        ref={triggerRef}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen(!open)}
        onKeyDown={handleTriggerKeyDown}
        className="flex h-9 items-center gap-1.5 text-sm font-semibold px-3 py-1.5 bg-(--color-surface-muted) border border-(--color-border-muted) text-(--color-text-primary) rounded-full hover:bg-(--color-border-muted) transition-colors shadow-sm sm:h-10 sm:px-4 sm:py-2"
      >
        <Globe size={16} className="text-emerald-600" />
        <span className="hidden sm:inline">{current.native}</span>
        <span className="sm:hidden">{locale.toUpperCase()}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          ref={listboxRef}
          role="listbox"
          aria-label="Language options"
          aria-activedescendant={`lang-option-${focusedIndex}`}
          onKeyDown={handleListKeyDown}
          tabIndex={-1}
          className="absolute right-0 mt-2 w-40 bg-(--color-surface-page) border border-(--color-border-muted) rounded-2xl shadow-lg overflow-hidden z-50 outline-none"
        >
          {languages.map((lang, index) => {
            const isSelected = locale === lang.code;
            const isFocused = focusedIndex === index;
            return (
              <div
                key={lang.code}
                id={`lang-option-${index}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => switchLanguage(lang.code)}
                className={`w-full text-left px-3 py-1.5 text-sm font-semibold transition-colors flex items-center justify-between sm:px-4 sm:py-2 cursor-pointer
                  ${isSelected || isFocused
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450"
                    : "text-(--color-text-primary)"
                  }
                  ${isFocused ? "ring-2 ring-emerald-500/50 ring-inset" : ""}
                `}
              >
                <span>{lang.native}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
