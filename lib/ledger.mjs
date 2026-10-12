export const minimum = 10;
export const seed = [
['2026-10-12 19:30:40','belgheys','Withdrawal',-10],['2026-10-12 19:29:28','papaguy','Deposit',100],['2026-10-12 19:18:11','GODpori','Deposit',62],['2026-10-12 19:17:48','belgheys','Deposit',26],['2026-10-12 19:17:00','belgheys','Withdrawal',-10],['2026-10-12 19:15:42','sobhanAA','Deposit',200],['2026-10-12 13:12:10','naruto021','Deposit',10],['2026-10-12 13:04:18','naruto021','Withdrawal',-10],['2026-10-12 10:42:28','belgheys','Deposit',10],['2026-10-12 09:36:40','SkaiMaster','Deposit',8],['2026-10-12 09:16:15','HEMO','Withdrawal',-10],['2026-10-12 01:15:14','night44','Deposit',3],['2026-10-11 21:14:59','shalvargay','Deposit',10],['2026-10-11 20:55:54','sobhanAA','Deposit',10],['2026-10-11 20:53:58','MMFerii','Withdrawal',-10],['2026-10-11 20:50:35','wxsp','Deposit',10],['2026-10-11 20:49:55','Lostinu','Deposit',10]
].map(([date,player,reason,amount])=>({date,player,reason,amount,id:identity({date,player,reason,amount})}));
export function identity(r){return JSON.stringify([r.date,r.player.toLowerCase(),r.reason,r.amount]);}
export function parseLog(text){
 if(typeof text!=='string'||text.length>1000000)throw Error('حجم لاگ بیش از حد مجاز است.');
 const lines=text.replace(/^\uFEFF/,'').split(/\r?\n/).map((value,index)=>({value,index:index+1})).filter(l=>l.value.trim());
 if(lines.length<2)throw Error('عنوان ستون‌ها و حداقل یک تراکنش را وارد کنید.');
 const split=line=>line.split('\t').map(v=>{v=v.trim();if(v.startsWith('"')&&v.endsWith('"'))return v.slice(1,-1).replace(/""/g,'"');return v;});
 if(JSON.stringify(split(lines[0].value))!==JSON.stringify(['Date','Player','Reason','Amount']))throw Error('عنوان ستون‌ها باید Date، Player، Reason و Amount و با فاصلهٔ Tab باشد.');
 if(lines.length>2001)throw Error('هر بار حداکثر ۲۰۰۰ تراکنش وارد کنید.');
 return lines.slice(1).map(l=>{const cols=split(l.value);const [date,player,reason,raw]=cols;const amount=Number(raw);const d=new Date(date?.replace(' ','T')+'Z');
 if(cols.length!==4||!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)||!Number.isFinite(d.getTime())||d.toISOString().slice(0,19).replace('T',' ')!==date||!player||player.length>64||/[\x00-\x1f]/.test(player)||!['Deposit','Withdrawal'].includes(reason)||!/^[-+]?\d+$/.test(raw)||!Number.isSafeInteger(amount)||Math.abs(amount)>1000000000||(reason==='Deposit'?amount<=0:amount>=0))throw Error(`ردیف ${l.index} معتبر نیست؛ تاریخ، نام، نوع و علامت مقدار را بررسی کنید.`);
 return {date,player,reason,amount,id:identity({date,player,reason,amount})};});
}
export function merge(rows){return [...new Map(rows.map(r=>[identity(r),r])).values()].sort((a,b)=>b.date.localeCompare(a.date)||a.player.localeCompare(b.player));}
export function summarize(rows){const players=new Map();for(const r of rows){const key=r.player.toLowerCase();const p=players.get(key)||{name:r.player,balance:0,deposits:0,withdrawals:0,count:0,last:r.date};p.balance+=r.amount;p.deposits+=Math.max(0,r.amount);p.withdrawals+=Math.max(0,-r.amount);p.count++;if(r.date>p.last)p.last=r.date;players.set(key,p);}return [...players.values()].sort((a,b)=>b.balance-a.balance||a.name.localeCompare(b.name));}
