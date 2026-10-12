import { readLedger, isAdmin } from '../../../lib/server';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json({rows:await readLedger(),admin:await isAdmin()},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'بارگذاری خزانه ممکن نشد. دوباره تلاش کنید.'},{status:503});}}
