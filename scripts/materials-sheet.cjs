const sharp = require('sharp');
const fs = require('node:fs');
const files = fs.readdirSync('references').filter(x => x.endsWith('.jpg'));
Promise.all(files.map(async (x, i) => {
  const thumb = await sharp('references/' + x).resize(210,250,{fit:'contain',background:'#fff'}).extend({bottom:28,background:'#eee'}).composite([{input:Buffer.from('<svg width="210" height="278"><text x="5" y="268" font-size="13">' + x + '</text></svg>'),top:0,left:0}]).toBuffer();
  return {input:thumb,top:Math.floor(i/4)*278,left:(i%4)*210};
})).then(tiles => sharp({create:{width:840,height:Math.ceil(tiles.length/4)*278,channels:3,background:'#fff'}}).composite(tiles).png().toFile('docs/materials-sheet.png'));
