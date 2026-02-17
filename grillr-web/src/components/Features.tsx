import { Headphones, Eye, Shield, Zap, Target, Keyboard } from "lucide-react";

const features = [
  {
    icon: Headphones,
    title: "System Audio Capture",
    description:
      "WASAPI loopback grabs audio directly from your system output. Works with earbuds, headphones, any setup. Crystal-clear digital capture.",
    badge: "WASAPI",
  },
  {
    icon: Eye,
    title: "Visual Question Solving",
    description:
      "Press a hotkey to screenshot your screen. GPT-4o Vision reads coding problems, MCQs, diagrams — and returns the solution instantly.",
    badge: "AI Vision",
  },
  {
    icon: Shield,
    title: "Stealth Mode",
    description:
      "Invisible to proctoring software. Excluded from screen capture, hidden from taskbar, click-through when needed. They can't see what they can't detect.",
    badge: "Undetectable",
  },
  {
    icon: Zap,
    title: "Multi-Model Support",
    description:
      "Use OpenAI GPT-4o or Google Gemini. BYOK users bring their own key. Grillr users get pre-loaded credits with zero setup.",
    badge: "GPT-4o + Gemini",
  },
  {
    icon: Target,
    title: "Context-Aware Answers",
    description:
      "Remembers the last 5 Q&A pairs. Answers get smarter as the interview progresses. Like having a genius whispering in your ear.",
    badge: "Smart Context",
  },
  {
    icon: Keyboard,
    title: "Hotkey Everything",
    description:
      "M to record. I to screenshot. C to copy code. Everything works via global hotkeys — no clicking, no switching windows, no suspicion.",
    badge: "Global Hotkeys",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="absolute inset-0 radial-glow opacity-50" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-flame font-mono text-sm tracking-widest uppercase font-semibold">
            Features
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-4 tracking-tight">
            Everything you need to <span className="text-flame">ace it</span>
          </h2>
          <p className="text-muted text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            Built for technical interviews, coding rounds, and MCQ assessments.
            Works with Zoom, Meet, Teams, and any browser-based platform.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="gradient-border group cursor-default">
                <div className="bg-charcoal rounded-2xl p-8 h-full transition-all hover:bg-charcoal-light">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-flame/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-flame" />
                    </div>
                    <span className="text-[10px] font-mono text-flame bg-flame/10 px-2.5 py-1 rounded-md tracking-wider uppercase font-semibold">
                      {feature.badge}
                    </span>
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
