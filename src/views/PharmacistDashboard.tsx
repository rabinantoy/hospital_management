import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Prescription } from '../types';
import {
  Pill,
  ClipboardList,
  AlertTriangle,
  Search,
  CheckCircle2,
  Clock,
  Plus,
  ArrowDownRight
} from 'lucide-react';

interface Props {
  onOpenDispenseModal: (rx: Prescription) => void;
}

export const PharmacistDashboard: React.FC<Props> = ({ onOpenDispenseModal }) => {
  const {
    prescriptions,
    medicines,
    updateMedicineStock,
    currentUser
  } = useHospital();

  const [searchMed, setSearchMed] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const pendingPrescriptions = prescriptions.filter(p => p.status === 'PENDING');
  const dispensedPrescriptions = prescriptions.filter(p => p.status === 'DISPENSED');

  const filteredMedicines = medicines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchMed.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchMed.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(searchMed.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-semibold">
            <Pill className="w-4 h-4" />
            <span>Central Hospital Pharmacy & Formulary</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Prescription Dispensing & Drug Inventory Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pharmacist on Duty: {currentUser.name} · Unit: {currentUser.department}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending Rx</span>
            <span className="text-xl font-mono font-black text-amber-600">
              {pendingPrescriptions.length}
            </span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total SKUs</span>
            <span className="text-xl font-mono font-black text-slate-900 dark:text-slate-100">
              {medicines.length}
            </span>
          </div>
        </div>
      </div>

      {/* Pending Prescriptions Dispense Queue */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Pending Prescriptions Awaiting Dispensing
            </h2>
            <p className="text-[11px] text-slate-400">
              Ordered by hospital physicians; verify inventory stock before release
            </p>
          </div>
          <span className="text-[11px] font-mono text-amber-600 font-bold">
            {pendingPrescriptions.length} Waiting
          </span>
        </div>

        <div className="space-y-3">
          {pendingPrescriptions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              All prescriptions have been verified and dispensed!
            </div>
          ) : (
            pendingPrescriptions.map(rx => (
              <div
                key={rx.id}
                className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/30 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal-600">
                      #{rx.id.toUpperCase()}
                    </span>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                      {rx.patientName}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {rx.patientUhid}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Doctor: {rx.doctorName} · {rx.items.length} Drug Items Prescribed
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {rx.items.map(item => (
                      <span
                        key={item.id}
                        className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                      >
                        {item.medicineName} ({item.dosage} · {item.frequency})
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onOpenDispenseModal(rx)}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 self-end sm:self-center shrink-0"
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>Verify & Dispense</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Medicine Inventory Catalog */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Hospital Drug Formulary & Stock Levels
            </h2>
            <p className="text-[11px] text-slate-400">
              Batch codes, expiration schedules, unit costs, and reorder levels
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchMed}
                onChange={e => setSearchMed(e.target.value)}
                placeholder="Search medicine or batch..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Cardiovascular">Cardiovascular</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Antidiabetic">Antidiabetic</option>
              <option value="Antipyretic">Antipyretic</option>
              <option value="Respiratory">Respiratory</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Brand / Generic Name</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Dosage Form</th>
                <th className="py-2.5">Batch / Shelf</th>
                <th className="py-2.5">Expiry Date</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-center">Stock Level</th>
                <th className="py-2.5 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filteredMedicines.map(m => {
                const isLowStock = m.stockQuantity <= m.reorderLevel;
                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-sans">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{m.name}</div>
                      <div className="text-[10px] text-slate-400">{m.genericName} · {m.strength}</div>
                    </td>
                    <td className="py-3 font-sans text-slate-600 dark:text-slate-300">
                      {m.category}
                    </td>
                    <td className="py-3 font-sans text-slate-600 dark:text-slate-400">
                      {m.dosageForm}
                    </td>
                    <td className="py-3 text-[11px] text-slate-500">
                      {m.batchNumber} <span className="text-[9px] block text-slate-400">{m.location}</span>
                    </td>
                    <td className="py-3 text-[11px] text-slate-600 dark:text-slate-300">
                      {m.expiryDate}
                    </td>
                    <td className="py-3 text-right font-bold text-slate-900 dark:text-slate-100">
                      ${m.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isLowStock
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {m.stockQuantity} Units
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans">
                      <button
                        onClick={() => updateMedicineStock(m.id, 50)}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-semibold transition-colors"
                      >
                        +50 Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
