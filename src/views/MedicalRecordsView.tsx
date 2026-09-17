import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Stethoscope,
  Pill,
  User,
  X,
  Eye,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { MedicalRecord } from '../types';
import { EmptyState } from '../components/EmptyState';

export const MedicalRecordsView: React.FC = () => {
  const {
    medicalRecords,
    patients,
    doctors,
    nurses,
    addMedicalRecord,
    doctorName,
    setActiveTab,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    doctor: doctors[0]?.fullName || doctorName,
    attendingNurse: '',
    date: new Date().toISOString().split('T')[0],
    symptoms: '',
    diagnosis: '',
    treatment: '',
    prescription: '',
    followUpDate: '',
  });

  const handleOpenAddModal = () => {
    setFormData((prev) => ({
      ...prev,
      patientId: patients.length > 0 ? patients[0].id : '',
      doctor: doctors.find((d) => d.dutyStatus === 'On Duty')?.fullName || doctors[0]?.fullName || doctorName,
      attendingNurse: '',
    }));
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({
      patientId: patients.length > 0 ? patients[0].id : '',
      doctor: doctors[0]?.fullName || doctorName,
      attendingNurse: '',
      date: new Date().toISOString().split('T')[0],
      symptoms: '',
      diagnosis: '',
      treatment: '',
      prescription: '',
      followUpDate: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.diagnosis.trim()) return;

    const patient = patients.find((p) => p.id === formData.patientId);
    if (!patient) return;

    addMedicalRecord({
      patientId: patient.id,
      patientName: patient.fullName,
      doctor: formData.doctor || doctorName,
      attendingNurse: formData.attendingNurse || undefined,
      date: formData.date,
      symptoms: formData.symptoms.trim(),
      diagnosis: formData.diagnosis.trim(),
      treatment: formData.treatment.trim(),
      prescription: formData.prescription.trim(),
      followUpDate: formData.followUpDate || undefined,
    });

    handleCloseAddModal();
  };

  const filteredRecords = medicalRecords.filter((rec) => {
    const q = searchQuery.toLowerCase();
    return (
      rec.patientName.toLowerCase().includes(q) ||
      rec.patientId.toLowerCase().includes(q) ||
      rec.diagnosis.toLowerCase().includes(q) ||
      rec.symptoms.toLowerCase().includes(q) ||
      rec.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
            Medical Records
          </h2>
          <p className="text-sm text-purple-900/60 dark:text-purple-300/60 mt-1">
            Clinical diagnoses, symptoms, treatments, and prescriptions
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Medical Record</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="liquid-glass rounded-2xl p-2 sm:p-2.5 flex items-center gap-3">
        <Search className="w-5 h-5 text-purple-600 dark:text-purple-300 ml-2 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search records by patient name, ID, diagnosis, or symptoms..."
          className="w-full bg-transparent text-purple-950 dark:text-purple-100 placeholder-purple-900/40 dark:placeholder-purple-300/40 text-sm focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1 rounded-full text-purple-600 hover:bg-purple-100/50 mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Content */}
      {medicalRecords.length === 0 ? (
        <EmptyState
          title="No medical records available."
          description="There are currently no clinical records stored in Aura Care. Add a record for a patient to begin documentation."
          icon={FileText}
          actionText="+ Add Medical Record"
          onAction={handleOpenAddModal}
        />
      ) : filteredRecords.length === 0 ? (
        <div className="liquid-glass rounded-[24px] p-8 text-center">
          <p className="text-base font-semibold text-purple-950 dark:text-purple-100">
            No medical records match "{searchQuery}"
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100/60"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="liquid-glass rounded-[24px] p-5 flex flex-col justify-between transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono font-semibold text-purple-700 dark:text-purple-400">
                    {rec.id}
                  </span>
                  <span className="text-xs text-purple-900/60 dark:text-purple-300/60 font-medium">
                    {rec.date}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-purple-950 dark:text-purple-100 leading-none">
                      {rec.patientName}
                    </h4>
                    <span className="text-[10px] font-mono text-purple-900/50 dark:text-purple-300/50">
                      {rec.patientId}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100/70 dark:border-purple-800/40">
                    <span className="text-[10px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase block">
                      Diagnosis
                    </span>
                    <span className="font-semibold text-purple-950 dark:text-purple-100 text-sm">
                      {rec.diagnosis}
                    </span>
                  </div>

                  {rec.symptoms && (
                    <p className="text-purple-900/70 dark:text-purple-300/70">
                      <strong className="text-purple-950 dark:text-purple-200">Symptoms: </strong>
                      {rec.symptoms}
                    </p>
                  )}

                  {rec.prescription && (
                    <div className="flex items-start gap-1.5 text-purple-900/80 dark:text-purple-300/80">
                      <Pill className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Prescription:</strong> {rec.prescription}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-purple-100/70 dark:border-purple-800/30 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-purple-900/60 dark:text-purple-300/60 block">
                    Doctor: <strong className="text-purple-900 dark:text-purple-200">{rec.doctor}</strong>
                  </span>
                  {rec.attendingNurse && (
                    <span className="text-[11px] text-purple-700 dark:text-purple-300 block">
                      Nurse: {rec.attendingNurse}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedRecord(rec)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-100/60 dark:bg-purple-900/40 hover:bg-purple-200/60 transition-colors inline-flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Medical Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-xl liquid-glass-elevated rounded-[28px] p-6 sm:p-7 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-100 dark:border-purple-800/40">
              <div>
                <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100">
                  Add Medical Record
                </h3>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-0.5">
                  Record consultation notes, diagnosis & prescriptions
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="p-1.5 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {patients.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm font-semibold text-purple-950 dark:text-purple-100">
                  No patients registered yet.
                </p>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-1 max-w-xs mx-auto">
                  Please register a patient first to attach medical records.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseAddModal();
                    setActiveTab('patients');
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-purple-600 text-white font-medium text-xs"
                >
                  Go to Patients
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Patient Selection */}
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Patient <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40 bg-white/80 dark:bg-purple-950/80"
                  >
                    <option value="" disabled>
                      Select patient
                    </option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Doctor */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Attending Physician <span className="text-rose-500">*</span>
                    </label>
                    <select
                      required
                      value={formData.doctor}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40 bg-white/80 dark:bg-purple-950/80"
                    >
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.fullName}>
                          {doc.fullName} ({doc.specialization})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Optional Assisting Nurse */}
                {nurses.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Assisting Nurse (Optional)
                    </label>
                    <select
                      value={formData.attendingNurse}
                      onChange={(e) => setFormData({ ...formData, attendingNurse: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40 bg-white/80 dark:bg-purple-950/80"
                    >
                      <option value="">None / Unassigned</option>
                      {nurses.map((nur) => (
                        <option key={nur.id} value={nur.fullName}>
                          {nur.fullName} ({nur.specialization})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Symptoms / Complaint */}
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Symptoms / Complaint
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Patient complaints, duration, severity..."
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                  />
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Diagnosis <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acute Pharyngitis, Type 2 Diabetes review..."
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                  />
                </div>

                {/* Treatment / Notes */}
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Treatment / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Clinical procedure, therapy instructions, dietary advice..."
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                  />
                </div>

                {/* Prescription & Follow-up Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Prescription
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Amoxicillin 500mg TID x 7d"
                      value={formData.prescription}
                      onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Follow-up Date
                    </label>
                    <input
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 dark:border-purple-800/40">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="px-4 py-2 rounded-full liquid-glass hover:bg-purple-100/50 text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)]"
                  >
                    Save Medical Record
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-lg liquid-glass-elevated rounded-[28px] p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100 dark:border-purple-800/40">
              <div>
                <span className="text-[11px] font-mono text-purple-700 dark:text-purple-400 block font-semibold">
                  {selectedRecord.id} • {selectedRecord.date}
                </span>
                <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100 mt-0.5">
                  Clinical Consultation Note
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4 text-xs">
              <div className="p-3 rounded-2xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-purple-900/60 dark:text-purple-300/60 uppercase font-bold block">
                    Patient
                  </span>
                  <span className="font-bold text-sm text-purple-950 dark:text-purple-100">
                    {selectedRecord.patientName}
                  </span>
                  <span className="text-[11px] font-mono text-purple-700 dark:text-purple-400 block">
                    {selectedRecord.patientId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-purple-900/60 dark:text-purple-300/60 uppercase font-bold block">
                    Attending Physician
                  </span>
                  <span className="font-bold text-sm text-purple-950 dark:text-purple-100">
                    {selectedRecord.doctor}
                  </span>
                  {selectedRecord.attendingNurse && (
                    <span className="text-xs text-purple-700 dark:text-purple-300 block font-medium mt-0.5">
                      Nurse: {selectedRecord.attendingNurse}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase block mb-1">
                  Diagnosis
                </span>
                <div className="p-3 rounded-xl liquid-glass text-sm font-semibold text-purple-950 dark:text-purple-100">
                  {selectedRecord.diagnosis}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase block mb-1">
                  Symptoms & Complaints
                </span>
                <div className="p-3 rounded-xl liquid-glass">
                  {selectedRecord.symptoms || 'None recorded'}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase block mb-1">
                  Treatment / Clinical Notes
                </span>
                <div className="p-3 rounded-xl liquid-glass">
                  {selectedRecord.treatment || 'Standard clinical observation'}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase block mb-1">
                  Prescription
                </span>
                <div className="p-3 rounded-xl liquid-glass">
                  {selectedRecord.prescription || 'No medications prescribed'}
                </div>
              </div>

              {selectedRecord.followUpDate && (
                <div>
                  <span className="text-[10px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase block mb-1">
                    Scheduled Follow-up
                  </span>
                  <div className="p-3 rounded-xl liquid-glass font-medium">
                    {selectedRecord.followUpDate}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-purple-100 dark:border-purple-800/40 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-full bg-purple-600 text-white font-semibold text-xs hover:bg-purple-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
