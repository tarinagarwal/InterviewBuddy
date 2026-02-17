"use client";
import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "bg-charcoal/80 backdrop-blur-xl border-charcoal-light"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <Flame className="w-6 h-6 text-flame" />
          <span className="font-display text-xl font-extrabold tracking-tight text-foreground group-hover:text-flame transition-colors">
            Grillr
          </span>
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            How It Works
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            FAQ
          </a>
        </div>

        {/* CTA */}
        <a
          href="#pricing"
          className="bg-flame hover:bg-flame-dark text-background font-semibold text-sm px-6 py-2.5 rounded-lg transition-all hover:scale-105 active:scale-95"
        >
          Get Grillr
        </a>
      </div>
    </nav>
  );
}
