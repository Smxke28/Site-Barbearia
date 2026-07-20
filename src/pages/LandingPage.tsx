import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, Clock, MapPin, Star } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, cn } from '../utils';
import type { Service } from '../types';

const ServiceCategory: React.FC<{ category: string; services: Service[] }> = ({ category, services }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
      >
        <h3 className="font-display text-2xl font-bold uppercase tracking-wider text-zinc-100">{category}</h3>
        <ChevronDown className={cn("w-5 h-5 text-zinc-500 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>
      
      <div 
        className={cn(
          "grid md:grid-cols-2 gap-px bg-zinc-800 transition-all duration-300 overflow-hidden",
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {services.map((service) => (
          <div 
            key={service.id} 
            className="group flex flex-col justify-between p-6 bg-zinc-950 hover:bg-zinc-900/50 transition-colors"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-bold group-hover:text-amber-500 transition-colors">{service.name}</h4>
                <span className="text-lg font-bold text-amber-500">{formatCurrency(service.price)}</span>
              </div>
              <p className="text-zinc-400 text-sm mb-4">{service.description}</p>
            </div>
            <div className="flex items-center text-zinc-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {service.durationMinutes} minutos
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingPage() {
  const { services } = useAppContext();

  const groupedServices = useMemo(() => {
    return services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {} as Record<string, Service[]>);
  }, [services]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.jpg" 
            alt="Barbearia background" 
            className="w-full h-full object-cover opacity-20"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=2000";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-amber-500/10 text-amber-500 mb-6 border border-amber-500/20">
            <Star className="w-4 h-4 mr-1 fill-amber-500" /> Referência em Juiz de Fora
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-6 uppercase">
            Sua aparência,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
              Nosso legado.
            </span>
          </h1>
          <p className="mt-4 text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
            Cortes clássicos, barba alinhada e um ambiente premium feito para cavalheiros. Esqueça as esperas sem sentido com nosso novo agendamento digital.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/agendar" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors uppercase tracking-wide"
            >
              Agendar Horário
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              to="/fila" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded bg-zinc-900 text-zinc-100 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 transition-colors uppercase tracking-wide"
            >
              Ver Fila ao Vivo
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold uppercase tracking-wider mb-4">Nossos Serviços</h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto rounded"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {(Object.entries(groupedServices) as [string, Service[]][]).map(([category, categoryServices]) => (
              <ServiceCategory key={category} category={category} services={categoryServices} />
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase Section */}
      <section className="py-20 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=1000" 
                alt="Produtos para barba" 
                className="rounded-lg shadow-2xl shadow-amber-500/10 border border-zinc-800 object-cover w-full h-[500px]"
              />
            </div>
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="font-display text-4xl font-bold uppercase tracking-wider mb-6">Cuidado <span className="text-amber-500">Premium</span></h2>
              <p className="text-lg text-zinc-400 mb-6">
                Não usamos qualquer produto. Nossa seleção conta com os melhores óleos, balms e pomadas do mercado para garantir que seu cabelo e barba tenham um acabamento impecável e duradouro.
              </p>
              <p className="text-lg text-zinc-400 mb-8">
                Produtos exclusivos à venda na barbearia para você manter o estilo em casa.
              </p>
              <div className="inline-flex items-center px-4 py-2 border border-amber-500/50 rounded text-amber-500 font-medium uppercase tracking-wide text-sm bg-amber-500/5">
                Disponível na loja física
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location / Info */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MapPin className="w-12 h-12 text-amber-500 mx-auto mb-6" />
          <h2 className="font-display text-4xl font-bold uppercase tracking-wider mb-4">Localização</h2>
          <p className="text-xl text-zinc-400 mb-2">Av. Barão do Rio Branco, 2000 - Centro</p>
          <p className="text-zinc-500">Juiz de Fora - MG</p>
        </div>
      </section>

      {/* Fixed Booking Button */}
      <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <Link 
          to="/agendar" 
          className="flex items-center justify-center gap-2 bg-amber-500 text-zinc-950 px-6 py-4 rounded-full font-bold uppercase tracking-wide shadow-[0_0_30px_-5px_rgba(245,158,11,0.4)] hover:bg-amber-400 hover:scale-105 transition-all"
        >
          <Clock className="w-5 h-5" />
          Agendar Agora
        </Link>
      </div>
    </div>
  );
}
