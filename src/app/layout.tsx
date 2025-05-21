import React from 'react'
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'
import { Metadata } from 'next';
import { ApolloWrapper } from './ApolloWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | PenBlog App',
    default:'PenBlog App',
  },
  description:'The easiest way to add PenBlog App to your application.',
  metadataBase: new URL('https://penblog.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  )
}
