import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Search,
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  FileCheck,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Bill, PaymentStatus } from '../types';
import { EmptyState } from '../components/EmptyState';

export const BillingView: React.FC = () => {
  const {
    bills,
    patients,
    addBill,
    updateBillStatus,
    setActiveTab,
    hospitalName,
    doctorName,
  } = useHospital();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    consultationFee: 75,
    treatmentCharges: 0,
    laboratoryCharges: 0,
    pharmacyCharges: 0,
    paymentStatus: 'Pending' as PaymentStatus,
    notes: '',
  });

  const totalCalculated =
    Number(formData.consultationFee || 0) +
    Number(formData.treatmentCharges || 0) +
    Number(formData.laboratoryCharges || 0) +
    Number(formData.pharmacyCharges || 0);

  const handleOpenCreateModal = () => {
    if (patients.length > 0 && !formData.patientId) {
      setFormData((prev) => ({ ...prev, patientId: patients[0].id }));
    }
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setFormData({
      patientId: patients.length > 0 ? patients[0].id : '',
      consultationFee: 75,
      treatmentCharges: 0,
      laboratoryCharges: 0,
      pharmacyCharges: 0,
      paymentStatus: 'Pending',
      notes: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientId) return;

    const patient = patients.find((p) => p.id === formData.patientId);
    if (!patient) return;

    addBill({
      patientId: patient.id,
      patientName: patient.fullName,
      consultationFee: Number(formData.consultationFee || 0),
      treatmentCharges: Number(formData.treatmentCharges || 0),
      laboratoryCharges: Number(formData.laboratoryCharges || 0),
      pharmacyCharges: Number(formData.pharmacyCharges || 0),
      paymentStatus: formData.paymentStatus,
      date: new Date().toISOString().split('T')[0],
      notes: formData.notes.trim() || undefined,
    });

    handleCloseCreateModal();
  };

  const filteredBills = bills.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.patientName.toLowerCase().includes(q) ||
      b.patientId.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
            Billing
          </h2>
          <p className="text-sm text-purple-900/60 dark:text-purple-300/60 mt-1">
            Invoicing, consultation fees, and payment status tracking
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Bill</span>
        </button>
      </div>

      {/* Search Bar if bills exist */}
      {bills.length > 0 && (
        <div className="liquid-glass rounded-2xl p-2 sm:p-2.5 flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-600 dark:text-purple-300 ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bills by invoice number, patient name or ID..."
            className="w-full bg-transparent text-purple-950 dark:text-purple-100 placeholder-purple-900/40 text-sm focus:outline-none"
          />
        </div>
      )}

      {/* Main Content Area */}
      {bills.length === 0 ? (
        <EmptyState
          title="No billing records available."
          description="There are currently no bills or financial invoices recorded in Aura Care. Generate a bill for a patient to track charges."
          icon={CreditCard}
          actionText="+ Create Bill"
          onAction={handleOpenCreateModal}
        />
      ) : filteredBills.length === 0 ? (
        <div className="liquid-glass rounded-[24px] p-8 text-center">
          <p className="text-base font-semibold text-purple-950 dark:text-purple-100">
            No bills match "{searchQuery}"
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-100/80 dark:border-purple-800/40 text-[11px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase tracking-wider bg-purple-50/40 dark:bg-purple-950/20">
                  <th className="py-3.5 px-4 sm:px-6">Invoice #</th>
                  <th className="py-3.5 px-4 sm:px-6">Patient</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell">Date</th>
                  <th className="py-3.5 px-4 sm:px-6">Consultation</th>
                  <th className="py-3.5 px-4 sm:px-6 hidden lg:table-cell">Labs & Meds</th>
                  <th className="py-3.5 px-4 sm:px-6 font-bold">Total</th>
                  <th className="py-3.5 px-4 sm:px-6">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60 dark:divide-purple-800/30 text-sm">
                {filteredBills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="hover:bg-purple-50/60 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-mono text-xs font-semibold text-purple-700 dark:text-purple-300">
                      {bill.id}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-purple-950 dark:text-purple-100">
                        {bill.patientName}
                      </div>
                      <div className="text-[11px] font-mono text-purple-900/50 dark:text-purple-300/50">
                        {bill.patientId}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs text-purple-900/70 dark:text-purple-300/70 hidden md:table-cell">
                      {bill.date}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs font-mono text-purple-900 dark:text-purple-200">
                      ${bill.consultationFee.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-xs font-mono text-purple-900/70 dark:text-purple-300/70 hidden lg:table-cell">
                      ${(bill.laboratoryCharges + bill.pharmacyCharges + bill.treatmentCharges).toFixed(2)}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-sm font-bold font-mono text-purple-950 dark:text-purple-100">
                      ${bill.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <select
                        value={bill.paymentStatus}
                        onChange={(e) =>
                          updateBillStatus(bill.id, e.target.value as PaymentStatus)
                        }
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border-none focus:outline-none cursor-pointer ${
                          bill.paymentStatus === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : bill.paymentStatus === 'Partially Paid'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Partially Paid">Partially Paid</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedBill(bill)}
                        className="p-1.5 rounded-xl text-purple-700 dark:text-purple-300 hover:bg-purple-100/80 dark:hover:bg-purple-800/40 inline-flex items-center gap-1 text-xs font-medium"
                      >
                        <Receipt className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Bill Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-lg liquid-glass-elevated rounded-[28px] p-6 sm:p-7 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-100 dark:border-purple-800/40">
              <div>
                <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100">
                  Create Bill
                </h3>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-0.5">
                  Generate hospital invoice for patient services
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseCreateModal}
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
                  A bill must be associated with a registered patient.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseCreateModal();
                    setActiveTab('patients');
                  }}
                  className="mt-4 px-5 py-2 rounded-full bg-purple-600 text-white font-medium text-xs shadow-sm"
                >
                  Go to Patients
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Select Patient */}
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Select Patient <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-600/40 bg-white/80 dark:bg-purple-950/80"
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

                {/* Charges Breakdown */}
                <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40 space-y-3">
                  <h4 className="text-xs font-bold text-purple-950 dark:text-purple-200 uppercase tracking-wider">
                    Service Charges Breakdown
                  </h4>

                  {/* Consultation fee */}
                  <div>
                    <label className="block text-xs font-medium text-purple-900/80 dark:text-purple-300/80 mb-1">
                      Consultation Fee ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.consultationFee}
                      onChange={(e) =>
                        setFormData({ ...formData, consultationFee: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl liquid-glass border border-purple-200/80 text-sm font-mono focus:outline-none"
                    />
                  </div>

                  {/* Treatment charges */}
                  <div>
                    <label className="block text-xs font-medium text-purple-900/80 dark:text-purple-300/80 mb-1">
                      Treatment Charges ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.treatmentCharges}
                      onChange={(e) =>
                        setFormData({ ...formData, treatmentCharges: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl liquid-glass border border-purple-200/80 text-sm font-mono focus:outline-none"
                    />
                  </div>

                  {/* Laboratory charges */}
                  <div>
                    <label className="block text-xs font-medium text-purple-900/80 dark:text-purple-300/80 mb-1">
                      Laboratory Charges ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.laboratoryCharges}
                      onChange={(e) =>
                        setFormData({ ...formData, laboratoryCharges: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl liquid-glass border border-purple-200/80 text-sm font-mono focus:outline-none"
                    />
                  </div>

                  {/* Pharmacy charges */}
                  <div>
                    <label className="block text-xs font-medium text-purple-900/80 dark:text-purple-300/80 mb-1">
                      Pharmacy Charges ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.pharmacyCharges}
                      onChange={(e) =>
                        setFormData({ ...formData, pharmacyCharges: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 rounded-xl liquid-glass border border-purple-200/80 text-sm font-mono focus:outline-none"
                    />
                  </div>
                </div>

                {/* Total Display */}
                <div className="p-4 rounded-2xl liquid-glass flex items-center justify-between border-2 border-purple-300/60 dark:border-purple-600/50">
                  <span className="text-sm font-bold text-purple-950 dark:text-purple-100">
                    Calculated Total
                  </span>
                  <span className="text-2xl font-extrabold font-mono text-purple-700 dark:text-purple-300">
                    ${totalCalculated.toFixed(2)}
                  </span>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentStatus: e.target.value as PaymentStatus })
                    }
                    className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 dark:border-purple-700/60 text-sm text-purple-950 dark:text-purple-100 focus:outline-none bg-white/80 dark:bg-purple-950/80"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partially Paid">Partially Paid</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100 dark:border-purple-800/40">
                  <button
                    type="button"
                    onClick={handleCloseCreateModal}
                    className="px-4 py-2 rounded-full liquid-glass hover:bg-purple-100/50 text-xs sm:text-sm font-medium text-purple-900 dark:text-purple-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)]"
                  >
                    Generate Bill
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bill Receipt Modal */}
      {selectedBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-md liquid-glass-elevated rounded-[28px] p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-purple-100 dark:border-purple-800/40">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase">
                  {hospitalName} Billing Receipt
                </span>
                <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100 mt-0.5">
                  Invoice {selectedBill.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="p-1.5 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-purple-100/60">
                <span className="text-purple-900/60 dark:text-purple-300/60">Patient Name</span>
                <span className="font-bold text-purple-950 dark:text-purple-100">{selectedBill.patientName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-100/60">
                <span className="text-purple-900/60 dark:text-purple-300/60">Attending Physician</span>
                <span className="font-semibold text-purple-950 dark:text-purple-100">{doctorName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-100/60">
                <span className="text-purple-900/60 dark:text-purple-300/60">Invoice Date</span>
                <span className="font-semibold">{selectedBill.date}</span>
              </div>

              {/* Items */}
              <div className="pt-2 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-purple-900/70 dark:text-purple-300/70 font-sans">Consultation Fee</span>
                  <span>${selectedBill.consultationFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-900/70 dark:text-purple-300/70 font-sans">Treatment Charges</span>
                  <span>${selectedBill.treatmentCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-900/70 dark:text-purple-300/70 font-sans">Laboratory Charges</span>
                  <span>${selectedBill.laboratoryCharges.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-900/70 dark:text-purple-300/70 font-sans">Pharmacy Charges</span>
                  <span>${selectedBill.pharmacyCharges.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-800/40 flex justify-between items-center mt-3 font-mono">
                <span className="font-bold text-purple-950 dark:text-purple-100 font-sans">Total Amount</span>
                <span className="text-xl font-bold text-purple-700 dark:text-purple-300">
                  ${selectedBill.total.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-purple-900/60 dark:text-purple-300/60">Payment Status</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    selectedBill.paymentStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {selectedBill.paymentStatus}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-100 dark:border-purple-800/40 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBill(null)}
                className="px-5 py-2 rounded-full bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700"
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
