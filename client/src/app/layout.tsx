import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProviderStore from "@/store/ProviderStore";
import { Toaster } from "react-hot-toast";
import MainWarapper from "@/components/MainWarapper";
import NavbarComponent from "@/components/Navbar";
import TanstackProvider from "@/hooks/TanstackProvider";
import Footer from "@/components/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LMS Academy",
  description: "Learn Anything, Anytime, Anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        cz-shortcut-listen="true"
      >
        <Toaster />
        <ProviderStore>
          <TanstackProvider>
            <MainWarapper>
              <NavbarComponent />
              {children}
              <Footer />
            </MainWarapper>
          </TanstackProvider>
        </ProviderStore>

        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}
