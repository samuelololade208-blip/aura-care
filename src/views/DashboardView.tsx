import React from 'react';
import {
  Users,
  Calendar,
  CreditCard,
  Stethoscope,
  Plus,
  Clock,
  CheckCircle2,
  ArrowRight,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { EmptyState } from '../components/EmptyState';

export const DashboardView: React.FC = () => {
  const {
    patients,
    appointments,
    bills,
    activities,
    staff,
    doctors,
    nurses,
    setActiveTab,
    doctorName,
  } = useHospital();

  const todayIso = new Date().toISOString().split('T')[0];

  const todaysAppointments = appointments.filter((apt) => apt.date === todayIso);

  const pendingBills = bills.filter(
    (b) => b.paymentStatus === 'Pending' || b.paymentStatus === 'Partially Paid'
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-sm font-semibold tracking-wide text-purple-600 dark:text-purple-400 uppercase">
            Good morning
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight mt-0.5">
            Aura Care Dashboard
          </h2>
          <p className="text-sm text-purple-900/60 dark:text-purple-300/60 mt-1">
            Clinical management overview for {doctorName}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('patients')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Patient</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full liquid-glass hover:bg-white/90 dark:hover:bg-purple-900/50 text-purple-950 dark:text-purple-100 font-medium text-xs sm:text-sm transition-all border border-purple-200/60 dark:border-purple-700/50"
          >
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* 4 Simple Glass Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Patients */}
        <div className="liquid-glass rounded-[24px] p-5 relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-900/70 dark:text-purple-300/70">
              Total Patients
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-100/80 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          {patients.length > 0 ? (
            <div>
              <div className="text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
                {patients.length}
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-1">
                Registered in Aura Care
              </p>
            </div>
          ) : (
            <div>
              <div className="text-base font-semibold text-purple-900/60 dark:text-purple-300/60 mt-2">
                No data available
              </div>
              <p className="text-[11px] text-purple-900/40 dark:text-purple-400/40 mt-1">
                Add patients to view metrics
              </p>
            </div>
          )}
        </div>

        {/* Today's Appointments */}
        <div className="liquid-glass rounded-[24px] p-5 relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-900/70 dark:text-purple-300/70">
              Today's Appointments
            </span>
            <div className="w-9 h-9 rounded-2xl bg-purple-100/80 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          {todaysAppointments.length > 0 ? (
            <div>
              <div className="text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
                {todaysAppointments.length}
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium mt-1">
                Scheduled for today
              </p>
            </div>
          ) : (
            <div>
              <div className="text-base font-semibold text-purple-900/60 dark:text-purple-300/60 mt-2">
                No data available
              </div>
              <p className="text-[11px] text-purple-900/40 dark:text-purple-400/40 mt-1">
                No consultations today
              </p>
            </div>
          )}
        </div>

        {/* Pending Payments */}
        <div className="liquid-glass rounded-[24px] p-5 relative overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-900/70 dark:text-purple-300/70">
              Pending Payments
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-100/80 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          {pendingBills.length > 0 ? (
            <div>
              <div className="text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
                {pendingBills.length}
              </div>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1">
                Awaiting settlement
              </p>
            </div>
          ) : (
            <div>
              <div className="text-base font-semibold text-purple-900/60 dark:text-purple-300/60 mt-2">
                No data available
              </div>
              <p className="text-[11px] text-purple-900/40 dark:text-purple-400/40 mt-1">
                All bills settled or none created
              </p>
            </div>
          )}
        </div>

        {/* Clinical Staff */}
        <div
          onClick={() => setActiveTab('doctors')}
          className="liquid-glass rounded-[24px] p-5 relative overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-purple-900/70 dark:text-purple-300/70 group-hover:text-purple-950 dark:group-hover:text-white transition-colors">
              Clinical Staff
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
              {staff.length}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                {staff.filter((s) => s.dutyStatus === 'On Duty').length} On Duty ({doctors.length}D / {nurses.length}N)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Today's Appointments & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments Section (2 columns on wide) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100">
                Today's Appointments
              </h3>
              <p className="text-xs text-purple-900/60 dark:text-purple-300/60">
                Consultations booked for {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('appointments')}
              className="text-xs font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 flex items-center gap-1 group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {todaysAppointments.length === 0 ? (
            <div className="liquid-glass rounded-[24px] p-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-purple-100/70 dark:bg-purple-900/30 border border-purple-200/60 dark:border-purple-700/40 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-3">
                <Calendar className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="text-base font-semibold text-purple-950 dark:text-purple-100">
                No appointments scheduled for today.
              </p>
              <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-1 max-w-sm">
                Any appointments booked for today will appear here in real time.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('appointments')}
                className="mt-4 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs transition-all shadow-sm"
              >
                + Book Appointment
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="liquid-glass rounded-[20px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-purple-100/80 dark:border-purple-800/40 hover:border-purple-200 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-purple-950 dark:text-purple-100">
                          {apt.patientName}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            apt.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : apt.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-0.5">
                        {apt.reasonForVisit} • Doctor: {apt.doctor}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-purple-900 dark:text-purple-200 bg-purple-50 dark:bg-purple-900/40 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800/40">
                      {apt.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Section (1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100">
              Recent Activity
            </h3>
            <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400">
              Live Log
            </span>
          </div>

          <div className="liquid-glass rounded-[24px] p-5">
            {activities.length === 0 ? (
              <div className="py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-purple-100/60 dark:bg-purple-900/30 border border-purple-200/50 flex items-center justify-center text-purple-500 mx-auto mb-2.5">
                  <Activity className="w-5 h-5 stroke-[1.5]" />
                </div>
                <p className="text-sm font-semibold text-purple-950 dark:text-purple-100">
                  No recent activity.
                </p>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-1">
                  Actions performed across Aura Care will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-purple-950 dark:text-purple-100">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-purple-900/60 dark:text-purple-300/60 truncate mt-0.5">
                        {act.description}
                      </p>
                    </div>
                    <span className="text-[10px] text-purple-900/40 dark:text-purple-400/40 shrink-0 font-medium">
                      {act.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
