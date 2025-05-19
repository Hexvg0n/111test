import { Geist, Geist_Mono } from "next/font/google"; // Zmieniono import na poprawną nazwę: GeistSans -> Geist
import "./globals.css";

const geistSans = Geist({ // Używamy Geist dla czcionki sans-serif
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nowyOpis = "Wszystko, czego potrzebujesz – w jednym miejscu. Znajdziesz tu itemy, dowiesz się, jak składać zamówienia, wygodnie przekonwertujesz linki, sprawdzisz status swojej paczki oraz przejrzysz zdjęcia QC";

export const metadata = {
  title: "Dripez", // Ten tytuł zostanie użyty również jako domyślny og:title
  description: nowyOpis, // Ten opis zostanie użyty również jako domyślny og:description
  icons: {
    icon: "/images/ico.ico", // Ścieżka do pliku w folderze public
  },
  // Dodajemy sekcję Open Graph
  openGraph: {
    title: "Dripez ", // Możesz dostosować tytuł specjalnie dla Open Graph
    description: nowyOpis,
    url: "https://www.dripez.pl", // WAŻNE: Upewnij się, że to jest poprawny URL Twojej strony
    siteName: "Dripez", // Nazwa Twojej witryny
    images: [
      {
        url: "https://www.dripez.pl/images/og-image.png", // WAŻNE: Upewnij się, że ten obrazek istnieje pod tym URL
        width: 1200,
        height: 630,
        alt: "Dripez - Platforma dla entuzjastów mody", // Opis alternatywny obrazka
      },
    ],
    locale: "pl_PL", // Określa język i region zawartości
    type: "website", // Typ zawartości
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">

      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}