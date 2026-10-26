import {ImageResponse} from 'next/og';
import {createElement} from 'react';
import {readLedger} from '../../../lib/server';
import {playerSnapshot} from '../../../lib/player.mjs';
import {PlayerCard,playerCardWidth,playerCardHeight} from '../../../lib/player-card';
import {socialFonts} from '../../../lib/social-fonts';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 const name=new URL(request.url).searchParams.get('player');
 if(!name||name.length>64)return new Response('Player not found',{status:404});
 try{
  const data=playerSnapshot(await readLedger(),name);
  if(!data)return new Response('Player not found',{status:404});
  return new ImageResponse(createElement(PlayerCard,{data}),{width:playerCardWidth,height:playerCardHeight,fonts:[...socialFonts],headers:{'Cache-Control':'no-store'}});
 }catch{return new Response('تصویر حساب موقتاً در دسترس نیست.',{status:503,headers:{'Cache-Control':'no-store'}});}
}
