import { Check } from "lucide-react";

const plans = [
  {
    name: "BYOK",
    tagline: "Bring Your Own Key",
    price: "1,499",
    period: "one-time",
    highlight: false,
    features: [
      "Lifetime software license",
      "Use your own OpenAI / Gemini key",
      "Unlimited usage (your key, your cost)",
      "All features included",
      "Stealth mode & screen capture exclusion",
      "System audio capture (WASAPI)",
      "Visual question solving",
      "Future updates included",
    ],
    cta: "Get BYOK License",
    ctaUrl: "#",
    note: "Requires your own API key setup",
  },
  {
    name: "Grillr",
    tagline: "Zero Setup. Just Works.",
    price: "2,499",
    period: "one-time",
    highlight: true,
    features: [
      "Lifetime software license",
      "500 credits included (~3 interviews)",
      "Pre-configured AI — no API key needed",
      "All features included",
      "Stealth mode & screen capture exclusion",
      "System audio capture (WASAPI)",
      "Visual question solving",
      "Priority support",
    ],
    cta: "Get Grillr — Best Value",
    ctaUrl: "#",
    note: "Top up credits anytime",
  },
];

const topups = [
  { credits: "100", price: "299", perCredit: "₹3.0", label: "~1 interview" },
  { credits: "250", price: "699", perCredit: "₹2.8", label: "~2 interviews" },
  { credits: "600", price: "1,499", perCredit: "₹2.5", label: "Best Value" },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-32 px-6 border-t border-white/5"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-flame/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-flame font-mono text-sm tracking-widest uppercase font-semibold">
            Pricing
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-4 tracking-tight">
            Pick your <span className="text-flame">heat level</span>
          </h2>
          <p className="text-muted text-lg mt-5 max-w-xl mx-auto">
            One-time payment. No subscriptions. No recurring charges.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-2xl p-8 transition-all ${
                plan.highlight
                  ? "bg-gradient-to-b from-flame/10 to-charcoal border-2 border-flame/30 scale-[1.02]"
                  : "bg-charcoal border border-white/10"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-flame text-background text-xs font-bold px-4 py-1.5 rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted mt-2">{plan.tagline}</p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-sm text-muted">₹</span>
                <span className="font-display text-5xl font-extrabold text-foreground">
                  {plan.price}
                </span>
                <span className="text-sm text-muted ml-1">/ {plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check className="w-5 h-5 text-flame shrink-0 mt-0.5" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href={plan.ctaUrl}
                className={`block text-center font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-95 ${
                  plan.highlight
                    ? "bg-flame hover:bg-flame-dark text-background shadow-lg shadow-flame/20"
                    : "bg-white/5 hover:bg-white/10 text-foreground border border-white/10"
                }`}
              >
                {plan.cta}
              </a>

              <p className="text-xs text-muted text-center mt-4">{plan.note}</p>
            </div>
          ))}
        </div>

        {/* Top-up Credits */}
        <div className="text-center mb-10">
          <h3 className="font-display text-2xl font-bold text-foreground">
            Need more credits?
          </h3>
          <p className="text-sm text-muted mt-2">
            Top up anytime. Credits never expire.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {topups.map((topup, i) => (
            <div
              key={i}
              className="bg-charcoal border border-white/10 rounded-xl p-6 text-center hover:border-flame/30 transition-all cursor-pointer group"
            >
              <div className="text-4xl font-display font-extrabold text-foreground group-hover:text-flame transition-colors">
                {topup.credits}
              </div>
              <div className="text-xs text-muted mt-1 uppercase tracking-wide">
                credits
              </div>
              <div className="text-2xl font-bold text-foreground mt-4">
                ₹{topup.price}
              </div>
              <div className="text-xs text-muted mt-2">
                {topup.perCredit}/credit • {topup.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
