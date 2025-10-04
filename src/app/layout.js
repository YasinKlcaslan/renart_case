import localFont from "next/font/local";
import "./globals.css";

const avenir = localFont({
  src: [
    {
      path: "../../public/fonts/avenir/Avenir-Book.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/avenir/Avenir-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/avenir/Avenir-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-avenir",
  display: "swap",
});

const montserrat = localFont({
  src: [
    {
      path: "../../public/fonts/montserat/Montserrat-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserat/Montserrat-SemiBold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/montserat/Montserrat-Light.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata = {
  title: "Renart Engagement Collection",
  description:
    "Browse handcrafted engagement rings with live pricing and interactive previews.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${avenir.variable} ${montserrat.variable} antialiased bg-[#f6f6f6]`}
      >
        {children}
      </body>
    </html>
  );
}
