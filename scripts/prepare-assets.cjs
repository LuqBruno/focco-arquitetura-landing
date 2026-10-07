// Otimização técnica: originais preservados, sem reconstrução de detalhes.
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const source = {
  'ap401-living':'49d6bc2905bb80e4.jpg',
  'ap401-living-gallery':'d1e1c603065cebce.jpg',
  'ap401-suite':'148b558247f9aecb.jpg',
  'ap401-cozinha':'2ff961bf471cb291.jpg',
  'ap401-estar':'53465f69d37199c6.jpg',
  'ap401-bwc':'12e2aafc316f9183.jpg',
  'ap401-detalhe':'17741fd214697f12.jpg',
};
async function run() {
  const report = [];
  for (const [name,original] of Object.entries(source)) {
    const input=path.join('references',original);
    const metadata=await sharp(input).metadata();
    for (const width of [640,1440]) {
      const output='public/images/'+name+(width===640?'-small':'')+'.webp';
      await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:86,effort:5}).toFile(output);
      report.push({file:output,source:original,width:Math.min(width,metadata.width),bytes:fs.statSync(output).size});
    }
  }
  await sharp('references/focco-logo-original.jpg').extract({left:20,top:52,width:115,height:51}).webp({lossless:true}).toFile('public/images/focco-logo.webp');
  fs.writeFileSync('docs/assets-report.json',JSON.stringify(report,null,2));
}
run().catch(error=>{console.error(error);process.exitCode=1});
