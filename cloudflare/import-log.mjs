import fs from 'node:fs/promises';import {parseLog,merge,summarize} from '../lib/ledger.mjs';
const path=process.argv[2];if(!path)throw Error('مسیر فایل لاگ را وارد کنید.');
const target=new URL('./migration/ledger.json',import.meta.url),before=JSON.parse(await fs.readFile(target,'utf8'));
const incoming=parseLog(await fs.readFile(path,'utf8')),rows=merge([...before.rows,...incoming]);
await fs.copyFile(target,new URL('./migration/ledger.backup.json',import.meta.url));
await fs.writeFile(new URL('./migration/ledger.next.json',import.meta.url),JSON.stringify({rows},null,2));
await fs.rename(new URL('./migration/ledger.next.json',import.meta.url),target);
console.log({added:rows.length-before.rows.length,duplicates:incoming.length-(rows.length-before.rows.length),transactions:rows.length,balance:summarize(rows).reduce((n,p)=>n+p.balance,0)});
