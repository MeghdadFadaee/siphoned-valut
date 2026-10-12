import { env } from 'cloudflare:workers';
import { isAdmin } from '../../../lib/server';
import { getChatGPTUser } from '../../chatgpt-auth';
import { parseLog, seed, identity } from '../../../lib/ledger.mjs';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!await isAdmin())return Response.json({error:'فقط مدیر خزانه اجازهٔ ثبت لاگ دارد.'},{status:403});
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'درخواست مجاز نیست.'},{status:403});
 if(Number(request.headers.get('content-length'))>1100000)return Response.json({error:'حجم لاگ بیش از حد مجاز است.'},{status:413});
 let rows;try{const body=await request.json() as {log?:unknown};rows=parseLog(body.log);}catch(e){return Response.json({error:e instanceof Error?e.message:'لاگ معتبر نیست.'},{status:400});}
 if(!env.DB)return Response.json({error:'پایگاه داده در دسترس نیست.'},{status:503});
 const user=await getChatGPTUser();const baseline=new Set(seed.map(identity));const candidates=rows.filter(r=>!baseline.has(identity(r)));
 try{const results=candidates.length?await env.DB.batch(candidates.map(r=>env.DB!.prepare('INSERT OR IGNORE INTO transactions (id,date,player,reason,amount,imported_at,imported_by) VALUES (?,?,?,?,?,?,?)').bind(r.id,r.date,r.player,r.reason,r.amount,new Date().toISOString(),user!.userId))):[];const added=results.reduce((n,r)=>n+(r.meta.changes||0),0);return Response.json({added,duplicates:rows.length-added,total:rows.length});}catch{return Response.json({error:'ذخیره انجام نشد؛ دوباره تلاش کنید.'},{status:503});}
}
