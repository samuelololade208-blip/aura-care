export type NavigationTab =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'doctors'
  | 'medical-records'
  | 'billing'
  | 'pharmacy'
  | 'laboratory'
  | 'settings';

export type StaffRole = 'Doctor' | 'Nurse';
export type StaffDutyStatus = 'On Duty' | 'Off Duty' | 'On Call';

export interface StaffMember {
  id: string;
  fullName: string;
  role: StaffRole;
  department: string;
  specialization: string;
  qualification: string;
  phone: string;
  email: string;
  dutyStatus: StaffDutyStatus;
  schedule: string;
  notes?: string;
  createdAt: string;
}

export interface Patient {
  id: string; // e.g. "AC-1001"
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  phone: string;
  email: string;
  address: string;
  emergencyContact: string;
  medicalHistory: string;
  status: 'Active' | 'Under Treatment' | 'Discharged';
  createdAt: string;
}

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctor: string;
  attendingNurse?: string;
  date: string;
  time: string;
  reasonForVisit: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  doctorId?: string;
  doctor: string;
  attendingNurse?: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  followUpDate?: string;
  createdAt: string;
}

export type PaymentStatus = 'Paid' | 'Pending' | 'Partially Paid';

export interface Bill {
  id: string;
  patientId: string;
  patientName: string;
  consultationFee: number;
  treatmentCharges: number;
  laboratoryCharges: number;
  pharmacyCharges: number;
  total: number;
  paymentStatus: PaymentStatus;
  date: string;
  notes?: string;
  createdAt: string;
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Medicine {
  id: string;
  name: string;
  quantity: number;
  price: number;
  stockStatus: StockStatus;
  updatedAt: string;
}

export type LabStatus = 'Pending' | 'In Progress' | 'Completed';

export interface LabRequest {
  id: string;
  patientId: string;
  patientName: string;
  test: string;
  date: string;
  status: LabStatus;
  result: string;
  createdAt: string;
}

export interface HospitalActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  category: 'patient' | 'appointment' | 'record' | 'billing' | 'pharmacy' | 'laboratory' | 'staff';
}
