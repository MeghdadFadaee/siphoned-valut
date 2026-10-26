import http from 'node:http';
import fs from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {parseLog,merge,summarize} from '../../lib/ledger.mjs';
const root=fileURLToPath(new URL('../../',import.meta.url));
const ledgerPath=root+'cloudflare/migration/ledger.json';
const token=randomBytes(24).toString('hex');
const port=Number(process.env.SIPHONED_TOOL_PORT||5188),origin=`http://127.0.0.1:${port}`;
let busy=false,auth='idle';
const env={...process.env,WRANGLER_SEND_METRICS:'false',CLOUDFLARE_ACCOUNT_ID:'1be1e22e71d56e01fe8fdbf449b341dc',WRANGLER_LOG_PATH:root+'cloudflare/.work/wrangler-logs'};
function run(args){return new Promise((resolve,reject)=>{let output='';const child=spawn(process.execPath,args,{cwd:root,env});child.stdout.on('data',d=>output+=d);child.stderr.on('data',d=>output+=d);child.on('error',reject);child.on('close',code=>code===0?resolve(output):reject(Error('عملیات کامل نشد. اتصال اینترنت و ورود کلودفلیر را بررسی کنید.')));});}
async function readLedger(){return JSON.parse(await fs.readFile(ledgerPath,'utf8'));}
function stats(rows){const players=summarize(rows);return {transactions:rows.length,members:players.length,balance:players.reduce((n,p)=>n+p.balance,0)};}
function candidate(before,log){const incoming=parseLog(log),rows=merge([...before.rows,...incoming]),added=rows.length-before.rows.length;return {rows,...stats(rows),added,duplicates:incoming.length-added};}
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,origin);
 const send=(status,obj)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(obj));};
 if(req.headers.host!==`127.0.0.1:${port}`){send(403,{error:'دسترسی مجاز نیست.'});return;}
 try{
  const assets={
   '/assets/Vazirmatn-Regular.ttf':['lib/fonts/Vazirmatn-Regular.ttf','font/ttf'],
   '/assets/Vazirmatn-Bold.ttf':['lib/fonts/Vazirmatn-Bold.ttf','font/ttf'],
   '/assets/favicon.svg':['public/favicon.svg','image/svg+xml'],
   '/assets/siphoned-energy.svg':['public/siphoned-energy.svg','image/svg+xml'],
  };
  if(req.method==='GET'&&assets[url.pathname]){const [path,type]=assets[url.pathname];res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-cache'});res.end(await fs.readFile(root+path));return;}
  if(req.method==='GET'&&url.pathname==='/'&&url.searchParams.get('key')===token){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer'});res.end((await fs.readFile(root+'cloudflare/tool/index.html','utf8')).replace('__SESSION__',token));return;}
  if(req.headers['x-session']!==token||(req.method==='POST'&&req.headers.origin!==origin)){send(403,{error:'ابزار را از میان‌بر محلی باز کنید.'});return;}
  if(req.method==='GET'&&url.pathname==='/status'){send(200,{...stats((await readLedger()).rows),busy,auth});return;}
  if(req.method==='GET'&&url.pathname==='/package'){res.writeHead(200,{'Content-Type':'application/zip','Content-Disposition':'attachment; filename="siphoned.zip"','Cache-Control':'no-store'});res.end(await fs.readFile(root+'cloudflare/siphoned.zip'));return;}
  if(req.method!=='POST'){send(404,{error:'پیدا نشد.'});return;}
  let body='';for await(const chunk of req){body+=chunk;if(body.length>2000000)throw Error('حجم لاگ بیش از حد مجاز است.');}
  const data=JSON.parse(body||'{}');
  if(busy){send(409,{error:'عملیات قبلی هنوز در حال انجام است.'});return;}
  if(url.pathname==='/preview'){const {rows,...result}=candidate(await readLedger(),data.log);send(200,result);return;}
  if(url.pathname==='/connect'){
   auth='waiting';busy=true;send(200,{message:'پنجرهٔ ورود کلودفلیر باز می‌شود؛ تأیید دسترسی را خودتان انجام دهید.'});
   run([root+'node_modules/wrangler/bin/wrangler.js','login']).then(()=>auth='connected').catch(()=>auth='failed').finally(()=>busy=false);return;
  }
  if(url.pathname==='/build'){
   busy=true;const original=await fs.readFile(ledgerPath,'utf8');
   try{const {rows,...result}=candidate(JSON.parse(original),data.log);await fs.mkdir(root+'cloudflare/.work',{recursive:true});await fs.copyFile(ledgerPath,root+'cloudflare/migration/ledger.backup.json');await fs.writeFile(ledgerPath,JSON.stringify({rows},null,2));await run([root+'cloudflare/build.mjs']);send(200,{...result,message:'داده‌ها ادغام شدند و بستهٔ سایت و تصویر جدید آماده است.'});}
   catch(error){await fs.writeFile(ledgerPath,original);throw error;}finally{busy=false;}return;
  }
  if(url.pathname==='/deploy'){
   busy=true;try{await run([root+'node_modules/wrangler/bin/wrangler.js','pages','deploy',root+'cloudflare/dist','--project-name','siphoned-energy','--branch','main','--commit-dirty=true']);send(200,{message:'نسخهٔ جدید منتشر شد.',url:'https://siphoned.oneup.megh.dad/?t='+Math.floor(Date.now()/1000)});}finally{busy=false;}return;
  }
  send(404,{error:'پیدا نشد.'});
 }catch(error){send(400,{error:error.message});}
});
server.listen(port,'127.0.0.1',()=>{const url=origin+'/?key='+token;console.log('ابزار سایفوند انرژی آماده است: '+url);if(!process.env.SIPHONED_NO_OPEN)spawn('open',[url],{stdio:'ignore'});});
server.on('error',()=>{console.error('ابزار قبلاً باز است یا این پورت در دسترس نیست. پنجرهٔ قبلی را ببندید و دوباره اجرا کنید.');process.exit(1);});
