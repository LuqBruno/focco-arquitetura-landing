# FOCCO Arquitetura — prévia comercial v03

Prévia local independente, produzida em 06/10/2026. Não comprova contratação ou
aprovação da empresa. Não foi publicada.

## Executar

```sh
npm install
npm run dev
npm run check
npm run build
```

Prévia: http://localhost:3014/. React 19.3, TypeScript 7, Vite 8 e Tailwind 4.
Motion 13.5: troca de ambientes do hero; GSAP 3.15 + ScrollTrigger: entradas e
movimento discreto; Embla 8.6: galeria manual. Sem Three.js ou recursos de outro
cliente. Sharp 0.35.5 é ferramenta de otimização, fora do navegador.

## Direção visual

Cinza da logo, papel claro e grafite. O calor vem das fotos reais do AP401.
Sora é escolha da proposta, não fonte oficial identificada. Molduras finas
dialogam com a marca. Fotografias grandes, respiro, hierarquia e cantos arredondados
interpretam o acabamento Apple solicitado. Della & Pucker é referência de qualidade,
sem copiar composição, conteúdo ou materiais. O momento próprio é explorar Living,
Suíte e Cozinha na abertura.

A versão 02 incorpora a referência local LUD (`http://localhost:3016/?t=m1`)
indicada pelo usuário: fotografia em tela inteira, texto sobre a imagem com
contraste controlado e cabeçalho integrado. Fotos, dados e identidade continuam
exclusivamente FOCCO.

## Manutenção

- `src/content.ts`: contatos, serviços, fotos e legendas.
- `src/App.tsx`: cabeçalho, hero, atuação, marca e contato.
- `src/components/ProjectGallery.tsx`: carrossel manual e acessível.
- `src/styles/site.css`: tokens, layout e modo escuro opcional.
- `src/styles/gallery.css`: composição editorial da galeria.
- `public/images/`: WebP local em dois tamanhos, sem CDN Instagram em produção.
- `references/`: originais preservados.
- `docs/FONTES.md`: fontes e pendências.
- `docs/qa/`: capturas da revisão.

`node scripts/prepare-assets.cjs` recompõe WebP a partir dos originais.
`node scripts/materials-sheet.cjs` gera a prancha de materiais.
`base-reference/` preserva o scaffold, fora de src, do build e do Git.

## Limites

O perfil público e o link de orçamento confirmam frentes de atuação, cidades e
WhatsApp. A galeria apresenta cinco ambientes do AP401, não cinco cases distintos.
Fotos públicas não equivalem a licença: obter autorização da empresa e fotógrafo.
Logo proveniente de avatar de 150 px; solicitar vetor/transparência antes da
publicação. `noindex,nofollow` é intencional nesta prévia. Domínio e canonical
dependem do destino aprovado. Não há formulário simulado, dados comerciais,
credenciais, depoimentos ou equipe inventados. Verificações em STATUS.md.

## v03 "Em foco" (06/10/2026)

A marca vira a interação: ajuste de foco no hero, visor no ambiente ativo, serviços que
entram em foco. Motion cuida de entradas, pílula (layoutId) e parallax; GSAP não é mais
usado no código (dependência mantida no package.json). Logo: `public/images/focco-logo-mask.png`,
máscara gerada do avatar oficial, aplicada via CSS `.brand-logo`. Fontes Geist/Geist Mono via
@fontsource. Detalhes e verificações em STATUS.md.
