import type { Metadata } from "next"
import { Inter } from "next/font/google"
import StoreProvider from "./components/StoreProvider"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PollarStar",
  description: "Create and share polls freely!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <Navbar/>
          {children}
          <Footer/>
        </StoreProvider>
      </body>
    </html>
  );
}
