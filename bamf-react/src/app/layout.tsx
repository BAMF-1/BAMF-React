import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
// @ts-ignore: Allow side-effect import of global CSS without module declarations
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Bounce, ToastContainer } from "react-toastify";
import { CartProvider } from "@/contexts/CartContext";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BAMF - Alternative Fashion",
  description: "Premium biker, emo, and leather clothing",
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
        style={{ backgroundColor: "#171010" }}
      >
        <AuthProvider>
          <CartProvider>
            <div
              id="blurOverlay"
              className="fixed w-full h-full backdrop-blur-sm z-25 hidden"
            />
            <Navbar />
            {children}
            <Footer />
            <ToastContainer
              position="top-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
          </CartProvider>
        </AuthProvider>
        <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID || ""} />
      </body>
    </html>
  );
}