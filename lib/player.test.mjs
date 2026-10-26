import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seed} from './ledger.mjs';
import {playerSnapshot, playerPath, playerFromPath, playerImagePath} from './player.mjs';
test('player lookup is case insensitive and running balances reconcile in unsorted history', () => {
 const p = playerSnapshot([...seed].reverse(), 'BELGHEYS');
 assert.equal(p.balance,16); assert.equal(p.count,4); assert.equal(p.history[0].balance,p.balance);
 assert.deepEqual(p.history.map(r=>r.balance),[16,26,0,10]);
 assert.equal(p.deposits-p.withdrawals,p.balance); assert.equal(p.topUp,0);
 assert.equal(p.path,'/@belgheys'); assert.equal(p.members,12);
});
test('debt, low and ready statuses include the correct required top-up',()=>{
 for(const [balance,status,topUp] of [[-10,'بدهکار',20],[0,'نیازمند شارژ',10],[9,'نیازمند شارژ',1],[10,'آمادهٔ نبرد',0]]){
  const p=playerSnapshot([{date:'2026-10-12 19:30:40',player:'x',reason:'Deposit',amount:balance}],'x');
  assert.equal(p.status,status);assert.equal(p.topUp,topUp);
 }
 assert.equal(playerSnapshot(seed,'missing'),null);
});
test('routes and image paths safely handle special names and malformed paths',()=>{
 for(const name of ['GODpori','a b','a/b','<script>','بازیکن','__proto__']) {
  assert.equal(playerFromPath(playerPath(name)),name.toLowerCase());
  assert.match(playerImagePath(name),/^\/player-images\/[a-f0-9]+\.png$/);
 }
 for(const path of ['/admin','/@','/@%ZZ','/@a/b','/@%00','/@'+'a'.repeat(65)])assert.equal(playerFromPath(path),null);
});
