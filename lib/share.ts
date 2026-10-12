import { identity, minimum, summarize } from './ledger.mjs';
export const siteOrigin = 'https://siphoned-guild-vault.meghdad-social.chatgpt.site';
export async function ledgerSnapshot(rows: {date:string;player:string;reason:string;amount:number}[]) {
  const players = summarize(rows);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rows.map(identity).sort().join('\n')));
  const hash = Array.from(new Uint8Array(digest)).map(n=>n.toString(16).padStart(2,'0')).join('').slice(0,20);
  const revision = `fa-v3-${hash}`;
  return {
    revision,
    recent: rows.slice(0,4),
    shareUrl: `${siteOrigin}/?v=${revision}`,
    imageUrl: `${siteOrigin}/api/share-image?v=${revision}`,
    players,
    balance: players.reduce((n,p)=>n+p.balance,0),
    deposits: rows.reduce((n,r)=>n+Math.max(0,r.amount),0),
    withdrawals: rows.reduce((n,r)=>n+Math.max(0,-r.amount),0),
    low: players.filter(p=>p.balance<minimum),
    count: rows.length,
    latest: rows[0]?.date || 'هنوز تراکنشی ثبت نشده',
  };
}
