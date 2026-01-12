import type { Metadata } from "next";

import "./globals.css";



export const metadata: Metadata = {
  title: "Video | Chat with friends",
  description: "Video one to one",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
        {children}
      </body>
    </html>
  );
}
