import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Medicine } from '../types';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Package
} from 'lucide-react';

export const PharmacyView: React.FC = () => {
  const { medicines, updateMedicineStock, addMedicine } = useHospital();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // New med form
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState<Medicine['category']>('Antibiotic');
  const [dosageForm, setDosageForm] = useState<Medicine['dosageForm']>('Tablet');
  const [strength, setStrength] = useState('');
  const [unitPrice, setUnitPrice] = useState<number>(10);
  const [stockQuantity, setStockQuantity] = useState<number>(100);
  const [reorderLevel, setReorderLevel] = useState<number>(30);
  const [batchNumber, setBatchNumber] = useState(`BT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [expiryDate, setExpiryDate] = useState('2028-12-31');
  const [supplier, setSupplier] = useState('Apex Life Sciences');
  const [location, setLocation] = useState('Shelf B-02');

  const filtered = medicines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.genericName.toLowerCase().includes(search.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'ALL' || m.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !genericName.trim()) return;

    addMedicine({
      name: name.trim(),
      genericName: genericName.trim(),
      category,
      dosageForm,
      strength: strength.trim() || '500mg',
      unitPrice: Number(unitPrice),
      stockQuantity: Number(stockQuantity),
      reorderLevel: Number(reorderLevel),
      batchNumber,
      expiryDate,
      supplier,
      location
    });

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Pharmacy Formulary & Drug Inventory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Central medication catalog, batch inventory, and automated reorder triggers
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search medicine brand, generic name, or batch..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <option value="ALL">All Therapeutic Classes</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="Antibiotic">Antibiotic</option>
            <option value="Antidiabetic">Antidiabetic</option>
            <option value="Antipyretic">Antipyretic</option>
            <option value="Respiratory">Respiratory</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Brand & Generic Name</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Form & Strength</th>
                <th className="py-2.5">Batch / Shelf Location</th>
                <th className="py-2.5">Expiration Date</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-center">In-Stock</th>
                <th className="py-2.5 text-right">Inventory Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filtered.map(m => {
                const isLow = m.stockQuantity <= m.reorderLevel;
                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-sans">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.genericName}</div>
                    </td>
                    <td className="py-3 font-sans text-slate-600 dark:text-slate-300">
                      {m.category}
                    </td>
                    <td className="py-3 font-sans text-slate-600 dark:text-slate-400">
                      {m.dosageForm} ({m.strength})
                    </td>
                    <td className="py-3 text-[11px] text-slate-500">
                      {m.batchNumber} <span className="block text-[10px] text-teal-600">{m.location}</span>
                    </td>
                    <td className="py-3 text-[11px] text-slate-600 dark:text-slate-300">
                      {m.expiryDate}
                    </td>
                    <td className="py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      ${m.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isLow
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {m.stockQuantity}
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => updateMedicineStock(m.id, -10)}
                          disabled={m.stockQuantity <= 0}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[10px] font-mono disabled:opacity-40"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => updateMedicineStock(m.id, 50)}
                          className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-semibold"
                        >
                          +50 Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-6">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                <span>Add Medicine to Formulary</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Trade / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Lipitor"
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Generic Chemical Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={genericName}
                    onChange={e => setGenericName(e.target.value)}
                    placeholder="e.g. Atorvastatin"
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Antidiabetic">Antidiabetic</option>
                    <option value="Antipyretic">Antipyretic</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Form
                  </label>
                  <select
                    value={dosageForm}
                    onChange={e => setDosageForm(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Strength
                  </label>
                  <input
                    type="text"
                    value={strength}
                    onChange={e => setStrength(e.target.value)}
                    placeholder="e.g. 20mg"
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={unitPrice}
                    onChange={e => setUnitPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={e => setStockQuantity(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Reorder Min
                  </label>
                  <input
                    type="number"
                    value={reorderLevel}
                    onChange={e => setReorderLevel(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white font-bold rounded-lg"
                >
                  Save Medication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
