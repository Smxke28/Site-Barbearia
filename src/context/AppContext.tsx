import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Barber, Service, Appointment, AppointmentStatus } from '../types';

const MOCK_SERVICES: Service[] = [
  { id: 's1', name: 'Corte Clássico', category: 'Cabelo', price: 45, durationMinutes: 40, description: 'Corte tradicional na tesoura ou máquina.' },
  { id: 's2', name: 'Barba Terapia', category: 'Barba', price: 35, durationMinutes: 30, description: 'Alinhamento da barba com toalha quente e massagem.' },
  { id: 's3', name: 'Corte + Barba', category: 'Combos', price: 70, durationMinutes: 70, description: 'Combo completo para um visual impecável.' },
  { id: 's4', name: 'Platinado', category: 'Tratamentos Especiais', price: 120, durationMinutes: 120, description: 'Descoloração e platinado completo.' },
  { id: 's5', name: 'Degradê', category: 'Cabelo', price: 50, durationMinutes: 45, description: 'Corte com fade moderno e acabamento perfeito.' },
  { id: 's6', name: 'Pigmentação de Barba', category: 'Barba', price: 40, durationMinutes: 40, description: 'Cobre os fios brancos e realça os contornos.' },
  { id: 's7', name: 'Luzes', category: 'Tratamentos Especiais', price: 90, durationMinutes: 90, description: 'Reflexos para iluminar o visual.' },
  { id: 's8', name: 'Pai e Filho', category: 'Combos', price: 80, durationMinutes: 80, description: 'Corte para você e seu filho com desconto especial.' },
];

const MOCK_BARBERS: Barber[] = [
  { id: 'b1', name: 'Thiago Silva', avatarUrl: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'b2', name: 'Marcelo Costa', avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200' },
  { id: 'b3', name: 'Lucas Mendes', avatarUrl: 'https://images.unsplash.com/photo-1605406575497-015ab0d21b9b?auto=format&fit=crop&q=80&w=200&h=200' },
];

interface AppContextType {
  services: Service[];
  barbers: Barber[];
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = '@barber-saas-demo:appointments';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newAppointment: Appointment = {
      ...data,
      id: crypto.randomUUID(),
      status: 'scheduled',
      createdAt: Date.now(),
    };
    setAppointments((prev) => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  return (
    <AppContext.Provider
      value={{
        services: MOCK_SERVICES,
        barbers: MOCK_BARBERS,
        appointments,
        addAppointment,
        updateAppointmentStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
