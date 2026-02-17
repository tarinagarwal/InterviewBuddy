import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grillr — We Cook Before They Grill",
  description: "AI-powered interview assistant that listens, sees, and delivers answers in real-time. Stealth mode. System audio capture. Visual question solving. Stay cool while they grill.",
  keywords: ["interview assistant", "AI interview", "coding interview", "interview prep", "stealth assistant"],
  openGraph: {
    title: "Grillr — We Cook Before They Grill",
    description: "AI-powered interview assistant. Real-time answers. Completely undetectable.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="noise-overlay">
        {children}
      </body>
    </html>
  );
}
