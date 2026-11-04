import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Calendar as CalendarIcon, Clock, User, CheckCircle2 } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, cn } from '../utils';

export function BookingPage() {
  const navigate = useNavigate();
  const { services, barbers, addAppointment } = useAppContext();

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Generate next 7 days for the date picker
  const dates = Array.from({ length: 7 }).map((_, i) => addDays(startOfToday(), i));
  
  // Mock time slots
  const timeSlots = ['09:00', '09:40', '10:20', '11:00', '11:40', '13:00', '13:40', '14:20', '15:00', '15:40', '16:20', '17:00'];

  const handleNextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s + 1);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId || !selectedBarberId || !selectedDate || !selectedTime || !customerName || !customerPhone) return;

    addAppointment({
      serviceId: selectedServiceId,
      barberId: selectedBarberId,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      customerName,
      customerPhone,
    });

    // Navigate to queue to see position
    navigate('/fila');
  };

  return (
    <div className="flex-1 bg-zinc-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-zinc-900 -z-10 rounded"></div>
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-500 -z-10 rounded transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
            
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors",
                  step >= i ? "bg-amber-500 text-zinc-950" : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                )}
              >
                {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs font-medium text-zinc-500 mt-2 uppercase tracking-wider">
            <span>Serviço</span>
            <span>Profissional</span>
            <span>Horário</span>
            <span>Confirmação</span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sm:p-8">
          
          {/* Step 1: Services */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold uppercase mb-6">1. Escolha o Serviço</h2>
              <div className="grid gap-4">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border text-left transition-all",
                      selectedServiceId === service.id 
                        ? "border-amber-500 bg-amber-500/10" 
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                    )}
                  >
                    <div>
                      <h3 className={cn("font-bold", selectedServiceId === service.id ? "text-amber-500" : "text-zinc-100")}>
                        {service.name}
                      </h3>
                      <p className="text-zinc-500 text-sm mt-1">{service.durationMinutes} min</p>
                    </div>
                    <span className="font-bold">{formatCurrency(service.price)}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleNextStep}
                  disabled={!selectedServiceId}
                  className="px-6 py-3 bg-amber-500 text-zinc-950 font-bold uppercase rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Barbers */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold uppercase mb-6">2. Escolha o Profissional</h2>
              <div className="grid gap-4">
                {barbers.map(barber => (
                  <button
                    key={barber.id}
                    onClick={() => setSelectedBarberId(barber.id)}
                    className={cn(
                      "flex items-center p-4 rounded-lg border text-left transition-all gap-4",
                      selectedBarberId === barber.id 
                        ? "border-amber-500 bg-amber-500/10" 
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                    )}
                  >
                    <img 
                      src={barber.avatarUrl} 
                      alt={barber.name} 
                      className="w-12 h-12 rounded-full object-cover border border-zinc-800"
                    />
                    <div>
                      <h3 className={cn("font-bold text-lg", selectedBarberId === barber.id ? "text-amber-500" : "text-zinc-100")}>
                        {barber.name}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 text-zinc-400 font-bold uppercase rounded hover:text-zinc-100 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedBarberId}
                  className="px-6 py-3 bg-amber-500 text-zinc-950 font-bold uppercase rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold uppercase mb-6">3. Escolha o Horário</h2>
              
              <div className="mb-6">
                <h3 className="flex items-center text-zinc-400 font-bold uppercase text-sm mb-3">
                  <CalendarIcon className="w-4 h-4 mr-2" /> Data
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                  {dates.map((date, i) => {
                    const isSelected = date.getTime() === selectedDate.getTime();
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDate(date);
                          setSelectedTime(null);
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center min-w-[70px] h-20 rounded-lg border transition-all flex-shrink-0",
                          isSelected 
                            ? "border-amber-500 bg-amber-500/10 text-amber-500" 
                            : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700"
                        )}
                      >
                        <span className="text-xs uppercase">{format(date, 'eee', { locale: ptBR })}</span>
                        <span className="text-xl font-bold">{format(date, 'dd')}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="flex items-center text-zinc-400 font-bold uppercase text-sm mb-3">
                  <Clock className="w-4 h-4 mr-2" /> Horários Disponíveis
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "py-3 rounded border font-medium transition-all text-center",
                        selectedTime === time
                          ? "border-amber-500 bg-amber-500 text-zinc-950 font-bold"
                          : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 text-zinc-400 font-bold uppercase rounded hover:text-zinc-100 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!selectedTime}
                  className="px-6 py-3 bg-amber-500 text-zinc-950 font-bold uppercase rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation Form */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold uppercase mb-6">4. Seus Dados</h2>
              
              <div className="mb-6 p-4 rounded bg-zinc-950 border border-zinc-800 flex flex-col gap-2 text-sm text-zinc-300">
                <p><span className="text-zinc-500">Serviço:</span> {services.find(s => s.id === selectedServiceId)?.name}</p>
                <p><span className="text-zinc-500">Barbeiro:</span> {barbers.find(b => b.id === selectedBarberId)?.name}</p>
                <p><span className="text-zinc-500">Data:</span> {format(selectedDate, 'dd/MM/yyyy')} às {selectedTime}</p>
              </div>

              <form onSubmit={handleConfirm} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-zinc-400 mb-1">Nome Completo</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      id="name"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded px-10 py-3 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-zinc-400 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-3 text-zinc-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <div className="mt-8 flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-3 text-zinc-400 font-bold uppercase rounded hover:text-zinc-100 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={!customerName || !customerPhone}
                    className="px-6 py-3 bg-amber-500 text-zinc-950 font-bold uppercase rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400 transition-colors"
                  >
                    Confirmar Agendamento
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
