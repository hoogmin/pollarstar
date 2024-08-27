import type { Metadata } from "next"
import StoreProvider from "./components/StoreProvider"
import PollarStarNavbar from "./components/PollarStarNavbar"
import Footer from "./components/Footer"
import "./globals.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

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
      <body>
        <StoreProvider>
          <PollarStarNavbar/>
          {children}
          <Footer/>
        </StoreProvider>
      </body>
    </html>
  );
}
