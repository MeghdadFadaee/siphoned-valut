import {ImageResponse} from '@vercel/og';
import {createElement} from 'react';
import fs from 'node:fs/promises';
import {summarize} from '../../lib/ledger.mjs';
import {playerSnapshot} from '../../lib/player.mjs';
import {PlayerCard,playerCardWidth,playerCardHeight} from '../../lib/player-card';
import {socialFonts} from '../../lib/social-fonts';
const rows=JSON.parse(await fs.readFile(process.argv[2],'utf8')).rows;
for(const player of summarize(rows)) {
 const data=playerSnapshot(rows,player.name)!;
 const response=new ImageResponse(createElement(PlayerCard,{data}),{width:playerCardWidth,height:playerCardHeight,fonts:[...socialFonts]});
 await fs.writeFile(process.argv[3]+data.imagePath,Buffer.from(await response.arrayBuffer()));
}
console.log(`Generated ${summarize(rows).length} player share images.`);
