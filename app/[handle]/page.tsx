import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {readLedger} from '../../lib/server';
import {siteOrigin,ledgerSnapshot} from '../../lib/share';
import {playerSnapshot} from '../../lib/player.mjs';
import {shareTimestamp,withShareTimestamp} from '../../lib/share-link.mjs';
import {persianNumber as n} from '../../lib/persian-text';
import {playerCardWidth,playerCardHeight} from '../../lib/player-card';
import PlayerPage from '../../components/player-page';
export const dynamic='force-dynamic';
type Props={params:Promise<{handle:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>};
async function account(params:Props['params']) {
 const {handle}=await params;
 if(!handle.startsWith('@')||handle.length<2||handle.length>65)notFound();
 const rows=await readLedger(), profile=playerSnapshot(rows,handle.slice(1));
 if(!profile)notFound();
 return {rows,profile};
}
export async function generateMetadata({params,searchParams}:Props):Promise<Metadata>{
 const {rows,profile:p}=await account(params),snapshot=await ledgerSnapshot(rows);
 const canonical=new URL(p.path,siteOrigin).href;
 const title=`${p.name} | ${p.status} · خزانه سایفوند انرژی`;
 const description=`بالانس ${n(p.balance)} سایفوند انرژی · رتبه ${n(p.rank)} از ${n(p.members)} · ${n(p.count)} تراکنش · واریز لازم تا آمادگی: ${n(p.topUp)}`;
 const timestamp=shareTimestamp((await searchParams).t);
 let image=`${siteOrigin}/api/player-image?player=${encodeURIComponent(p.name)}&v=player-v1-${snapshot.revision}`;
 if(timestamp!==null)image=withShareTimestamp(image,timestamp);
 return {title,description,alternates:{canonical},openGraph:{type:'website',locale:'fa_IR',url:timestamp===null?canonical:withShareTimestamp(canonical,timestamp),title,description,images:[{url:image,width:playerCardWidth,height:playerCardHeight,alt:`وضعیت و آخرین تراکنش‌های ${p.name}`}]},twitter:{card:'summary_large_image',title,description,images:[{url:image,alt:`وضعیت و آخرین تراکنش‌های ${p.name}`}]}};
}
export default async function Page({params}:Props){const {rows,profile}=await account(params);return <PlayerPage rows={rows} name={profile.name} origin={siteOrigin}/>;}
