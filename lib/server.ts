import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../app/chatgpt-auth';
import { seed, merge } from './ledger.mjs';
export async function isAdmin(){const user=await getChatGPTUser();const email=(env as unknown as {ADMIN_EMAIL?:string}).ADMIN_EMAIL;return !!(email&&user&&user.email.toLowerCase()===email.toLowerCase());}
export async function readLedger(){if(!env.DB)throw Error('پایگاه داده در دسترس نیست.');const result=await env.DB.prepare('SELECT id,date,player,reason,amount FROM transactions ORDER BY date DESC').all();return merge([...seed,...result.results]);}
