import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const title = 'Meda Technology | Custom Software Development';
const description =
  'Meda Technology builds custom web, mobile and backend software, plus ready-made products: ShiftGenius, Loyalty+ and Meda Billing.';

export const metadata: Metadata = {
  metadataBase: new URL('https://meda.technology'),
  title,
  description,
  applicationName: 'Meda Technology',
  keywords: [
    'custom software development',
    'software house Jakarta',
    'web application development',
    'mobile app development',
    'backend development',
    'ERP development Indonesia',
  ],
  authors: [{ name: 'Meda Technology' }],
  alternates: { canonical: '/' },
  openGraph: {
    title,
    description,
    type: 'website',
    url: 'https://meda.technology',
    siteName: 'Meda Technology',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f8f7' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1916' },
  ],
};

const themeInit = `try{var t=localStorage.getItem('meda-theme');if(t==='dark'||t==='light'){document.documentElement.classList.add(t)}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
