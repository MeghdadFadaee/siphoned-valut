import type { Metadata } from 'next';
import './globals.css';
const origin = 'https://siphoned-guild-vault.meghdad-social.chatgpt.site';
const title = 'سایفوند | خزانه گیلد';
const description = 'بالانس خودت را ببین، جایگاهت را در لیدربورد بشناس و برای نبرد بعدی آماده شو. خزانهٔ عمومی سایفوند گیلد در آلبیون آنلاین.';
const image = {
  url: `${origin}/api/share-image`,
  width: 1600,
  height: 1200,
  type: 'image/png',
  alt: 'آخرین بالانس خزانه، لیدربورد، حساب‌های نیازمند شارژ و تراکنش‌های گیلد',
};
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title,
  description,
  alternates: { canonical: origin },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: origin,
    siteName: 'خزانه سایفوند',
    title,
    description,
    images: [image],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: image.url, alt: image.alt }],
  },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl"><body>{children}</body></html>;}
