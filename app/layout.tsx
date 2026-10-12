import type { Metadata } from 'next';
import './globals.css';
const origin = 'https://siphoned-guild-vault.meghdad-social.chatgpt.site';
const title = 'Siphoned | خزانهٔ گیلد';
const description = 'بالانس خودت را ببین، جایگاهت را در لیدربورد بشناس و برای نبرد بعدی آماده شو. خزانهٔ عمومی Siphoned گیلد در Albion Online.';
const image = {
  url: `${origin}/share-card-v1.png`,
  width: 1200,
  height: 630,
  type: 'image/png',
  alt: 'Siphoned Guild Vault — لیدربورد اعضا، بالانس‌ها و تاریخچهٔ تراکنش‌های گیلد در آلبیون آنلاین',
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
    siteName: 'Siphoned Guild Vault',
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
