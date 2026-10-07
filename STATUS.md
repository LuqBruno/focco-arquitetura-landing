# FOCCO — estado técnico

## 06/10/2026 — v03 "Em foco", prévia local

Pedido de Bruno: aprimorar o visual com base no trabalho da LUD (localhost:3016), com as
orientações Apple design, Motion e Emil Kowalski. Mesma stack (React/TS/Vite/Tailwind/Motion);
conteúdo, contatos e fotos preservados. Backup do código v02 em `docs/backup-src-v02/`.

Conceito: FOCCO = foco (a própria logo tem "O" como alvo e quadro como visor). Hero entra
desfocado e ajusta o foco como lente; cantoneiras de visor fecham sobre o quadro. Troca de
ambientes com pílula deslizante (layoutId, mola sem quique) e crossfade com leve desfoque.
Carrossel: só o ambiente ativo nítido e enquadrado; os demais desfocados. Serviços: item
apontado/focado fica em foco e os demais recuam. Sobre: parallax suave (useScroll).
Acabamento: logo oficial como máscara (fundo cinza retirado, sem redesenho; cor segue o
contexto), Geist/Geist Mono no lugar de Arial/Courier, sem rótulos numerados nem selos sobre
fotos, sem quadrado "assinatura", botões com resposta ao pressionar (scale .97), hover só em
ponteiro fino. Revelações migradas de GSAP para Motion (`whileInView`); MotionConfig
`reducedMotion="user"`.

Verificações desta rodada: `npm run check` e `npm run build` ok (JS 395 kB / 126 kB gzip;
GSAP não é mais carregado). Chrome do painel: desktop escuro (entrada do hero, troca Living→
Suíte, pílula e legenda, carrossel com foco/visor, hover dos serviços, Sobre) e 390×844 claro
(hero, logo clara sobre a foto e grafite fora dela, menu: abre, foco, fechar devolve foco;
overflow 0 em cinco alturas). Console sem erros. Não feito: Lighthouse, aparelho físico,
emulação real de movimento reduzido do sistema, leitor de tela.

Pendências mantidas: logo vetorial oficial, autorização das fotos, validação de textos.

## Histórico — v02

Pedido: landing profissional a partir de @arq.focco, com acabamento Apple e
referência de qualidade Della & Pucker. Complemento posterior: usar o design do
projeto LUD em localhost:3016/?t=m1. Demonstração, sem contratação comprovada.

### Implementado

- Hero imersivo em tela inteira com fotografia real AP401, título e contato
  integrados, gradação para contraste e três ambientes selecionáveis.
- Header translúcido sobre hero e sólido no restante; menu mobile nativo modal,
  Escape, restauração de foco e bloqueio do fundo.
- Galeria editorial Embla de cinco ambientes do mesmo projeto. Manual, com
  botões, indicador, Home/End e setas; suporte de arraste, sem autoplay.
- Atuação, leitura da marca, painel de contato e rodapé com identidade cinza,
  papel claro/grafite, molduras finas e fotografias em grande presença.
- Modo escuro opcional persistido localmente; Motion e GSAP com redução de
  movimento e cleanup. Nenhum texto depende de WebGL ou término de animação.
- Imagens WebP locais em 640 px e até 1440 px, originais preservados; fontes
  locais Sora com licença OFL. Caminhos relativos e Vite base './'.
- README, fontes, orientações específicas e documentação de manutenção.

### Verificações desta rodada

- TypeScript e build de produção passaram após a implementação.
- npm audit: zero vulnerabilidades após atualização do Sharp de manutenção.
- Inspeção no navegador: primeira dobra em 360, 390, 430 e 1440 px na v02;
  verificações anteriores de 768/1024 px no layout base. Sem overflow horizontal
  nas larguras inspecionadas. Capturas v02 em docs/qa.
- Hero: seleção Suíte e Cozinha; imagens reais exibidas, botão selecionado muda.
- Menu em 390 px: abrir, Escape e retorno do foco; link A Focco fecha e navega.
- Carrossel: próximo muda 01→02, End→05 e Home→01. Imagens carregadas nas
  posições visitadas. Bordas extremas corretamente desabilitadas.
- Links WhatsApp conferidos com o mesmo +55 48 99988-5332 e mensagem coerente;
  número verificado via link oficial da bio. Nenhuma mensagem enviada.
- Modo escuro/claro alternou no navegador; estado local preservado.
- Console consultado sem erros/avisos durante a revisão.
- Movimento reduzido: mecanismos revisados no código; emulação de sistema não
  disponível na ferramenta utilizada. Não declarar auditoria completa automatizada.

Build final: JS principal ~389 kB (124 kB gzip), GSAP ~70 kB e ScrollTrigger
~43 kB em chunks dinâmicos, CSS ~28 kB (7 kB gzip); Sora ~46 kB por peso.
Hero: 31.418 bytes mobile e 105.858 bytes desktop. Pesos reais individuais em
docs/assets-report.json. Lighthouse e métricas de rede/LCP não foram medidos.

### Pendências reais

Solicitar logo oficial vetorial/transparente: atual é avatar 150 px, recortado
sem inventar detalhes. Autorizar uso comercial das fotos pela empresa/fotógrafo;
validar texto e escopo de cada serviço. Equipe, registro profissional, endereço
e horários não confirmados, sem inclusão na página. Não há domínio definitivo.

### Próxima ação

Apresentar a prévia http://localhost:3014/?v=02-lud. Recolher validação da FOCCO,
materiais de marca e direitos de imagem antes de publicação. Nenhum repositório
remoto criado, site publicado ou mensagem enviada nesta rodada. Capturas com
prefixo v02 representam o hero atual; arquivos anteriores são revisão intermediária.
