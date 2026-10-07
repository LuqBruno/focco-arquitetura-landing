import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { brand, heroRooms, services } from './content';
import ProjectGallery from './components/ProjectGallery';

// Curvas e molas compartilhadas: entrada com ease-out forte; seleção com mola criticamente amortecida.
const easeOut = [0.23, 1, 0.32, 1] as const;
const settle = { type: 'spring', bounce: 0, duration: 0.45 } as const;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

// Logo oficial (avatar 150 px) usado como máscara: só o fundo cinza foi retirado; a cor segue o contexto.
function Logo() {
  return <span className="brand-logo" role="img" aria-label="FOCCO Arquitetura" />;
}

function Contact({ label = 'Conversar sobre meu projeto', light = false }: { label?: string; light?: boolean }) {
  return <a className={'button ' + (light ? 'button-light' : '')} href={brand.contact} target="_blank" rel="noopener noreferrer">{label}<Arrow diagonal /></a>;
}

// Entrada curta ao rolar. Conteúdo visível sem JS; com movimento reduzido, o MotionConfig remove o deslocamento.
function Reveal({ children, className, delay = 0, as = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'article' }) {
  const Tag = as === 'article' ? motion.article : motion.div;
  return <Tag className={className} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 0.7, ease: easeOut, delay }}>{children}</Tag>;
}

function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [dark, setDark] = useState(document.documentElement.dataset.theme === 'dark');
  useEffect(() => {
    const hero = document.querySelector('#inicio');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting), { rootMargin: '-91px 0px 0px 0px' });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  const close = () => { dialog.current?.close(); setOpen(false); menuButton.current?.focus(); };
  const toggleTheme = () => {
    const next = !dark;
    setDark(next); document.documentElement.dataset.theme = next ? 'dark' : 'light';
    try { localStorage.setItem('focco-theme', next ? 'dark' : 'light'); } catch { /* preferência opcional */ }
  };
  const links = [['#projetos', 'Projetos'], ['#atuacao', 'Atuação'], ['#focco', 'A Focco']] as const;
  return <>
    <a className="skip-link" href="#principal">Pular para o conteúdo</a>
    <header className={'site-header' + (overHero ? ' over-hero' : '')}>
      <a className="brand" href="#inicio" aria-label="FOCCO Arquitetura, início"><Logo /></a>
      <nav className="desktop-nav" aria-label="Principal">{links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}</nav>
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Modo escuro" aria-pressed={dark} title={dark ? 'Usar modo claro' : 'Usar modo escuro'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">{dark ? <><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></> : <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />}</svg>
        </button>
        <a className="header-contact" href={brand.contact} target="_blank" rel="noopener noreferrer">Vamos conversar <Arrow diagonal /></a>
        <button ref={menuButton} className="menu-toggle" aria-controls="menu-mobile" aria-expanded={open} aria-label="Abrir menu" onClick={() => { setOpen(true); dialog.current?.showModal(); }}><span /><span /></button>
      </div>
    </header>
    <dialog id="menu-mobile" aria-label="Menu de navegação" className="mobile-menu" ref={dialog} onClose={() => { setOpen(false); menuButton.current?.focus(); }} onClick={event => { if (event.target === dialog.current) close(); }}>
      <div className="mobile-menu-panel"><div className="mobile-menu-top"><Logo /><button onClick={close} aria-label="Fechar menu">×</button></div>
        <nav aria-label="Navegação móvel">{links.map(([href, label]) => <a key={href} href={href} onClick={close}>{label}<Arrow diagonal /></a>)}<a href="#contato" onClick={close}>Contato<Arrow diagonal /></a></nav>
        <p>Arquitetura que traduz identidade em espaços.</p><Contact />
      </div>
    </dialog>
  </>;
}

// Cantoneiras de visor: a marca "em foco". Fecham sobre o enquadramento enquanto a imagem ganha nitidez.
function Viewfinder({ className = '', play = true }: { className?: string; play?: boolean }) {
  return <span className={'viewfinder ' + className} aria-hidden="true">
    {(['tl', 'tr', 'bl', 'br'] as const).map(corner => <motion.i key={corner} className={corner}
      initial={play ? { opacity: 0, x: corner.endsWith('l') ? -18 : 18, y: corner.startsWith('t') ? -18 : 18 } : false}
      animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 1.1, ease: easeOut, delay: 0.35 }} />)}
  </span>;
}

function Hero() {
  const [room, setRoom] = useState(0);
  const [first, setFirst] = useState(true);
  const reduced = useReducedMotion();
  const current = heroRooms[room];
  const choose = (index: number) => { setFirst(false); setRoom(index); };
  // Primeira imagem: "ajuste de foco" de lente (desfocada → nítida). Trocas seguintes: crossfade com leve desfoque.
  const enter = reduced ? false : first ? { opacity: 1, filter: 'blur(16px)', scale: 1.07 } : { opacity: 0, filter: 'blur(8px)', scale: 1.025 };
  return <section id="inicio" className="hero hero-immersive" aria-labelledby="hero-title">
    <div className="hero-heading section-shell">
      <motion.div initial={reduced ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: easeOut, delay: 0.5 }}>
        <p className="eyebrow">Arquitetura & Interiores</p>
        <h1 id="hero-title">O seu jeito de viver.<br /><span>Em cada espaço.</span></h1>
      </motion.div>
      <motion.div className="hero-intro" initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeOut, delay: 0.65 }}>
        <p>Arquitetura que traduz identidade em espaços.</p>
        <Contact label="Começar meu projeto" />
        <a className="quiet-link" href="#projetos">Explorar os ambientes <span aria-hidden="true">↓</span></a>
      </motion.div>
    </div>
    <div className="hero-stage">
      <div className="hero-frame">
        <AnimatePresence initial={true}>
          <motion.picture className="hero-picture" key={current.name} initial={enter} animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }} exit={{ opacity: 0, transition: { duration: 0.35 } }}
            transition={{ duration: first ? 1.6 : 0.6, ease: easeOut }}>
            <source media="(max-width:600px)" srcSet={current.image.replace('.webp', '-small.webp')} />
            <img src={current.image} alt={current.alt} width="1440" height="1024" fetchPriority={room === 0 ? 'high' : 'auto'} decoding="async" style={{ objectPosition: current.position }} />
          </motion.picture>
        </AnimatePresence>
        <div className="hero-image-shade" aria-hidden="true" />
        <Viewfinder className="viewfinder-hero" play={!reduced} />
        <div className="hero-project-label"><span className="micro-label">AP 401 · Interiores</span>
          <AnimatePresence mode="wait" initial={false}><motion.p key={current.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25, ease: easeOut }}>{current.detail}</motion.p></AnimatePresence>
        </div>
        <div className="room-switcher" role="group" aria-label="Explorar ambientes do AP 401">{heroRooms.map((item, index) =>
          <button key={item.name} aria-pressed={room === index} onClick={() => choose(index)}>
            {room === index && <motion.span className="room-pill" layoutId="room-pill" transition={settle} aria-hidden="true" />}
            <span className="room-label">{item.name}</span>
          </button>)}
        </div>
      </div>
      <div className="hero-baseline"><span>Florianópolis · Criciúma · Nova Veneza</span></div>
    </div>
  </section>;
}

function Services() {
  return <section className="services section-shell" id="atuacao" aria-labelledby="services-title">
    <Reveal className="services-heading"><h2 id="services-title" className="section-title">Pensado para o espaço.<br /><span>Feito para você.</span></h2><p className="section-copy">Do olhar sobre o conjunto à atenção aos materiais. Conheça as frentes apresentadas pela Focco.</p></Reveal>
    {/* Ao apontar ou focar um serviço, os demais saem de foco: a mesma ideia da marca aplicada à leitura. */}
    <div className="service-list">{services.map((service, i) =>
      <Reveal as="article" className="service-row" key={service.name} delay={i * 0.06}>
        <h3>{service.name}</h3>
        <div><h4>{service.intro}</h4><p>{service.text}</p></div>
        <a href={brand.contact} target="_blank" rel="noopener noreferrer" aria-label={'Conversar sobre ' + service.name}><Arrow diagonal /></a>
      </Reveal>)}
    </div>
  </section>;
}

function About() {
  const photo = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: photo, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);
  return <section className="about section-shell" id="focco" aria-labelledby="about-title">
    <Reveal className="about-media">
      <div className="about-photo" ref={photo}>
        <motion.img style={{ y }} src="./images/ap401-detalhe.webp" srcSet="./images/ap401-detalhe-small.webp 640w, ./images/ap401-detalhe.webp 1421w" sizes="(max-width:768px) 90vw, 45vw" width="1421" height="1776" alt="Detalhe da suíte master do AP 401: madeira, cabeceira e luz indireta." loading="lazy" decoding="async" />
      </div>
      <p className="about-caption">AP 401, suíte master</p>
    </Reveal>
    <Reveal className="about-copy" delay={0.08}>
      <h2 id="about-title" className="section-title">Identidade que<br />se sente.<br /><span>Não só se vê.</span></h2>
      <p>O portfólio da Focco aproxima materiais naturais, integração dos ambientes e luz acolhedora. No AP 401, esse encontro aparece na madeira, nas texturas e na continuidade entre os espaços.</p>
      <p className="about-fronts">Arquitetura, interiores e consultoria.</p>
      <a className="text-link" href={brand.instagram} target="_blank" rel="noopener noreferrer">Ver mais no Instagram <Arrow diagonal /></a>
    </Reveal>
  </section>;
}

function ContactSection() {
  return <section id="contato" className="contact section-shell" aria-labelledby="contact-title"><Reveal className="contact-panel">
    <p className="eyebrow">Vamos conversar</p>
    <h2 id="contact-title">Seu próximo espaço<br /><span>começa com uma conversa.</span></h2>
    <p>Conte o que você imagina, a cidade do projeto e o tipo de espaço. Converse com a Focco para conhecer as possibilidades de atendimento e solicitar um orçamento.</p>
    <Contact label="Conversar com a Focco" light />
    <a className="contact-phone" href={brand.contact} target="_blank" rel="noopener noreferrer">WhatsApp {brand.phone}</a>
    <div className="contact-regions">{brand.regions.map(region => <span key={region}>{region}</span>)}</div>
    <span className="contact-art" aria-hidden="true">focco.</span>
  </Reveal></section>;
}

export default function App() {
  return <div><Header /><main id="principal" tabIndex={-1}><Hero /><ProjectGallery /><Services /><About /><ContactSection /></main>
    <footer className="footer section-shell"><a className="brand" href="#inicio" aria-label="FOCCO Arquitetura, voltar ao início"><Logo /></a><p>Arquitetura que traduz identidade em espaços.</p><a href={brand.instagram} target="_blank" rel="noopener noreferrer">Instagram <Arrow diagonal /></a><small>Prévia comercial independente. Imagens e textos sujeitos à autorização da Focco.</small></footer></div>;
}
