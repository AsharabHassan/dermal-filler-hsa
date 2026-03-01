import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harley Street Aesthetics | Your Personalized Filler Analysis",
  description: "AI-powered facial analysis for personalized aesthetic treatment recommendations by Harley Street Aesthetics",
  manifest: "/manifest.json",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
