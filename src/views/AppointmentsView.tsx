import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Stethoscope,
  Filter,
  HeartPulse,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { AppointmentStatus } from '../types';
import { EmptyState } from '../components/EmptyState';

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    patients,
    doctors,
    nurses,
    addAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    doctorName,
    setActiveTab,
  } = useHospital();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    doctor: doctors[0]?.fullName || doctorName,
    attendingNurse: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reasonForVisit: '',
    status: 'Scheduled' as AppointmentStatus,
  });

  const handleOpenBookModal = () => {
    setFormData((prev) => ({
      ...prev,
      patientId: patients.length > 0 ? patients[0].id : '',
      doctor: doctors.find((d) => d.dutyStatus === 'On Duty')?.fullName || doctors[0]?.fullName || doctorName,
    }));
    setIsBookModalOpen(true);
  };

  const handleCloseBookModal = () => {
    setIsBookModalOpen(false);
    setFormData({
      patientId: patients.length > 0 ? patients[0].id : '',
      doctor: doctors[0]?.fullName || doctorName,
      attendingNurse: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM',
      reasonForVisit: '',
      status: 'Scheduled',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId) return;

    const selectedPatient = patients.find((p) => p.id === formData.patientId);
    if (!selectedPatient) return;

    addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      doctor: formData.doctor || doctorName,
      attendingNurse: formData.attendingNurse || undefined,
      date: formData.date,
      time: formData.time,
      reasonForVisit: formData.reasonForVisit.trim() || 'General Consultation',
      status: formData.status,
    });

    handleCloseBookModal();
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus !== 'all' && apt.status.toLowerCase() !== filterStatus.toLowerCase()) {
      return false;
    }
    if (doctorFilter !== 'all' && apt.doctor !== doctorFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
            Appointments
          </h2>
          <p className="text-sm text-purple-900/60 dark:text-purple-300/60 mt-1">
            Clinical consultations and scheduled visits with Aura Care physicians
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenBookModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Book Appointment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      {appointments.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['all', 'Scheduled', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  filterStatus.toLowerCase() === status.toLowerCase()
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'liquid-glass text-purple-900 dark:text-purple-200 hover:bg-purple-100/50'
                }`}
              >
                {status === 'all' ? 'All Appointments' : status}
              </button>
            ))}
          </div>

          {doctors.length > 1 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-purple-900/60 dark:text-purple-300/60 font-medium">Physician:</span>
              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl liquid-glass text-xs text-purple-950 dark:text-purple-100 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none cursor-pointer"
              >
                <option value="all">All Doctors</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.fullName}>
                    {d.fullName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {appointments.length === 0 ? (
        <EmptyState
          title="No appointments scheduled."
          description="There are currently no visits booked. Click below to schedule an appointment with a physician."
          icon={CalendarIcon}
          actionText="+ Book Appointment"
          onAction={handleOpenBookModal}
        />
      ) : filteredAppointments.length === 0 ? (
        <div className="liquid-glass rounded-[24px] p-8 text-center">
          <p className="text-base font-semibold text-purple-950 dark:text-purple-100">
            No {filterStatus} appointments found.
          </p>
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-800/40"
          >
            Show All Appointments
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="liquid-glass rounded-[24px] p-5 flex flex-col justify-between transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-semibold text-purple-700 dark:text-purple-400">
                    {apt.id}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      apt.status === 'Completed'
                        ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                        : apt.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-purple-950 dark:text-purple-100 leading-tight">
                  {apt.patientName}
                </h3>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-1">
                  Reason: <span className="font-medium text-purple-900 dark:text-purple-200">{apt.reasonForVisit}</span>
                </p>

                <div className="mt-4 pt-3 border-t border-purple-100/70 dark:border-purple-800/30 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-purple-900/80 dark:text-purple-200">
                    <CalendarIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{apt.date}</span>
                    <span className="text-purple-400">•</span>
                    <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>{apt.time}</span>
                  </div>

                  <div className="flex items-center gap-2 text-purple-900/80 dark:text-purple-200">
                    <Stethoscope className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="font-medium">{apt.doctor}</span>
                  </div>

                  {apt.attendingNurse && (
                    <div className="flex items-center gap-2 text-purple-900/80 dark:text-purple-200">
                      <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                      <span>Nurse: {apt.attendingNurse}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="mt-5 pt-3 border-t border-purple-100/70 dark:border-purple-800/30 flex items-center justify-end gap-2">
                {apt.status === 'Scheduled' && (
                  <>
                    <button
                      type="button"
                      onClick={() => cancelAppointment(apt.id)}
                      className="px-3 py-1 rounded-full text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                      className="px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                    >
                      Complete
                    </button>
                  </>
                )}
                {apt.status === 'Cancelled' && (
                  <button
                    type="button"
                    onClick={() => updateAppointmentStatus(apt.id, 'Scheduled')}
                    className="px-3 py-1 rounded-full text-xs font-medium text-purple-700 dark:text-purple-300 hover:bg-purple-100/50"
                  >
                    Reopen
                  </button>
                )}
                {apt.status === 'Completed' && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Visit Finished
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-md liquid-glass-elevated rounded-[28px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-100 dark:border-purple-800/40">
              <div>
                <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100">
                  Book Appointment
                </h3>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-0.5">
                  Schedule visit with {doctorName}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseBookModal}
                className="p-1.5 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-800/40"
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
                  You must register at least one patient before booking an appointment.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseBookModal();
                    setActiveTab('patients');
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs shadow-sm"
                >
                  Go to Patients & Add First Patient
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
                      Select a patient
                    </option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Attending Physician Selection */}
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
                        {doc.fullName} — {doc.specialization} ({doc.dutyStatus})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assisting Nurse Selection (Optional) */}
                {nurses.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Assisting Clinical Nurse (Optional)
                    </label>
                    <select
                      value={formData.attendingNurse}
                      onChange={(e) => setFormData({ ...formData, attendingNurse: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40 bg-white/80 dark:bg-purple-950/80"
                    >
                      <option value="">None / Unassigned</option>
                      {nurses.map((nur) => (
                        <option key={nur.id} value={nur.fullName}>
                          {nur.fullName} — {nur.specialization} ({nur.dutyStatus})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-xs sm:text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Time <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-xs sm:text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40 bg-white/80 dark:bg-purple-950/80"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Reason for Visit <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Regular Checkup, Hypertension review..."
                    value={formData.reasonForVisit}
                    onChange={(e) => setFormData({ ...formData, reasonForVisit: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as AppointmentStatus })
                    }
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40 bg-white/80 dark:bg-purple-950/80"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100 dark:border-purple-800/40">
                  <button
                    type="button"
                    onClick={handleCloseBookModal}
                    className="px-4 py-2 rounded-full liquid-glass hover:bg-purple-100/50 text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)]"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
