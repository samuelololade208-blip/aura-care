import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  Edit2,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { Medicine, StockStatus } from '../types';
import { EmptyState } from '../components/EmptyState';

export const PharmacyView: React.FC = () => {
  const { medicines, addMedicine, updateMedicineStock } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Form for Add Medicine
  const [formData, setFormData] = useState({
    name: '',
    quantity: 50,
    price: 15.0,
    stockStatus: 'In Stock' as StockStatus,
  });

  // Form for Update Stock
  const [updateData, setUpdateData] = useState({
    quantity: 0,
    stockStatus: 'In Stock' as StockStatus,
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      quantity: 50,
      price: 15.0,
      stockStatus: 'In Stock',
    });
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // determine stock status automatically or by user selection
    let status = formData.stockStatus;
    if (formData.quantity === 0) status = 'Out of Stock';
    else if (formData.quantity < 10) status = 'Low Stock';

    addMedicine({
      name: formData.name.trim(),
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      stockStatus: status,
    });

    handleCloseAddModal();
  };

  const handleOpenEditStock = (med: Medicine) => {
    setEditingMedicine(med);
    setUpdateData({
      quantity: med.quantity,
      stockStatus: med.stockStatus,
    });
  };

  const handleCloseEditStock = () => {
    setEditingMedicine(null);
  };

  const handleUpdateStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedicine) return;

    let status = updateData.stockStatus;
    if (updateData.quantity === 0) status = 'Out of Stock';
    else if (updateData.quantity < 10) status = 'Low Stock';

    updateMedicineStock(editingMedicine.id, Number(updateData.quantity), status);
    handleCloseEditStock();
  };

  const filteredMedicines = medicines.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
            Pharmacy
          </h2>
          <p className="text-sm text-purple-900/60 dark:text-purple-300/60 mt-1">
            Medicines inventory, stock management, and dispensary pricing
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-sm transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>
        </div>
      </div>

      {/* Search Bar if medicines exist */}
      {medicines.length > 0 && (
        <div className="liquid-glass rounded-2xl p-2 sm:p-2.5 flex items-center gap-3">
          <Search className="w-5 h-5 text-purple-600 dark:text-purple-300 ml-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search medicines by brand or generic name..."
            className="w-full bg-transparent text-purple-950 dark:text-purple-100 placeholder-purple-900/40 text-sm focus:outline-none"
          />
        </div>
      )}

      {/* Main Content Area */}
      {medicines.length === 0 ? (
        <EmptyState
          title="No medicines added yet."
          description="The pharmacy dispensary has no pharmaceutical records. Click Add Medicine to register pharmaceuticals into stock."
          icon={Pill}
          actionText="Add Medicine"
          onAction={handleOpenAddModal}
        />
      ) : filteredMedicines.length === 0 ? (
        <div className="liquid-glass rounded-[24px] p-8 text-center">
          <p className="text-base font-semibold text-purple-950 dark:text-purple-100">
            No medicines match "{searchQuery}"
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
              Medicines
            </h3>
            <span className="text-xs text-purple-900/60 dark:text-purple-300/60">
              {medicines.length} Item{medicines.length === 1 ? '' : 's'} cataloged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-100/80 dark:border-purple-800/40 text-[11px] font-bold text-purple-900/60 dark:text-purple-300/60 uppercase tracking-wider bg-purple-50/40 dark:bg-purple-950/20">
                  <th className="py-3.5 px-4 sm:px-6">Medicine Name</th>
                  <th className="py-3.5 px-4 sm:px-6">Quantity</th>
                  <th className="py-3.5 px-4 sm:px-6">Price</th>
                  <th className="py-3.5 px-4 sm:px-6">Stock Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60 dark:divide-purple-800/30 text-sm">
                {filteredMedicines.map((med) => (
                  <tr
                    key={med.id}
                    className="hover:bg-purple-50/60 dark:hover:bg-purple-900/20 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0">
                          <Pill className="w-4 h-4" />
                        </div>
                        <div>
                          <div>{med.name}</div>
                          <span className="text-[10px] font-mono text-purple-900/50 dark:text-purple-300/50">
                            {med.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-sm font-semibold text-purple-950 dark:text-purple-100">
                      {med.quantity} units
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-sm text-purple-900 dark:text-purple-200">
                      ${med.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          med.stockStatus === 'In Stock'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : med.stockStatus === 'Low Stock'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            med.stockStatus === 'In Stock'
                              ? 'bg-emerald-500'
                              : med.stockStatus === 'Low Stock'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                        {med.stockStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEditStock(med)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold liquid-glass hover:bg-purple-100/60 dark:hover:bg-purple-800/40 text-purple-950 dark:text-purple-100 inline-flex items-center gap-1.5 border border-purple-200/60"
                      >
                        <Edit2 className="w-3 h-3 text-purple-600 dark:text-purple-300" />
                        <span>Update Stock</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-md liquid-glass-elevated rounded-[28px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-100 dark:border-purple-800/40">
              <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100">
                Add Medicine
              </h3>
              <button
                type="button"
                onClick={handleCloseAddModal}
                className="p-1.5 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Medicine Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol 500mg, Amoxicillin..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Stock Status
                </label>
                <select
                  value={formData.stockStatus}
                  onChange={(e) =>
                    setFormData({ ...formData, stockStatus: e.target.value as StockStatus })
                  }
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm focus:outline-none bg-white/80 dark:bg-purple-950/80"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
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
                  Add Medicine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {editingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-md">
          <div className="w-full max-w-md liquid-glass-elevated rounded-[28px] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-purple-100 dark:border-purple-800/40">
              <div>
                <h3 className="text-xl font-bold text-purple-950 dark:text-purple-100">
                  Update Stock
                </h3>
                <p className="text-xs text-purple-900/60 dark:text-purple-300/60 mt-0.5">
                  {editingMedicine.name} ({editingMedicine.id})
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseEditStock}
                className="p-1.5 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Current Quantity (Units)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={updateData.quantity}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  Stock Status
                </label>
                <select
                  value={updateData.stockStatus}
                  onChange={(e) =>
                    setUpdateData({
                      ...updateData,
                      stockStatus: e.target.value as StockStatus,
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl liquid-glass border border-purple-200/80 text-sm focus:outline-none bg-white/80 dark:bg-purple-950/80"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-purple-100 dark:border-purple-800/40">
                <button
                  type="button"
                  onClick={handleCloseEditStock}
                  className="px-4 py-2 rounded-full liquid-glass hover:bg-purple-100/50 text-xs sm:text-sm font-medium text-purple-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_6px_20px_-3px_rgba(109,40,217,0.35)]"
                >
                  Save Stock Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
