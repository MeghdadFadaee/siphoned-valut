import { ImageResponse } from 'next/og';
import { createElement } from 'react';
import { readLedger } from '../../../lib/server';
import { ledgerSnapshot } from '../../../lib/share';
import { ShareCard } from '../../../lib/share-card';
export const dynamic = 'force-dynamic';
export async function GET() {
 try {
  const data = await ledgerSnapshot(await readLedger());
  return new ImageResponse(createElement(ShareCard, {data}), {
   width:1200,height:630,
   headers:{'Cache-Control':'no-store, max-age=0','X-Ledger-Revision':data.revision},
  });
 } catch {
  return new Response('Live vault image is temporarily unavailable.',{status:503,headers:{'Cache-Control':'no-store'}});
 }
}
