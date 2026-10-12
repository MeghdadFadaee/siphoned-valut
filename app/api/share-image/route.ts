import { ImageResponse } from 'next/og';
import { createElement } from 'react';
import { readLedger } from '../../../lib/server';
import { ledgerSnapshot } from '../../../lib/share';
import { socialFonts } from '../../../lib/social-fonts';
import { ShareCard, cardWidth, cardHeight } from '../../../lib/share-card';
export const dynamic = 'force-dynamic';
export async function GET() {
 try {
  const data = await ledgerSnapshot(await readLedger());
  return new ImageResponse(createElement(ShareCard, {data}), {
   width:cardWidth,height:cardHeight,fonts:[...socialFonts],
   headers:{'Cache-Control':'no-store, max-age=0','X-Ledger-Revision':data.revision},
  });
 } catch {
  return new Response('تصویر زنده خزانه موقتاً در دسترس نیست.',{status:503,headers:{'Cache-Control':'no-store'}});
 }
}
