import React, { useState } from 'react';
import {
  Stethoscope,
  HeartPulse,
  Plus,
  Search,
  Filter,
  Clock,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  Award,
  Trash2,
  Edit3,
  UserCheck,
  CheckCircle2,
  X,
  AlertCircle,
  Activity,
  Briefcase,
  Hospital,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { StaffMember, StaffRole, StaffDutyStatus } from '../types';
import { EmptyState } from '../components/EmptyState';

export const DoctorsView: React.FC = () => {
  const {
    staff,
    doctors,
    nurses,
    addStaffMember,
    updateStaffMember,
    updateStaffDutyStatus,
    deleteStaffMember,
    appointments,
    hospitalName,
    setActiveTab,
  } = useHospital();

  const [activeRoleFilter, setActiveRoleFilter] = useState<'All' | 'Doctor' | 'Nurse'>('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    role: 'Doctor' as StaffRole,
    department: 'General Medicine',
    specialization: '',
    qualification: '',
    phone: '',
    email: '',
    dutyStatus: 'On Duty' as StaffDutyStatus,
    schedule: 'Mon – Fri: 09:00 AM – 05:00 PM',
    notes: '',
  });

  // Delete Confirmation State
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  const openAddModal = (presetRole: StaffRole = 'Doctor') => {
    setEditingStaffId(null);
    setFormData({
      fullName: presetRole === 'Doctor' ? 'Dr. ' : 'Nurse ',
      role: presetRole,
      department: presetRole === 'Doctor' ? 'General Medicine' : 'Triage & Inpatient Care',
      specialization: presetRole === 'Doctor' ? 'Attending Physician' : 'Registered Staff Nurse',
      qualification: presetRole === 'Doctor' ? 'MD' : 'BSN, RN',
      phone: '+1 (555) 000-0000',
      email: `@auracare.hospital`,
      dutyStatus: 'On Duty',
      schedule: 'Mon – Fri: 08:30 AM – 05:00 PM',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setFormData({
      fullName: member.fullName,
      role: member.role,
      department: member.department,
      specialization: member.specialization,
      qualification: member.qualification,
      phone: member.phone,
      email: member.email,
      dutyStatus: member.dutyStatus,
      schedule: member.schedule,
      notes: member.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaffId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;

    if (editingStaffId) {
      updateStaffMember(editingStaffId, {
        fullName: formData.fullName.trim(),
        role: formData.role,
        department: formData.department.trim(),
        specialization: formData.specialization.trim(),
        qualification: formData.qualification.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        dutyStatus: formData.dutyStatus,
        schedule: formData.schedule.trim(),
        notes: formData.notes.trim(),
      });
    } else {
      addStaffMember({
        fullName: formData.fullName.trim(),
        role: formData.role,
        department: formData.department.trim() || (formData.role === 'Doctor' ? 'General Medicine' : 'Nursing Care'),
        specialization: formData.specialization.trim() || (formData.role === 'Doctor' ? 'Medical Practitioner' : 'Staff Nurse'),
        qualification: formData.qualification.trim() || (formData.role === 'Doctor' ? 'MD' : 'RN'),
        phone: formData.phone.trim() || '+1 (555) 234-5678',
        email: formData.email.trim() || `${formData.fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@auracare.hospital`,
        dutyStatus: formData.dutyStatus,
        schedule: formData.schedule.trim() || 'Mon – Fri: 09:00 AM – 05:00 PM',
        notes: formData.notes.trim(),
      });
    }

    handleCloseModal();
  };

  // Filtered staff list
  const filteredStaff = staff.filter((member) => {
    // Role filter
    if (activeRoleFilter !== 'All' && member.role !== activeRoleFilter) {
      return false;
    }
    // Status filter
    if (activeStatusFilter !== 'all' && member.dutyStatus !== activeStatusFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = member.fullName.toLowerCase().includes(q);
      const matchDept = member.department.toLowerCase().includes(q);
      const matchSpec = member.specialization.toLowerCase().includes(q);
      const matchId = member.id.toLowerCase().includes(q);
      return matchName || matchDept || matchSpec || matchId;
    }
    return true;
  });

  const onDutyCount = staff.filter((s) => s.dutyStatus === 'On Duty').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100/80 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              <Hospital className="w-3.5 h-3.5" />
              <span>Aura Care Clinical Personnel</span>
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight mt-1.5">
            Doctors & Nurse Profiles
          </h2>
          <p className="text-sm text-purple-900/60 dark:text-purple-300/60 mt-1 max-w-2xl">
            Directory of licensed physicians, medical specialists, and clinical nurses supporting inpatient and outpatient care at {hospitalName}.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            id="btn-add-doctor"
            onClick={() => openAddModal('Doctor')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <Stethoscope className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>

          <button
            type="button"
            id="btn-add-nurse"
            onClick={() => openAddModal('Nurse')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full liquid-glass hover:bg-white/90 dark:hover:bg-purple-900/50 text-purple-950 dark:text-purple-100 font-medium text-xs sm:text-sm transition-all border border-purple-200/60 dark:border-purple-700/50 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <HeartPulse className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Add Nurse</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {/* Total Staff */}
        <div className="liquid-glass rounded-[22px] p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60">
              Total Staff
            </p>
            <p className="text-2xl font-extrabold text-purple-950 dark:text-purple-100 mt-0.5">
              {staff.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-100/80 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>

        {/* Doctors */}
        <div className="liquid-glass rounded-[22px] p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60">
              Physicians
            </p>
            <p className="text-2xl font-extrabold text-purple-950 dark:text-purple-100 mt-0.5">
              {doctors.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-100/80 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        {/* Nurses */}
        <div className="liquid-glass rounded-[22px] p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60">
              Nurses
            </p>
            <p className="text-2xl font-extrabold text-purple-950 dark:text-purple-100 mt-0.5">
              {nurses.length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-100/80 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
        </div>

        {/* On Duty */}
        <div className="liquid-glass rounded-[22px] p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60">
              On Duty Now
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-2xl font-extrabold text-purple-950 dark:text-purple-100">
                {onDutyCount}
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Tabs & Filters & Search */}
      <div className="liquid-glass rounded-[24px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-sm">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-purple-100/60 dark:bg-purple-900/40 shrink-0">
          <button
            type="button"
            onClick={() => setActiveRoleFilter('All')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeRoleFilter === 'All'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-900/70 dark:text-purple-200 hover:text-purple-950 dark:hover:text-white'
            }`}
          >
            All Staff ({staff.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleFilter('Doctor')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeRoleFilter === 'Doctor'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-900/70 dark:text-purple-200 hover:text-purple-950 dark:hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctors ({doctors.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleFilter('Nurse')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeRoleFilter === 'Nurse'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-purple-900/70 dark:text-purple-200 hover:text-purple-950 dark:hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Nurses ({nurses.length})</span>
          </button>
        </div>

        {/* Right Controls: Status filter & Search */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-xl">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl liquid-glass text-xs border border-purple-200/50 dark:border-purple-700/50">
            <Filter className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="bg-transparent text-purple-950 dark:text-purple-100 font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="On Duty">On Duty</option>
              <option value="On Call">On Call</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500/70 dark:text-purple-400" />
            <input
              type="text"
              placeholder="Search by name, department, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-2xl liquid-glass text-xs text-purple-950 dark:text-purple-100 placeholder:text-purple-900/40 dark:placeholder:text-purple-400/40 border border-purple-200/50 dark:border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Staff Cards Grid */}
      {filteredStaff.length === 0 ? (
        <EmptyState
          title="No staff profiles found"
          description={
            searchQuery || activeStatusFilter !== 'all' || activeRoleFilter !== 'All'
              ? 'No medical personnel match your current search or filter criteria. Try resetting filters.'
              : 'There are currently no staff members registered. Click "+ Add Doctor" or "+ Add Nurse" to build the clinical team.'
          }
          actionText="+ Add New Staff Profile"
          onAction={() => openAddModal('Doctor')}
          icon={Hospital}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredStaff.map((member) => {
            const isDoctor = member.role === 'Doctor';
            // Count upcoming appointments for this doctor
            const assignedAppointments = appointments.filter(
              (apt) => apt.doctor === member.fullName && apt.status === 'Scheduled'
            );

            return (
              <div
                key={member.id}
                id={`staff-card-${member.id}`}
                className="liquid-glass rounded-[28px] p-6 transition-all duration-300 hover:shadow-[0_14px_38px_-8px_rgba(109,40,217,0.16)] flex flex-col justify-between group border border-purple-100/80 dark:border-purple-800/40 relative overflow-hidden"
              >
                {/* Card Top Section */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {/* Glass Circular Icon Container - NO PERSON PHOTO */}
                      <div
                        className={`w-14 h-14 rounded-2xl liquid-glass-elevated flex items-center justify-center shrink-0 border shadow-sm ${
                          isDoctor
                            ? 'text-purple-600 dark:text-purple-300 border-purple-200/80 dark:border-purple-700/50 bg-purple-50/50 dark:bg-purple-950/40'
                            : 'text-rose-600 dark:text-rose-300 border-rose-200/80 dark:border-rose-700/50 bg-rose-50/50 dark:bg-rose-950/40'
                        }`}
                      >
                        {isDoctor ? (
                          <Stethoscope className="w-7 h-7 stroke-[1.7]" />
                        ) : (
                          <HeartPulse className="w-7 h-7 stroke-[1.7]" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase ${
                              isDoctor
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                            }`}
                          >
                            {member.role}
                          </span>
                          <span className="text-[11px] font-semibold text-purple-900/50 dark:text-purple-400">
                            {member.id}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100 truncate mt-0.5">
                          {member.fullName}
                        </h3>

                        <p className="text-xs text-purple-700 dark:text-purple-300 font-medium truncate">
                          {member.specialization}
                        </p>
                      </div>
                    </div>

                    {/* Duty Status Selector Badge */}
                    <div className="relative shrink-0">
                      <select
                        aria-label={`Duty status for ${member.fullName}`}
                        value={member.dutyStatus}
                        onChange={(e) =>
                          updateStaffDutyStatus(member.id, e.target.value as StaffDutyStatus)
                        }
                        className={`text-[11px] font-bold rounded-full px-2.5 py-1 border cursor-pointer focus:outline-none transition-colors appearance-none pr-5 ${
                          member.dutyStatus === 'On Duty'
                            ? 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-700/60'
                            : member.dutyStatus === 'On Call'
                            ? 'bg-amber-100/90 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/60 dark:border-amber-700/60'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <option value="On Duty">● On Duty</option>
                        <option value="On Call">● On Call</option>
                        <option value="Off Duty">○ Off Duty</option>
                      </select>
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-purple-900/50 dark:text-purple-300/50">
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Department & Qualifications */}
                  <div className="mt-4 pt-3 border-t border-purple-100/70 dark:border-purple-800/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-900/60 dark:text-purple-300/60 font-medium">
                        Department
                      </span>
                      <span className="font-semibold text-purple-950 dark:text-purple-100 truncate max-w-[190px]">
                        {member.department}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-900/60 dark:text-purple-300/60 font-medium">
                        Credentials
                      </span>
                      <span className="font-semibold text-purple-950 dark:text-purple-100">
                        {member.qualification || 'Licensed Practitioner'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-purple-900/60 dark:text-purple-300/60 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Shift</span>
                      </span>
                      <span className="font-medium text-purple-900/80 dark:text-purple-200 text-[11px] truncate max-w-[200px]">
                        {member.schedule}
                      </span>
                    </div>

                    {isDoctor && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-900/60 dark:text-purple-300/60 font-medium flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Active Queue</span>
                        </span>
                        <span className="font-bold text-purple-950 dark:text-purple-100 text-[11px] bg-purple-100/70 dark:bg-purple-900/40 px-2 py-0.5 rounded-full">
                          {assignedAppointments.length} Visit{assignedAppointments.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contact Information & Bio */}
                  <div className="mt-3 pt-3 border-t border-purple-100/70 dark:border-purple-800/30 space-y-1.5 text-xs text-purple-900/70 dark:text-purple-300/70">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.notes && (
                      <p className="text-[11px] text-purple-900/60 dark:text-purple-300/60 italic line-clamp-2 mt-1">
                        "{member.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-5 pt-3.5 border-t border-purple-100/70 dark:border-purple-800/30 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditModal(member)}
                      className="p-2 rounded-xl text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-800/40 transition-colors"
                      title="Edit Profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setStaffToDelete(member)}
                      className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-100/60 dark:hover:bg-rose-950/40 transition-colors"
                      title="Remove Staff Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {isDoctor ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab('appointments')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Book Visit</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-purple-600 dark:text-purple-300 px-2 py-1 rounded-full bg-purple-50/70 dark:bg-purple-900/30">
                      Inpatient & Triage Care
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="liquid-glass-elevated rounded-[32px] w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-purple-200/80 dark:border-purple-700/60"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-purple-100 dark:border-purple-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                  {formData.role === 'Doctor' ? (
                    <Stethoscope className="w-5 h-5" />
                  ) : (
                    <HeartPulse className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100">
                    {editingStaffId ? 'Edit Staff Profile' : 'Add Clinical Staff Profile'}
                  </h3>
                  <p className="text-xs text-purple-900/60 dark:text-purple-300/60">
                    {editingStaffId ? 'Update credentials and schedule' : 'Register a new Doctor or Nurse at Aura Care'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="p-2 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/80 dark:hover:bg-purple-800/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Picker (Doctor vs Nurse) */}
              <div>
                <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1.5">
                  Select Role <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        role: 'Doctor',
                        specialization: prev.specialization || 'Attending Physician',
                        qualification: prev.qualification || 'MD',
                        department: prev.department || 'General Medicine',
                      }));
                    }}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                      formData.role === 'Doctor'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'liquid-glass text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-700'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Doctor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        role: 'Nurse',
                        specialization: prev.specialization || 'Staff Nurse',
                        qualification: prev.qualification || 'BSN, RN',
                        department: prev.department || 'Triage & Inpatient Care',
                      }));
                    }}
                    className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                      formData.role === 'Nurse'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                        : 'liquid-glass text-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-700'
                    }`}
                  >
                    <HeartPulse className="w-4 h-4" />
                    <span>Nurse</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1">
                  Full Name & Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={formData.role === 'Doctor' ? 'e.g. Doctor James Smith' : 'e.g. Nurse Sarah Jenkins'}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-sm text-purple-950 dark:text-purple-100 placeholder:text-purple-900/40 dark:placeholder:text-purple-400/40 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              {/* Department & Specialization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiology, Pediatrics, ICU"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-sm text-purple-950 dark:text-purple-100 placeholder:text-purple-900/40 dark:placeholder:text-purple-400/40 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1">
                    Specialization / Position <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={
                      formData.role === 'Doctor'
                        ? 'e.g. Chief Medical Officer, Cardiologist'
                        : 'e.g. Charge Nurse, ICU Specialist'
                    }
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-sm text-purple-950 dark:text-purple-100 placeholder:text-purple-900/40 dark:placeholder:text-purple-400/40 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              {/* Qualifications & Duty Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1">
                    Qualifications & Degrees
                  </label>
                  <input
                    type="text"
                    placeholder={formData.role === 'Doctor' ? 'e.g. MD, FACP, MBBS' : 'e.g. BSN, RN, MSN'}
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-sm text-purple-950 dark:text-purple-100 placeholder:text-purple-900/40 dark:placeholder:text-purple-400/40 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1">
                    Duty Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.dutyStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, dutyStatus: e.target.value as StaffDutyStatus })
                    }
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-sm text-purple-950 dark:text-purple-100 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  >
                    <option value="On Duty">On Duty (Available for patients)</option>
                    <option value="On Call">On Call (Emergency contact)</option>
                    <option value="Off Duty">Off Duty (Unavailable)</option>
                  </select>
                </div>
              </div>

              {/* Shift Schedule */}
              <div>
                <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1">
                  Working Shift / Schedule
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mon – Fri: 08:30 AM – 05:00 PM or Night Shift: 08:00 PM – 08:00 AM"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-sm text-purple-950 dark:text-purple-100 placeholder:text-purple-900/40 dark:placeholder:text-purple-400/40 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-sm text-purple-950 dark:text-purple-100 placeholder:text-purple-900/40 dark:placeholder:text-purple-400/40 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    placeholder="staff@auracare.hospital"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-sm text-purple-950 dark:text-purple-100 placeholder:text-purple-900/40 dark:placeholder:text-purple-400/40 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-xs font-semibold text-purple-950 dark:text-purple-200 mb-1">
                  Clinical Responsibilities / Bio Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Primary clinical duties, ward assignments, or specialty background..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl liquid-glass text-sm text-purple-950 dark:text-purple-100 placeholder:text-purple-900/40 dark:placeholder:text-purple-400/40 border border-purple-200/60 dark:border-purple-700/60 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-100 dark:border-purple-800/40">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold text-purple-900/70 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-900/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)]"
                >
                  {editingStaffId ? 'Save Profile Changes' : `Add ${formData.role} Profile`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {staffToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md animate-in fade-in duration-200">
          <div className="liquid-glass-elevated rounded-[28px] max-w-md w-full p-6 shadow-2xl border border-rose-200 dark:border-rose-900/50">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Remove Staff Profile?</h3>
            </div>
            <p className="text-xs text-purple-900/70 dark:text-purple-300/70 leading-relaxed">
              Are you sure you want to remove <strong>{staffToDelete.fullName}</strong> ({staffToDelete.role}) from the Aura Care active registry?
            </p>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStaffToDelete(null)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-purple-900/70 dark:text-purple-300 hover:bg-purple-100/60 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteStaffMember(staffToDelete.id);
                  setStaffToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
