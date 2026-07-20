import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, CheckCircle, XCircle, Play, MoreVertical } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { cn } from '../utils';
import type { AppointmentStatus } from '../types';

export function AdminPage() {
  const { appointments, barbers, services, updateAppointmentStatus } = useAppContext();
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const filteredAppointments = appointments
    .filter(app => app.date === filterDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled': return 'text-zinc-400 bg-zinc-800/50';
      case 'in-progress': return 'text-amber-500 bg-amber-500/10 border border-amber-500/20';
      case 'completed': return 'text-emerald-500 bg-emerald-500/10';
      case 'canceled': return 'text-red-500 bg-red-500/10';
      default: return 'text-zinc-500';
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case 'scheduled': return 'Agendado';
      case 'in-progress': return 'Atendendo';
      case 'completed': return 'Concluído';
      case 'canceled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="flex-1 bg-zinc-950 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight uppercase">Painel do Dono</h1>
            <p className="text-zinc-400">Gerencie os agendamentos da barbearia</p>
          </div>
          
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded px-3 py-2">
            <Calendar className="w-5 h-5 text-zinc-400 mr-2" />
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent text-zinc-100 focus:outline-none uppercase text-sm font-bold tracking-wide"
            />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-6 py-4 font-bold">Horário</th>
                  <th className="px-6 py-4 font-bold">Cliente</th>
                  <th className="px-6 py-4 font-bold">Serviço</th>
                  <th className="px-6 py-4 font-bold">Profissional</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      Nenhum agendamento para esta data.
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((app) => {
                    const barber = barbers.find(b => b.id === app.barberId);
                    const service = services.find(s => s.id === app.serviceId);
                    
                    return (
                      <tr key={app.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-bold text-amber-500">{app.time}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-zinc-100">{app.customerName}</div>
                          <div className="text-xs text-zinc-500">{app.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-zinc-300">
                          {service?.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {barber && (
                              <img src={barber.avatarUrl} alt={barber.name} className="w-6 h-6 rounded-full" />
                            )}
                            <span className="text-zinc-300">{barber?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={cn("px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider", getStatusColor(app.status))}>
                            {getStatusLabel(app.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {app.status === 'scheduled' && (
                              <button 
                                onClick={() => updateAppointmentStatus(app.id, 'in-progress')}
                                className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-colors"
                                title="Iniciar Atendimento"
                              >
                                <Play className="w-5 h-5" />
                              </button>
                            )}
                            {(app.status === 'scheduled' || app.status === 'in-progress') && (
                              <button 
                                onClick={() => updateAppointmentStatus(app.id, 'completed')}
                                className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded transition-colors"
                                title="Concluir"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                            )}
                            {(app.status === 'scheduled') && (
                              <button 
                                onClick={() => updateAppointmentStatus(app.id, 'canceled')}
                                className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                title="Cancelar"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            )}
                            <button className="p-1.5 text-zinc-500 hover:text-zinc-300">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
