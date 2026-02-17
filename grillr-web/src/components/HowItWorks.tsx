import { Key, Shield, Flame } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Get Your License",
    description:
      "Choose BYOK or Grillr plan. Instant delivery via Gumroad. Enter your license key in the app to activate.",
    icon: Key,
    detail: "< 30 seconds",
  },
  {
    number: "02",
    title: "Launch & Go Stealth",
    description:
      "Open Grillr before your interview. It auto-enables stealth mode — invisible to screen share, hidden from taskbar, excluded from capture.",
    icon: Shield,
    detail: "Fully invisible",
  },
  {
    number: "03",
    title: "Ace the Interview",
    description:
      "Press M to capture audio, I to screenshot questions. Get instant AI-powered answers while staying completely undetected.",
    icon: Flame,
    detail: "Real-time answers",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-32 px-6 border-t border-white/5"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-24">
          <span className="text-flame font-mono text-sm tracking-widest uppercase font-semibold">
            How It Works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-4 tracking-tight">
            Three steps to <span className="text-flame">domination</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="space-y-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative flex items-stretch gap-8 md:gap-12"
              >
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-xl bg-charcoal border border-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-7 h-7 text-flame" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-flame/30 to-transparent my-3" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-20">
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="font-mono text-flame text-sm font-semibold">
                      {step.number}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted leading-relaxed max-w-lg text-base">
                    {step.description}
                  </p>
                  <span className="inline-block mt-4 text-xs font-mono text-accent bg-accent/10 px-3 py-1.5 rounded-md font-semibold">
                    {step.detail}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
