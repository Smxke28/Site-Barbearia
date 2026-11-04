import { useState, useEffect } from 'react';
import { format, startOfToday } from 'date-fns';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function QueuePage() {
  const { appointments, barbers, services } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = format(startOfToday(), 'yyyy-MM-dd');
  
  // Filter for today's active appointments
  const activeAppointments = appointments
    .filter(app => app.date === todayStr && (app.status === 'scheduled' || app.status === 'in-progress'))
    .sort((a, b) => a.time.localeCompare(b.time));

  const inProgressCount = activeAppointments.filter(app => app.status === 'in-progress').length;
  const waitingCount = activeAppointments.filter(app => app.status === 'scheduled').length;

  return (
    <div className="flex-1 bg-zinc-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase mb-4">
            Fila ao Vivo
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Acompanhe o status do salão em tempo real. Não perca seu tempo esperando na recepção.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-center text-center">
            <span className="text-zinc-500 uppercase text-xs font-bold tracking-wider mb-2">Horário Atual</span>
            <span className="text-3xl font-bold text-zinc-100 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-amber-500" />
              {format(currentTime, 'HH:mm')}
            </span>
          </div>
          <div className="bg-zinc-900 border border-amber-500/30 rounded-lg p-6 flex flex-col items-center text-center">
            <span className="text-amber-500/80 uppercase text-xs font-bold tracking-wider mb-2">Em Atendimento</span>
            <span className="text-4xl font-bold text-amber-500">
              {inProgressCount}
            </span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex flex-col items-center text-center">
            <span className="text-zinc-500 uppercase text-xs font-bold tracking-wider mb-2">Na Fila de Espera</span>
            <span className="text-4xl font-bold text-zinc-100">
              {waitingCount}
            </span>
          </div>
        </div>

        {/* Queue List */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
            <h2 className="font-bold uppercase tracking-wide">Próximos Horários</h2>
          </div>
          
          <div className="divide-y divide-zinc-800/50">
            {activeAppointments.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 flex flex-col items-center">
                <AlertCircle className="w-10 h-10 mb-3 opacity-50" />
                <p>Nenhum agendamento ativo para hoje.</p>
              </div>
            ) : (
              activeAppointments.map((app) => {
                const barber = barbers.find(b => b.id === app.barberId);
                const service = services.find(s => s.id === app.serviceId);
                const isNext = app.status === 'in-progress';
                
                return (
                  <div 
                    key={app.id} 
                    className={`p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isNext ? 'bg-amber-500/5' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800 rounded px-4 py-2 min-w-[80px]">
                        <span className="text-amber-500 font-bold text-lg">{app.time}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-zinc-100 text-lg flex items-center gap-2">
                          {app.customerName}
                          {isNext && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-zinc-950 tracking-wider">Atendendo</span>}
                        </h3>
                        <p className="text-zinc-500 text-sm">
                          {service?.name} • Com {barber?.name}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
