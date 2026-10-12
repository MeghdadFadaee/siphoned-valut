import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Siphoned | خزانهٔ گیلد',description:'لیدربورد، بالانس اعضا و تاریخچهٔ بانک Siphoned گیلد در آلبیون آنلاین'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fa" dir="rtl"><body>{children}</body></html>;}
