import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  Appointment,
  MedicalRecord,
  Bill,
  Medicine,
  LabRequest,
  HospitalActivity,
  NavigationTab,
  StaffMember,
  StaffRole,
  StaffDutyStatus,
} from '../types';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'DOC-101',
    fullName: 'Doctor James Smith',
    role: 'Doctor',
    department: 'General Medicine & Inpatient Care',
    specialization: 'Chief Medical Officer & General Physician',
    qualification: 'MD, FACP',
    phone: '+1 (555) 234-5678',
    email: 'dr.jsmith@auracare.hospital',
    dutyStatus: 'On Duty',
    schedule: 'Mon – Fri: 08:30 AM – 05:00 PM',
    notes: 'Lead clinician presiding over outpatient care, diagnostic reviews, clinical prescriptions, and patient management at Aura Care.',
    createdAt: '2026-01-15T08:00:00.000Z',
  },
];

interface HospitalContextType {
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Doctor & Hospital constants
  hospitalName: string;
  doctorName: 'Doctor James Smith';

  // Staff & Clinicians
  staff: StaffMember[];
  doctors: StaffMember[];
  nurses: StaffMember[];

  // Data
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  bills: Bill[];
  medicines: Medicine[];
  labRequests: LabRequest[];
  activities: HospitalActivity[];

  // Actions
  addStaffMember: (member: Omit<StaffMember, 'id' | 'createdAt'>) => StaffMember;
  updateStaffMember: (id: string, updates: Partial<Omit<StaffMember, 'id' | 'createdAt'>>) => void;
  updateStaffDutyStatus: (id: string, dutyStatus: StaffDutyStatus) => void;
  deleteStaffMember: (id: string) => void;

  addPatient: (patient: Omit<Patient, 'id' | 'createdAt'>) => Patient;
  updatePatientStatus: (id: string, status: Patient['status']) => void;
  deletePatient: (id: string) => void;

  addAppointment: (
    appointment: Omit<Appointment, 'id' | 'createdAt' | 'doctor'> & { doctor?: string }
  ) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  cancelAppointment: (id: string) => void;

  addMedicalRecord: (
    record: Omit<MedicalRecord, 'id' | 'createdAt' | 'doctor'> & { doctor?: string }
  ) => MedicalRecord;

  addBill: (bill: Omit<Bill, 'id' | 'total' | 'createdAt'>) => Bill;
  updateBillStatus: (id: string, status: Bill['paymentStatus']) => void;

  addMedicine: (medicine: Omit<Medicine, 'id' | 'updatedAt'>) => Medicine;
  updateMedicineStock: (id: string, quantity: number, stockStatus: Medicine['stockStatus']) => void;

  addLabRequest: (req: Omit<LabRequest, 'id' | 'createdAt'>) => LabRequest;
  updateLabRequestStatus: (id: string, status: LabRequest['status'], result?: string) => void;

  clearAllData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STAFF: 'auracare_staff',
  PATIENTS: 'auracare_patients',
  APPOINTMENTS: 'auracare_appointments',
  RECORDS: 'auracare_medical_records',
  BILLS: 'auracare_bills',
  MEDICINES: 'auracare_medicines',
  LABS: 'auracare_lab_requests',
  ACTIVITIES: 'auracare_activities',
  THEME: 'auracare_theme',
};

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  const hospitalName = 'Aura Care';
  const doctorName = 'Doctor James Smith' as const;

  // Staff members (Doctors and Nurses)
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // Initialize strictly from localStorage or empty arrays
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDICINES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [labRequests, setLabRequests] = useState<LabRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LABS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activities, setActivities] = useState<HospitalActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(medicalRecords));
  }, [medicalRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICINES, JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LABS, JSON.stringify(labRequests));
  }, [labRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark' | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const logActivity = (
    title: string,
    description: string,
    category: HospitalActivity['category']
  ) => {
    const newActivity: HospitalActivity = {
      id: 'ACT-' + Date.now(),
      title,
      description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category,
    };
    setActivities((prev) => [newActivity, ...prev].slice(0, 20));
  };

  const doctors = staff.filter((s) => s.role === 'Doctor');
  const nurses = staff.filter((s) => s.role === 'Nurse');

  // Staff Actions
  const addStaffMember = (memberData: Omit<StaffMember, 'id' | 'createdAt'>): StaffMember => {
    const prefix = memberData.role === 'Doctor' ? 'DOC' : 'NUR';
    const count = staff.filter((s) => s.role === memberData.role).length;
    const newId = `${prefix}-${100 + count + 1}`;
    const newStaff: StaffMember = {
      ...memberData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setStaff((prev) => [newStaff, ...prev]);
    logActivity(
      `${newStaff.role} Added`,
      `${newStaff.fullName} (${newStaff.department})`,
      'staff'
    );
    return newStaff;
  };

  const updateStaffMember = (
    id: string,
    updates: Partial<Omit<StaffMember, 'id' | 'createdAt'>>
  ) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    const existing = staff.find((s) => s.id === id);
    if (existing) {
      logActivity('Staff Updated', `${existing.fullName} profile modified`, 'staff');
    }
  };

  const updateStaffDutyStatus = (id: string, dutyStatus: StaffDutyStatus) => {
    setStaff((prev) =>
      prev.map((s) => (s.id === id ? { ...s, dutyStatus } : s))
    );
    const existing = staff.find((s) => s.id === id);
    if (existing) {
      logActivity('Duty Status Changed', `${existing.fullName} is now ${dutyStatus}`, 'staff');
    }
  };

  const deleteStaffMember = (id: string) => {
    const member = staff.find((s) => s.id === id);
    setStaff((prev) => prev.filter((s) => s.id !== id));
    if (member) {
      logActivity('Staff Removed', `${member.fullName} (${member.role})`, 'staff');
    }
  };

  // Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt'>): Patient => {
    const newId = `AC-${1000 + patients.length + 1}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    setPatients((prev) => [newPatient, ...prev]);
    logActivity('Patient Registered', `${newPatient.fullName} (${newId})`, 'patient');
    return newPatient;
  };

  const updatePatientStatus = (id: string, status: Patient['status']) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status } : p))
    );
  };

  const deletePatient = (id: string) => {
    const patient = patients.find((p) => p.id === id);
    setPatients((prev) => prev.filter((p) => p.id !== id));
    if (patient) {
      logActivity('Patient Removed', `${patient.fullName} (${patient.id})`, 'patient');
    }
  };

  const addAppointment = (
    data: Omit<Appointment, 'id' | 'createdAt' | 'doctor'> & { doctor?: string }
  ): Appointment => {
    const assignedDoctor = data.doctor?.trim() || doctorName;
    const newAppointment: Appointment = {
      ...data,
      doctor: assignedDoctor,
      id: `APT-${100 + appointments.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newAppointment, ...prev]);
    logActivity(
      'Appointment Booked',
      `${newAppointment.patientName} with ${assignedDoctor} on ${newAppointment.date}`,
      'appointment'
    );
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const cancelAppointment = (id: string) => {
    updateAppointmentStatus(id, 'Cancelled');
    const apt = appointments.find((a) => a.id === id);
    if (apt) {
      logActivity('Appointment Cancelled', `${apt.patientName} (${apt.date})`, 'appointment');
    }
  };

  const addMedicalRecord = (
    data: Omit<MedicalRecord, 'id' | 'createdAt' | 'doctor'> & { doctor?: string }
  ): MedicalRecord => {
    const assignedDoctor = data.doctor?.trim() || doctorName;
    const newRecord: MedicalRecord = {
      ...data,
      doctor: assignedDoctor,
      id: `MR-${500 + medicalRecords.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);
    logActivity(
      'Medical Record Created',
      `Diagnosis recorded for ${newRecord.patientName} by ${assignedDoctor}`,
      'record'
    );
    return newRecord;
  };

  const addBill = (data: Omit<Bill, 'id' | 'total' | 'createdAt'>): Bill => {
    const total =
      Number(data.consultationFee || 0) +
      Number(data.treatmentCharges || 0) +
      Number(data.laboratoryCharges || 0) +
      Number(data.pharmacyCharges || 0);

    const newBill: Bill = {
      ...data,
      total,
      id: `INV-${200 + bills.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setBills((prev) => [newBill, ...prev]);
    logActivity(
      'Invoice Generated',
      `${newBill.id} for ${newBill.patientName} - $${total.toFixed(2)} (${newBill.paymentStatus})`,
      'billing'
    );
    return newBill;
  };

  const updateBillStatus = (id: string, paymentStatus: Bill['paymentStatus']) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paymentStatus } : b))
    );
  };

  const addMedicine = (data: Omit<Medicine, 'id' | 'updatedAt'>): Medicine => {
    const newMed: Medicine = {
      ...data,
      id: `MED-${300 + medicines.length + 1}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setMedicines((prev) => [newMed, ...prev]);
    logActivity('Medicine Added', `${newMed.name} (${newMed.quantity} units)`, 'pharmacy');
    return newMed;
  };

  const updateMedicineStock = (
    id: string,
    quantity: number,
    stockStatus: Medicine['stockStatus']
  ) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              quantity,
              stockStatus,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : m
      )
    );
    const med = medicines.find((m) => m.id === id);
    if (med) {
      logActivity('Stock Updated', `${med.name}: ${quantity} units (${stockStatus})`, 'pharmacy');
    }
  };

  const addLabRequest = (data: Omit<LabRequest, 'id' | 'createdAt'>): LabRequest => {
    const newLab: LabRequest = {
      ...data,
      id: `LAB-${400 + labRequests.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setLabRequests((prev) => [newLab, ...prev]);
    logActivity(
      'Lab Request Created',
      `${newLab.test} for ${newLab.patientName}`,
      'laboratory'
    );
    return newLab;
  };

  const updateLabRequestStatus = (
    id: string,
    status: LabRequest['status'],
    result?: string
  ) => {
    setLabRequests((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              result: result !== undefined ? result : l.result,
            }
          : l
      )
    );
  };

  const clearAllData = () => {
    setPatients([]);
    setAppointments([]);
    setMedicalRecords([]);
    setBills([]);
    setMedicines([]);
    setLabRequests([]);
    setActivities([]);
    setStaff(INITIAL_STAFF);
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.BILLS);
    localStorage.removeItem(STORAGE_KEYS.MEDICINES);
    localStorage.removeItem(STORAGE_KEYS.LABS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(INITIAL_STAFF));
  };

  return (
    <HospitalContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        toggleTheme,
        hospitalName,
        doctorName,
        staff,
        doctors,
        nurses,
        addStaffMember,
        updateStaffMember,
        updateStaffDutyStatus,
        deleteStaffMember,
        patients,
        appointments,
        medicalRecords,
        bills,
        medicines,
        labRequests,
        activities,
        addPatient,
        updatePatientStatus,
        deletePatient,
        addAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        addMedicalRecord,
        addBill,
        updateBillStatus,
        addMedicine,
        updateMedicineStock,
        addLabRequest,
        updateLabRequestStatus,
        clearAllData,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
