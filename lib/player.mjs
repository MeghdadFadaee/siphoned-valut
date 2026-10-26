import { merge, minimum, summarize } from './ledger.mjs';

export const playerPath = name => '/@' + encodeURIComponent(name.toLowerCase());
export const playerImagePath = name => '/player-images/' + Array.from(new TextEncoder().encode(name.toLowerCase()), n => n.toString(16).padStart(2, '0')).join('') + '.png';
export function playerFromPath(path) {
 const match = /^\/@([^/]+)\/?$/.exec(path);
 if (!match) return null;
 try { const name = decodeURIComponent(match[1]); return name.length && name.length <= 64 && !/[\x00-\x1f]/.test(name) ? name : null; } catch { return null; }
}
export const playerStatus = balance => balance < 0 ? 'بدهکار' : balance < minimum ? 'نیازمند شارژ' : 'آمادهٔ نبرد';
/**
 * @param {{date:string, player:string, reason:string, amount:number}[]} rows
 * @param {string} name
 * @returns {{name:string, balance:number, deposits:number, withdrawals:number, count:number, last:string, rank:number, members:number, topUp:number, status:string, first:string, history:{date:string, player:string, reason:string, amount:number, balance:number}[], path:string, imagePath:string}|null}
 */
export function playerSnapshot(rows, name) {
 const ordered = merge(rows), players = summarize(ordered);
 const rank = players.findIndex(p => p.name.toLowerCase() === name.toLowerCase());
 if (rank < 0) return null;
 const player = players[rank];
 let balance = 0;
 const history = ordered.filter(r => r.player.toLowerCase() === name.toLowerCase()).reverse().map(row => ({...row, balance: balance += row.amount}));
 return {...player, rank: rank + 1, members: players.length, topUp: Math.max(0, minimum - player.balance), status: playerStatus(player.balance), first: history[0].date, history: history.reverse(), path: playerPath(player.name), imagePath: playerImagePath(player.name)};
}
