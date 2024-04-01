import Left from "@/components/Left";
import "./globals.scss";
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from "next/font/google";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto" });
const baiJamjuree = BaiJamjuree({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-baiamjuree",
});

export const metadata = {
  title: "NLW Spacetime",
  description:
    "One spacetime developed with React, Next.js, TailwindCSS and Typescript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baiJamjuree.variable} bg-gray-900 font-sans text-gray-100`}
      >
        <main className="grid min-h-screen grid-cols-2">
          <Left />

          <div className="max-h-screen overflow-y-scroll">{children}</div>
        </main>
      </body>
    </html>
  );
}
