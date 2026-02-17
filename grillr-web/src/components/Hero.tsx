import { Shield, Headphones, Eye, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-grid radial-glow overflow-hidden">
      {/* Ambient flame spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-flame/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-ember/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-24">
        {/* Badge */}
        <div className="animate-fade-in inline-flex items-center gap-2 bg-charcoal-light border border-white/10 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-mono text-muted tracking-wide uppercase">
            Undetectable by proctoring software
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 animate-fade-in-up">
          We cook before{" "}
          <span className="text-flame flame-glow">they grill.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl sm:text-2xl text-muted max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200 leading-relaxed">
          AI-powered interview assistant that{" "}
          <span className="text-foreground font-semibold">
            listens to questions
          </span>
          ,{" "}
          <span className="text-foreground font-semibold">
            reads the screen
          </span>
          , and delivers perfect answers — all while staying{" "}
          <span className="text-flame font-semibold">completely invisible</span>
          .
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
          <a
            href="#pricing"
            className="group relative bg-flame hover:bg-flame-dark text-background font-bold px-10 py-4 rounded-xl transition-all hover:scale-105 active:scale-95 animate-pulse-flame text-base shadow-lg shadow-flame/20"
          >
            Get Grillr — ₹2,499
            <span className="absolute -top-2 -right-2 bg-accent text-background text-[10px] font-bold px-2.5 py-1 rounded-full">
              500 credits
            </span>
          </a>
          <a
            href="#how-it-works"
            className="group text-foreground hover:text-flame font-semibold px-8 py-4 rounded-xl border border-white/10 hover:border-flame/30 transition-all text-base flex items-center gap-2"
          >
            See How It Works
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        {/* Terminal mockup */}
        <div className="mt-20 animate-fade-in-up delay-500 max-w-2xl mx-auto">
          <div className="gradient-border">
            <div className="bg-charcoal rounded-2xl p-1">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-ember/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-muted font-mono">
                  grillr — active session
                </span>
              </div>
              {/* Terminal body */}
              <div className="p-6 font-mono text-sm space-y-3 text-left">
                <div className="flex gap-2">
                  <span className="text-flame">▶</span>
                  <span className="text-muted">interviewer asks:</span>
                  <span className="text-foreground">
                    &quot;Explain SOLID principles&quot;
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted">audio captured via</span>
                  <span className="text-accent">WASAPI loopback</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted">transcribed in</span>
                  <span className="text-accent">1.2s</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-muted">answer generated:</span>
                  <span className="text-foreground">
                    &quot;SOLID stands for five design principles...&quot;
                  </span>
                </div>
                <div className="flex gap-2 opacity-60">
                  <span className="text-flame">█</span>
                  <span className="text-muted">
                    stealth mode: invisible to screen share
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-muted animate-fade-in delay-600">
          <span className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-flame" />
            Screen-capture proof
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-flame" />
            System audio capture
          </span>
          <span className="hidden sm:inline text-white/10">|</span>
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-flame" />
            Visual question solving
          </span>
        </div>
      </div>
    </section>
  );
}
