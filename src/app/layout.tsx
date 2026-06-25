import "./globals.css";
import { Merriweather } from "next/font/google";
import { cn } from "@/lib/utils";
import ReactQueryProvider from "@/components/provider/ReactQueryProvider";
import { Toaster } from "sonner";

const merriWeather = Merriweather({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn("antialiased", merriWeather.className)}>
        <ReactQueryProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
