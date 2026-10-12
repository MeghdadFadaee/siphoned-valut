import type { Metadata } from 'next';
import Dashboard from './dashboard';
import { readLedger } from '../lib/server';
import { ledgerSnapshot, siteOrigin } from '../lib/share';
export const dynamic = 'force-dynamic';
export async function generateMetadata():Promise<Metadata> {
 try {
  const data=await ledgerSnapshot(await readLedger());
  const title=`Siphoned | ${data.balance.toLocaleString('en-US')} در خزانه`;
  const description=`${data.players.length} عضو، ${data.count} تراکنش، ${data.low.length} حساب نیازمند شارژ. آخرین تراکنش: ${data.latest}. بالانس و رتبهٔ خودت را ببین.`;
  const image={url:data.imageUrl,width:1200,height:630,type:'image/png',alt:'Latest Siphoned guild balances, top players and members needing a refill'};
  return {title,description,openGraph:{type:'website',url:siteOrigin,siteName:'Siphoned Guild Vault',locale:'fa_IR',title,description,images:[image]},twitter:{card:'summary_large_image',title,description,images:[{url:image.url,alt:image.alt}]}};
 } catch {
  return {title:'Siphoned | خزانهٔ گیلد',description:'لیدربورد و وضعیت خزانهٔ گیلد در Albion Online'};
 }
}
export default function Page(){return <Dashboard/>;}
