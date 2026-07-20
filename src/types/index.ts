export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
  description?: string;
}

export interface Barber {
  id: string;
  name: string;
  avatarUrl: string;
}

export type AppointmentStatus = 'scheduled' | 'in-progress' | 'completed' | 'canceled';

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  barberId: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  status: AppointmentStatus;
  createdAt: number;
}
