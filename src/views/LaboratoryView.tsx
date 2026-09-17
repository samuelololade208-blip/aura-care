import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  FileCheck,
  X,
  Edit2,
  AlertCircle,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { LabRequest, LabStatus } from '../types';
import { EmptyState } from '../components/EmptyState';

export const LaboratoryView: React.FC = () => {
  const {
    labRequests,
    patients,
    addLabRequest,
    updateLabRequestStatus,
    setActiveTab,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<LabRequest | null>(null);

  // Form for New Lab Request
  const [formData, setFormData] = useState({
    patientId: '',
    test: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Pending' as LabStatus,
    result: 'Pending laboratory analysis',
  });

  // Form for Update Status & Result
  const [editStatus, setEditStatus] = useState<LabStatus>('Pending');
  const [editResult, setEditResult] = useState('');

  const handleOpenAddModal = () => {
    if (patients.length > 0 && !formData.patientId) {
      setFormData((prev) => ({ ...prev, patientId: patients[0].id }));
    }
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setFormData({
      patientId: patients.length > 0 ? patients[0].id : '',
      test: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      result: 'Pending laboratory analysis',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId || !formData.test.trim()) return;

    const patient = patients.find((p) => p.id === formData.patientId);
    if (!patient) return;

    addLabRequest({
      patientId: patient.id,
      patientName: patient.fullName,
      test: formData.test.trim(),
      date: formData.date,
      status: formData.status,
      result: formData.result.trim() || 'Pending laboratory analysis',
    });

    handleCloseAddModal();
  };

  const handleOpenEdit = (lab: LabRequest) => {
    setEditingLab(lab);
    setEditStatus(lab.status);
    setEditResult(lab.result);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLab) return;

    updateLabRequestStatus(editingLab.id, editStatus, editResult.trim());
    setEditingLab(null);
  };

  const filteredLabs = labRequests.filter((lab) => {
    const q = searchQuery.toLowerCase();
    return (
      lab.patientName.toLowerCase().includes(q) ||
      lab.test.toLowerCase().includes(q) ||
      lab.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
            Laboratory
          </h2>
          <p className="text-sm text-purple-900/60 dark:text-purple-300/60 mt-1">
            Diagnostic tests, pathology requests, and lab specimen results
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Lab Request</span>
        </button>
      </div>

      {/* Search Bar if requests exist */}
      {labRequests.length > 0 && (
        <div className="liquid-glass rounded-2xl p-2 sm:p-2.5 flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-600 dark:text-purple-300 ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search laboratory requests by patient or test name..."
            className="w-full bg-transparent text-purple-950 dark:text-purple-100 placeholder-purple-900/40 text-sm focus:outline-none"
          />
        </div>
      )}

      {/* Main Content Area */}
      {labRequests.length === 0 ? (
        <EmptyState
          title="No laboratory requests."
          description="There are currently no diagnostic tests or pathology orders requested. Order a test for a patient using the button below."
          icon={FlaskConical}
          actionText="+ New Lab Request"
          onAction={handleOpenAddModal}
        />
      ) : filteredLabs.length === 0 ? (
        <div className="liquid-glass rounded-[24px] p-8 text-center">
          <p className="text-base font-semibold text-purple-950 dark:text-purple-100">
            No lab requests match "{searchQuery}"
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="mt-3 px-4 py-1.5 rounded-full text-xs font-semibold text-purple-700 hover:bg-purple-100/60"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="liquid-glass rounded-[24px] overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-purple-100/80 dark:border-purple-800/40 flex items-center justify-between">
            <h3 className="text-base font-bold text-purple-950 dark:text-purple-100">
              Laboratory Requests
            </h3>
            <span className="text-xs text-purple-900/60 dark:text-purple-300/60">
              {labRequests.length} Request{labRequests.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-100/80 dark:border-purple-800/40 text-[11px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase tracking-wider bg-purple-50/40 dark:bg-purple-950/20">
                  <th className="py-3.5 px-4 sm:px-6">Request ID</th>
                  <th className="py-3.5 px-4 sm:px-6">Patient</th>
                  <th className="py-3.5 px-4 sm:px-6">Test Requested</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden sm:table-cell">Date</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6">Result</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60 dark:divide-purple-800/30 text-sm">
                {filteredLabs.map((lab) => (
                  <tr
                    key={lab.id}
                    className="hover:bg-purple-50/60 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-mono text-xs font-semibold text-purple-700 dark:text-purple-300">
                      {lab.id}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-purple-950 dark:text-purple-100">
                        {lab.patientName}
                      </div>
                      <span className="text-[10px] font-mono text-purple-900/50 dark:text-purple-300/50">
                        {lab.patientId}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-semibold text-purple-950 dark:text-purple-100">
                        {lab.test}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs text-purple-900/70 dark:text-purple-300/70 hidden sm:table-cell">
                      {lab.date}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          lab.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : lab.status === 'In Progress'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            lab.status === 'Completed'
                              ? 'bg-emerald-500'
                              : lab.status === 'In Progress'
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-purple-500'
                          }`}
                        />
                        {lab.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs text-purple-900/80 dark:text-purple-200 max-w-xs truncate">
                      {lab.result}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(lab)}
                        className="px-3 py-1 rounded-full text-xs font-semibold liquid-glass hover:bg-purple-100/60 dark:hover:bg-purple-800/40 text-purple-950 dark:text-purple-100 inline-flex items-center gap-1 border border-purple-200/60"
                      >
                        <Edit2 className="w-3 h-3 text-purple-600" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New Lab Request Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-md liquid-glass-elevated rounded-[28px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-100 dark:border-purple-800/40">
              <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100">
                New Lab Request
              </h3>
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="p-1.5 rounded-full text-purple-700 hover:bg-purple-100/60"
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
                  A laboratory test must be ordered for a registered patient.
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
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Select Patient <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm focus:outline-none bg-white/80 dark:bg-purple-950/80"
                  >
                    <option value="" disabled>
                      Choose patient
                    </option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Diagnostic Test Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete Blood Count (CBC), Lipid Panel, Urinalysis..."
                    value={formData.test}
                    onChange={(e) => setFormData({ ...formData, test: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-xs sm:text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                      Initial Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as LabStatus })
                      }
                      className="w-full px-3 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-xs sm:text-sm focus:outline-none bg-white/80 dark:bg-purple-950/80"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Initial Result / Notes
                  </label>
                  <input
                    type="text"
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    placeholder="e.g. Specimen received, awaiting analysis"
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100 dark:border-purple-800/40">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="px-4 py-2 rounded-full liquid-glass hover:bg-purple-100/50 text-xs sm:text-sm font-medium text-purple-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)]"
                  >
                    Submit Lab Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Result / Status Modal */}
      {editingLab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-md liquid-glass-elevated rounded-[28px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-100 dark:border-purple-800/40">
              <div>
                <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100">
                  Update Lab Result
                </h3>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-0.5">
                  {editingLab.test} for {editingLab.patientName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingLab(null)}
                className="p-1.5 rounded-full text-purple-700 hover:bg-purple-100/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as LabStatus)}
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm focus:outline-none bg-white/80 dark:bg-purple-950/80"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Lab Result / Findings
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter lab findings, blood counts, or normal/abnormal parameters..."
                  value={editResult}
                  onChange={(e) => setEditResult(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100 dark:border-purple-800/40">
                <button
                  type="button"
                  onClick={() => setEditingLab(null)}
                  className="px-4 py-2 rounded-full liquid-glass hover:bg-purple-100/50 text-xs sm:text-sm font-medium text-purple-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)]"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
