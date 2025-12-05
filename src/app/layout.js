import { Geist, Geist_Mono } from "next/font/google";
import Providers from "@/rtk/Provider";
import "../styles/globals.css";
import "../styles/antd-overrides.css";
import { NotificationProvider } from "@/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Legassi Legal Consultancy App",
  description:
    "Secure legal document management, contract preparation and professional legal consultancy services. AI-powered search and solutions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NotificationProvider> {children}</NotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
