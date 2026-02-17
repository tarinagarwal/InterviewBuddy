import { Flame, ArrowRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <Flame className="w-7 h-7 text-flame" />
              <span className="font-display text-2xl font-extrabold text-foreground">
                Grillr
              </span>
            </div>
            <p className="text-sm text-muted">We cook before they grill.</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-sm font-medium text-muted">
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <a href="#faq" className="hover:text-foreground transition-colors">
              FAQ
            </a>
            <a
              href="mailto:support@grillr.app"
              className="hover:text-foreground transition-colors"
            >
              Support
            </a>
          </div>

          {/* Legal */}
          <div className="text-xs text-muted text-center md:text-right">
            <p>© {new Date().getFullYear()} Grillr. All rights reserved.</p>
            <p className="mt-1">For educational purposes only.</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-8 border-t border-white/5">
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 bg-flame/10 hover:bg-flame/20 text-flame font-semibold px-8 py-4 rounded-xl transition-all text-base border border-flame/20 hover:border-flame/40 group"
          >
            <Flame className="w-5 h-5" />
            Ready to cook? Get Grillr now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}
