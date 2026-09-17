import React, { useState } from 'react';
import {
  Plus,
  Search,
  Users,
  Eye,
  Trash2,
  Calendar,
  CreditCard,
  FileText,
  X,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  User,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Patient } from '../types';
import { EmptyState } from '../components/EmptyState';

export const PatientsView: React.FC = () => {
  const {
    patients,
    addPatient,
    deletePatient,
    updatePatientStatus,
    setActiveTab,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Male' as Patient['gender'],
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    status: 'Active' as Patient['status'],
  });

  const resetForm = () => {
    setFormData({
      fullName: '',
      dateOfBirth: '',
      gender: 'Male',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
      status: 'Active',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    addPatient({
      fullName: formData.fullName.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: formData.address.trim(),
      emergencyContact: formData.emergencyContact.trim(),
      medicalHistory: formData.medicalHistory.trim(),
      status: formData.status,
    });

    handleCloseAddModal();
  };

  const filteredPatients = patients.filter((patient) => {
    const q = searchQuery.toLowerCase();
    return (
      patient.fullName.toLowerCase().includes(q) ||
      patient.id.toLowerCase().includes(q) ||
      patient.phone.toLowerCase().includes(q) ||
      patient.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
            Patients
          </h2>
          <p className="text-sm text-purple-900/60 dark:text-purple-300/60 mt-1">
            Registered patient directory and health profiles
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="liquid-glass rounded-2xl p-2 sm:p-2.5 flex items-center gap-3">
        <Search className="w-5 h-5 text-purple-600 dark:text-purple-300 ml-2 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patients by name, ID, phone, or email..."
          className="w-full bg-transparent text-purple-950 dark:text-purple-100 placeholder-purple-900/40 dark:placeholder-purple-300/40 text-sm focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full text-purple-600 dark:text-purple-400 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      {patients.length === 0 ? (
        <EmptyState
          title="No patients registered yet."
          description="Use the Add Patient button to register a new patient in Aura Care Hospital Management System."
          icon={Users}
          actionText="+ Add Patient"
          onAction={handleOpenAddModal}
        />
      ) : filteredPatients.length === 0 ? (
        <div className="liquid-glass rounded-[24px] p-8 text-center">
          <p className="text-base font-semibold text-purple-950 dark:text-purple-100">
            No patients match "{searchQuery}"
          </p>
          <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-1">
            Try adjusting your search criteria or clear the query.
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-800/40"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Patient Table (Desktop) / Cards (Mobile) */
        <div className="liquid-glass rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-100/80 dark:border-purple-800/40 text-[11px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase tracking-wider bg-purple-50/40 dark:bg-purple-950/20">
                  <th className="py-3.5 px-4 sm:px-6">Patient ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Full Name</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden sm:table-cell">Date of Birth</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell">Gender</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden lg:table-cell">Phone</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60 dark:divide-purple-800/30 text-sm">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-purple-50/60 dark:hover:bg-purple-900/20 transition-colors group"
                  >
                    <td className="py-4 px-4 sm:px-6 font-mono text-xs font-semibold text-purple-700 dark:text-purple-300">
                      {patient.id}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-purple-950 dark:text-purple-100">
                        {patient.fullName}
                      </div>
                      <div className="text-xs text-purple-900/50 dark:text-purple-300/50 sm:hidden">
                        {patient.gender} • {patient.phone || 'No phone'}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs text-purple-900/70 dark:text-purple-300/70 hidden sm:table-cell">
                      {patient.dateOfBirth || '—'}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs text-purple-900/70 dark:text-purple-300/70 hidden md:table-cell">
                      {patient.gender}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs text-purple-900/70 dark:text-purple-300/70 hidden lg:table-cell font-mono">
                      {patient.phone || '—'}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                          patient.status === 'Active'
                            ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : patient.status === 'Under Treatment'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300'
                        }`}
                      >
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedPatient(patient)}
                          className="p-1.5 rounded-xl text-purple-700 dark:text-purple-300 hover:bg-purple-100/80 dark:hover:bg-purple-800/40 transition-colors"
                          title="View patient profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePatient(patient.id)}
                          className="p-1.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Remove patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-xl liquid-glass-elevated rounded-[28px] p-6 sm:p-7 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-purple-100 dark:border-purple-800/40">
              <div>
                <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100">
                  Add Patient
                </h3>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-0.5">
                  Register a new patient into Aura Care
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="p-2 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-800/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                />
              </div>

              {/* Date of Birth & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value as Patient['gender'] })
                    }
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40 bg-white/80 dark:bg-purple-950/80"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Phone Number & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +1 (555) 019-2834"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Street, City, State/ZIP"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="text"
                  placeholder="Emergency contact name & phone"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                />
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Medical History
                </label>
                <textarea
                  rows={2}
                  placeholder="Allergies, chronic conditions, prior surgeries..."
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                />
              </div>

              {/* Buttons: Save Patient, Cancel */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 dark:border-purple-800/40">
                <button
                  type="button"
                  onClick={handleCloseAddModal}
                  className="px-5 py-2.5 rounded-full liquid-glass hover:bg-purple-100/50 dark:hover:bg-purple-800/30 text-sm font-medium text-purple-900 dark:text-purple-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98]"
                >
                  Save Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-lg liquid-glass-elevated rounded-[28px] p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100 dark:border-purple-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100">
                    {selectedPatient.fullName}
                  </h3>
                  <p className="text-xs font-mono text-purple-700 dark:text-purple-400">
                    {selectedPatient.id} • {selectedPatient.status}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-800/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-3.5 text-xs text-purple-950 dark:text-purple-100">
              <div className="grid grid-cols-2 gap-2 bg-purple-50/50 dark:bg-purple-950/30 p-3.5 rounded-2xl border border-purple-100/70 dark:border-purple-800/30">
                <div>
                  <span className="text-[10px] text-purple-900/60 dark:text-purple-300/60 block uppercase font-bold">
                    Date of Birth
                  </span>
                  <span className="font-semibold">{selectedPatient.dateOfBirth || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-purple-900/60 dark:text-purple-300/60 block uppercase font-bold">
                    Gender
                  </span>
                  <span className="font-semibold">{selectedPatient.gender}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-purple-900/60 dark:text-purple-300/60 block uppercase font-bold">
                    Phone
                  </span>
                  <span className="font-semibold">{selectedPatient.phone || '—'}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-purple-900/60 dark:text-purple-300/60 block uppercase font-bold">
                    Email
                  </span>
                  <span className="font-semibold">{selectedPatient.email || '—'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-purple-900/60 dark:text-purple-300/60 block uppercase font-bold mb-1">
                  Address
                </span>
                <p className="p-3 rounded-xl liquid-glass text-xs">
                  {selectedPatient.address || 'No registered address'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-purple-900/60 dark:text-purple-300/60 block uppercase font-bold mb-1">
                  Emergency Contact
                </span>
                <p className="p-3 rounded-xl liquid-glass text-xs">
                  {selectedPatient.emergencyContact || 'None recorded'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-purple-900/60 dark:text-purple-300/60 block uppercase font-bold mb-1">
                  Medical History
                </span>
                <p className="p-3 rounded-xl liquid-glass text-xs">
                  {selectedPatient.medicalHistory || 'No prior medical history noted.'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-100 dark:border-purple-800/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const newStatus =
                    selectedPatient.status === 'Active'
                      ? 'Under Treatment'
                      : selectedPatient.status === 'Under Treatment'
                      ? 'Discharged'
                      : 'Active';
                  updatePatientStatus(selectedPatient.id, newStatus);
                  setSelectedPatient({ ...selectedPatient, status: newStatus });
                }}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200"
              >
                Change Status ({selectedPatient.status})
              </button>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2 rounded-full bg-purple-600 text-white font-medium text-xs hover:bg-purple-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
