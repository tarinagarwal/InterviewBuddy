"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Is Grillr really undetectable by proctoring software?",
    a: "Yes. Grillr uses Windows' native SetWindowDisplayAffinity API with WDA_EXCLUDEFROMCAPTURE to make itself invisible to all screen recording, screen sharing, and proctoring tools. It also hides from the taskbar and becomes click-through in stealth mode. No black box, no artifacts, completely invisible.",
  },
  {
    q: "Does system audio capture work with earbuds/headphones?",
    a: "Absolutely. WASAPI loopback captures audio at the digital level — before it reaches your speakers or earbuds. It works with wired headphones, Bluetooth earbuds, or even if your volume is low. Crystal-clear audio every time.",
  },
  {
    q: "What's the difference between BYOK and Grillr plans?",
    a: "BYOK (₹1,499) gives you the software license and you use your own OpenAI/Gemini API key — unlimited usage at your own API cost. Grillr plan (₹2,499) includes 500 pre-loaded credits so you can start immediately with zero setup. Both plans include all features and lifetime updates.",
  },
  {
    q: "What is a credit?",
    a: "1 credit = 1 AI action. That's either one audio transcription + AI answer, or one screenshot analysis. A typical 1-hour interview uses about 80-100 credits. The Grillr plan includes 500 credits — enough for ~3 full interviews.",
  },
  {
    q: "Which platforms does it work with?",
    a: "Grillr works with Zoom, Google Meet, Microsoft Teams, WebEx, and any browser-based interview platform. It captures system audio regardless of the application being used.",
  },
  {
    q: "Do credits expire?",
    a: "No. Your credits never expire. Use them whenever you need them. Top up anytime.",
  },
  {
    q: "What happens if I run out of credits?",
    a: "You can purchase top-up packs starting at ₹299 for 100 credits. Or switch to BYOK mode and use your own API key for unlimited usage.",
  },
  {
    q: "Is there a refund policy?",
    a: "Due to the nature of digital software licenses, we offer refunds within 24 hours of purchase if you haven't activated the license. Once activated, credits are non-refundable.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-32 px-6 border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="text-flame font-mono text-sm tracking-widest uppercase font-semibold">
            FAQ
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mt-4 tracking-tight">
            Common <span className="text-flame">questions</span>
          </h2>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-charcoal rounded-xl border transition-all cursor-pointer ${
                openIndex === i
                  ? "border-flame/30"
                  : "border-white/5 hover:border-white/10"
              }`}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex items-center justify-between p-6">
                <h3 className="font-semibold text-base text-foreground pr-4">
                  {faq.q}
                </h3>
                <Plus
                  className={`text-flame shrink-0 transition-transform w-5 h-5 ${
                    openIndex === i ? "rotate-45" : ""
                  }`}
                />
              </div>
              <div
                className={`faq-answer px-6 pb-6 ${openIndex === i ? "open" : ""}`}
              >
                <p className="text-sm text-muted leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
