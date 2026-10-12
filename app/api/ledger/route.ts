import { ledgerSnapshot } from '../../../lib/share';
import { readLedger, isAdmin } from '../../../lib/server';
export const dynamic='force-dynamic';
export async function GET(){try{const rows=await readLedger();const snapshot=await ledgerSnapshot(rows);return Response.json({rows,shareUrl:snapshot.shareUrl,admin:await isAdmin()},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'بارگذاری خزانه ممکن نشد. دوباره تلاش کنید.'},{status:503});}}
