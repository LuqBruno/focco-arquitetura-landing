import { useCallback, useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { projects } from '../content';
import '../styles/gallery.css';

function Arrow({ direction }: { direction: 'previous' | 'next' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={direction === 'previous' ? 'M19 12H5m0 0 6 6m-6-6 6-6' : 'M5 12h14m0 0-6-6m6 6-6 6'}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ProjectGallery() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [selected, setSelected] = useState(0);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [carouselRef, carousel] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    loop: false,
    slidesToScroll: 1,
    duration: reducedMotion ? 0 : 30,
  });

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  const syncSelection = useCallback(() => {
    if (!carousel) return;
    setSelected(carousel.selectedScrollSnap());
    setCanPrevious(carousel.canScrollPrev());
    setCanNext(carousel.canScrollNext());
  }, [carousel]);

  useEffect(() => {
    if (!carousel) return;
    syncSelection();
    carousel.on('select', syncSelection);
    carousel.on('reInit', syncSelection);
    return () => {
      carousel.off('select', syncSelection);
      carousel.off('reInit', syncSelection);
    };
  }, [carousel, syncSelection]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!carousel || event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        carousel.scrollPrev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        carousel.scrollNext();
        break;
      case 'Home':
        event.preventDefault();
        carousel.scrollTo(0);
        break;
      case 'End':
        event.preventDefault();
        carousel.scrollTo(projects.length - 1);
        break;
    }
  };

  return (
    <section id="projetos" className="gallery" aria-label="Projetos e ambientes">
      <div className="section-shell gallery-intro">
        <div className="gallery-intro-grid">
          <h2 className="section-title gallery-title">
            A identidade mora<br />nos detalhes.<br />
            <span>Em cada ambiente.</span>
          </h2>
          <div className="gallery-intro-copy">
            <p className="section-copy">
              Um olhar sobre os ambientes do AP401, projeto do portfólio FOCCO.
              Materialidade, luz e proporção em uma mesma linguagem.
            </p>
          </div>
        </div>
      </div>

      <p id="gallery-keyboard-help" className="gallery-sr-only">
        Use as setas esquerda e direita para explorar os ambientes. Home abre o primeiro e End abre o último.
      </p>
      <div className="gallery-stage">
        <div
          ref={carouselRef}
          className="gallery-viewport"
          role="region"
          aria-roledescription="carrossel"
          aria-label="Ambientes do AP401"
          aria-describedby="gallery-keyboard-help"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className="gallery-track">
            {projects.map((project, index) => (
              <article
                className={`gallery-slide${selected === index ? ' is-selected' : ''}`}
                key={project.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} de ${projects.length}: ${project.title}`}
              >
                <figure className="gallery-figure">
                  <div className="gallery-image-frame">
                    <picture>
                    <source media="(max-width:600px)" srcSet={project.image.replace('.webp','-small.webp')} />
                    <img
                      src={project.image}
                      alt={project.alt}
                      width="1200"
                      height="900"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      style={{ objectPosition: project.position || 'center' }}
                    />
                    </picture>
                    <span className="gallery-focus" aria-hidden="true"><i /><i /><i /><i /></span>
                  </div>
                  <figcaption className="gallery-caption">
                    <div>
                      <p className="gallery-category">{project.category}</p>
                      <h3>{project.title}</h3>
                    </div>
                    <div className="gallery-caption-detail">
                      <p>{project.description}</p>
                      {project.credit && <span className="gallery-credit">{project.credit}</span>}
                    </div>
                  </figcaption>
                </figure>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="section-shell gallery-controls">
        <p className="gallery-counter" aria-hidden="true">
          <span>{projects.length ? String(selected + 1).padStart(2, '0') : '00'}</span>
          <span className="gallery-counter-divider">/</span>
          <span className="gallery-counter-total">{String(projects.length).padStart(2, '0')}</span>
        </p>
        <div className="gallery-dots" role="group" aria-label="Escolher ambiente">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={`gallery-dot${selected === index ? ' is-selected' : ''}`}
              aria-label={`Ir para ambiente ${index + 1}: ${project.title}`}
              aria-current={selected === index ? 'true' : undefined}
              onClick={() => carousel?.scrollTo(index)}
            ><span /></button>
          ))}
        </div>
        <div className="gallery-arrows" role="group" aria-label="Navegar entre ambientes">
          <button type="button" className="gallery-arrow" aria-label="Ambiente anterior" disabled={!canPrevious} onClick={() => carousel?.scrollPrev()}>
            <Arrow direction="previous" />
          </button>
          <button type="button" className="gallery-arrow" aria-label="Próximo ambiente" disabled={!canNext} onClick={() => carousel?.scrollNext()}>
            <Arrow direction="next" />
          </button>
        </div>
      </div>
      <p className="gallery-sr-only" aria-live="polite" aria-atomic="true">
        {projects[selected] ? `Ambiente ${selected + 1} de ${projects.length}: ${projects[selected].title}` : 'Nenhum ambiente disponível.'}
      </p>
    </section>
  );
}
