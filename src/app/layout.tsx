import type { Metadata } from "next";
import { AppProviders } from "@/shared/providers/app-providers";
import { geistMono, geistSans } from "./_constants/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dashboardy",
  description:
    "Dashboardy danych publicznych: wypadki drogowe (GUS BDL), hydrologia i pogoda (IMGW).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
