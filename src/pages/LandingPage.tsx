import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Clock, MapPin, Pause, Play, Scissors, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, cn } from '../utils';
import type { Service } from '../types';


const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=85&w=1800',
    alt: 'Interior de barbearia com cadeiras clássicas',
    label: 'O ambiente',
  },
  {
    src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=85&w=1800',
    alt: 'Barbeiro trabalhando em um corte de cabelo',
    label: 'A técnica',
  },
  {
    src: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=85&w=1800',
    alt: 'Detalhe de acabamento em corte masculino',
    label: 'Os detalhes',
  },
  {
    src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=85&w=1800',
    alt: 'Ferramentas profissionais de barbearia',
    label: 'O cuidado',
  },
];

const GalleryCarousel: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = (index: number) => setActive((index + galleryImages.length) % galleryImages.length);
  const next = () => goTo(active + 1);
  const previous = () => goTo(active - 1);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive(current => (current + 1) % galleryImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section
      id="galeria"
      className="py-24 md:py-32 bg-[#191916] overflow-hidden"
      aria-label="Galeria de fotos da barbearia"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-7 mb-12">
          <div>
            <span className="eyebrow">Um olhar por dentro</span>
            <h2 className="display-title text-5xl md:text-6xl mt-5">Cada detalhe<br />faz parte do ritual.</h2>
          </div>
          <p className="text-stone-500 text-sm leading-7 max-w-xs">Conheça um pouco do ambiente, da técnica e do cuidado em cada atendimento.</p>
        </div>

        <div className="relative group">
          <div className="relative aspect-[4/3] md:aspect-[16/7] overflow-hidden bg-[#24231f]">
            {galleryImages.map((photo, index) => (
              <img
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === active ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden={index !== active}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[#11110f]/75 via-transparent to-black/10 pointer-events-none" />
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <span className="text-[10px] uppercase tracking-[.24em] text-[#e1c99f]">0{active + 1} / 0{galleryImages.length}</span>
              <p className="font-display text-3xl md:text-5xl text-white mt-2">{galleryImages[active].label}</p>
            </div>
            <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex items-center gap-2">
              <button type="button" onClick={previous} aria-label="Foto anterior" className="w-11 h-11 md:w-12 md:h-12 grid place-items-center border border-white/50 text-white bg-black/20 backdrop-blur-sm hover:bg-[#c5a879] hover:text-[#171612] hover:border-[#c5a879] transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button type="button" onClick={next} aria-label="Próxima foto" className="w-11 h-11 md:w-12 md:h-12 grid place-items-center border border-white/50 text-white bg-black/20 backdrop-blur-sm hover:bg-[#c5a879] hover:text-[#171612] hover:border-[#c5a879] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Retomar apresentação automática' : 'Pausar apresentação automática'} className="w-11 h-11 md:w-12 md:h-12 grid place-items-center border border-white/50 text-white bg-black/20 backdrop-blur-sm hover:bg-[#c5a879] hover:text-[#171612] hover:border-[#c5a879] transition-colors">
                {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-5 mt-5">
            <div className="flex items-center gap-2" aria-label="Selecionar foto">
              {galleryImages.map((photo, index) => (
                <button key={photo.src} type="button" onClick={() => goTo(index)} aria-label={`Ir para foto ${index + 1}`} aria-current={index === active ? 'true' : undefined}
                  className={`h-1 transition-all duration-300 ${index === active ? 'w-10 bg-[#c5a879]' : 'w-5 bg-stone-700 hover:bg-stone-400'}`} />
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-[.2em] text-stone-500">{paused ? 'Apresentação pausada' : 'Apresentação automática'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServiceCategory: React.FC<{ category: string; services: Service[] }> = ({ category, services }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="border-t border-stone-700/70">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between py-6 text-left group">
        <h3 className="font-display text-2xl md:text-3xl text-stone-100 group-hover:text-[#c5a879] transition-colors">{category}</h3>
        <ChevronDown className={cn("w-5 h-5 text-[#c5a879] transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>
      {isOpen && <div className="grid md:grid-cols-2 gap-x-12 pb-6">
        {services.map(service => (
          <div key={service.id} className="flex justify-between gap-5 py-5 border-t border-stone-800/80">
            <div className="min-w-0">
              <h4 className="text-base font-semibold text-stone-100 mb-1">{service.name}</h4>
              {service.description && <p className="text-sm leading-6 text-stone-500 max-w-sm">{service.description}</p>}
              <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 mt-3"><Clock className="w-3.5 h-3.5" />{service.durationMinutes} min</span>
            </div>
            <span className="text-[#c5a879] font-semibold whitespace-nowrap">{formatCurrency(service.price)}</span>
          </div>
        ))}
      </div>}
    </div>
  );
};

export function LandingPage() {
  const { services } = useAppContext();
  const groupedServices = useMemo(() => services.reduce((acc, service) => {
    (acc[service.category] ||= []).push(service);
    return acc;
  }, {} as Record<string, Service[]>), [services]);

  return (
    <div className="flex-1 bg-[#11110f] text-stone-100">
      <section className="relative min-h-[680px] md:min-h-[760px] flex items-end overflow-hidden">
        <img src="/hero.jpg" alt="Interior de uma barbearia" className="absolute inset-0 w-full h-full object-cover object-center opacity-45"
          onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=85&w=2200'; }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#11110f]/95 via-[#11110f]/65 to-[#11110f]/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#11110f] via-transparent to-[#11110f]/20" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-36 pb-24 md:pb-32">
          <div className="max-w-3xl">
            <div className="eyebrow flex items-center gap-3 mb-8"><span className="w-10 h-px bg-[#c5a879]" /> Barbearia clássica · Estilo contemporâneo</div>
            <h1 className="display-title text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] mb-8">
              O seu estilo.<br /><span className="text-[#c5a879] italic">Sua assinatura.</span>
            </h1>
            <p className="text-stone-300 text-base md:text-lg leading-8 max-w-xl mb-10">
              Mais do que um corte, um momento para cuidar de você. Técnica, personalidade e atenção a cada detalhe.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/agendar" className="inline-flex items-center justify-center gap-4 px-8 py-4 bg-[#c5a879] text-[#171612] text-xs font-bold uppercase tracking-[.18em] hover:bg-[#d6bd94] transition-colors">
                Reservar horário <ArrowUpRight className="w-4 h-4" />
              </Link>
              <a href="#servicos" className="inline-flex items-center justify-center px-8 py-4 border border-stone-500/60 text-stone-100 text-xs font-bold uppercase tracking-[.18em] hover:border-[#c5a879] hover:text-[#c5a879] transition-colors">
                Conhecer serviços
              </a>
            </div>
          </div>
          <div className="hidden md:flex absolute bottom-12 right-12 items-center gap-4 text-[10px] tracking-[.22em] uppercase text-stone-400">
            <span className="w-12 h-px bg-[#c5a879]" /> Tradição em cada detalhe
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 grid lg:grid-cols-[.8fr_1.2fr] gap-12 lg:gap-24 items-start">
          <div>
            <span className="eyebrow">A experiência</span>
            <h2 className="display-title text-5xl md:text-6xl mt-5">O cuidado está<br />nos detalhes.</h2>
          </div>
          <div className="pt-1 lg:pt-10">
            <p className="text-stone-300 text-lg md:text-xl leading-9 max-w-2xl">Um ambiente feito para desacelerar, renovar o visual e sair com a confiança em dia. Do primeiro atendimento ao acabamento final, cada escolha tem propósito.</p>
            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-stone-800">
              <div><Scissors className="w-5 h-5 text-[#c5a879] mb-4" /><p className="font-display text-2xl">Precisão</p><p className="text-sm text-stone-500 mt-2">Técnica e atenção ao acabamento.</p></div>
              <div><Star className="w-5 h-5 text-[#c5a879] mb-4" /><p className="font-display text-2xl">Personalidade</p><p className="text-sm text-stone-500 mt-2">Um visual que combina com você.</p></div>
            </div>
          </div>
        </div>
      </section>

      <GalleryCarousel />

      <section id="servicos" className="py-24 md:py-32 bg-[#191916]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div><span className="eyebrow">Menu de serviços</span><h2 className="display-title text-5xl md:text-6xl mt-5">Seu próximo<br />visual começa aqui.</h2></div>
            <p className="text-stone-500 text-sm leading-7 max-w-xs">Escolha seu serviço e reserve um horário com praticidade.</p>
          </div>
          <div className="max-w-5xl">
            {(Object.entries(groupedServices) as [string, Service[]][]).map(([category, items]) => <ServiceCategory key={category} category={category} services={items} />)}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=85&w=1200" alt="Produtos e cuidados para barba" className="w-full aspect-[4/5] object-cover" />
            <div className="absolute -bottom-5 -right-5 hidden md:block w-32 h-32 border border-[#c5a879]/70" />
          </div>
          <div className="lg:pl-6">
            <span className="eyebrow">Ritual de cuidado</span>
            <h2 className="display-title text-5xl md:text-6xl mt-5 mb-8">O estilo não<br />termina no corte.</h2>
            <p className="text-stone-400 leading-8 mb-5">Os detalhes fazem a diferença. Conheça uma seleção de produtos para cuidar do cabelo e da barba e manter seu visual também em casa.</p>
            <p className="text-xs uppercase tracking-[.18em] text-[#c5a879]">Consulte a disponibilidade na barbearia</p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-28 bg-[#c5a879] text-[#171612]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div><span className="text-[10px] uppercase font-bold tracking-[.24em]">Seu momento começa agora</span><h2 className="display-title text-5xl md:text-7xl mt-5 max-w-2xl">Reserve um tempo para você.</h2></div>
          <Link to="/agendar" className="inline-flex items-center justify-center gap-5 border border-[#171612]/50 px-7 py-4 text-xs uppercase font-bold tracking-[.18em] hover:bg-[#171612] hover:text-[#c5a879] transition-colors">Agendar horário <ArrowUpRight className="w-4 h-4" /></Link>
        </div>
      </section>

      <section className="py-16 bg-[#11110f]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row gap-5 sm:items-center justify-between">
          <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-[#c5a879]" /><div><p className="text-sm font-semibold">Venha nos visitar</p><p className="text-xs text-stone-500 mt-1">Endereço e horário de funcionamento configuráveis para o negócio.</p></div></div>
          <Link to="/agendar" className="text-xs uppercase tracking-[.16em] text-[#c5a879] hover:text-stone-100 transition-colors inline-flex items-center gap-2">Agendar visita <ArrowUpRight className="w-4 h-4" /></Link>
        </div>
      </section>

      <Link to="/agendar" className="fixed bottom-5 right-5 z-40 md:hidden flex items-center gap-2 bg-[#c5a879] text-[#171612] px-5 py-3.5 text-xs font-bold uppercase tracking-wider shadow-xl">
        <Clock className="w-4 h-4" /> Agendar
      </Link>
    </div>
  );
}
