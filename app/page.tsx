import type { Metadata } from 'next';
import { persianNumber, persianDigits } from '../lib/persian-text';
import { cardWidth, cardHeight } from '../lib/share-card';
import Dashboard from './dashboard';
import { readLedger } from '../lib/server';
import { ledgerSnapshot, siteOrigin } from '../lib/share';
export const dynamic = 'force-dynamic';
export async function generateMetadata():Promise<Metadata> {
 try {
  const data=await ledgerSnapshot(await readLedger());
  const title=`سایفوند | ${persianNumber(data.balance)} در خزانه`;
  const description=`${persianNumber(data.players.length)} عضو، ${persianNumber(data.count)} تراکنش، ${persianNumber(data.low.length)} حساب نیازمند شارژ. آخرین تراکنش: ${persianDigits(data.latest)}. بالانس و رتبهٔ خودت را ببین.`;
  const image={url:data.imageUrl,width:cardWidth,height:cardHeight,type:'image/png',alt:'آخرین بالانس خزانه، لیدربورد، حساب‌های نیازمند شارژ و تراکنش‌های گیلد'};
  return {title,description,openGraph:{type:'website',url:siteOrigin,siteName:'خزانه سایفوند',locale:'fa_IR',title,description,images:[image]},twitter:{card:'summary_large_image',title,description,images:[{url:image.url,alt:image.alt}]}};
 } catch {
  return {title:'سایفوند | خزانه گیلد',description:'لیدربورد و وضعیت خزانهٔ گیلد در آلبیون آنلاین'};
 }
}
export default function Page(){return <Dashboard/>;}
