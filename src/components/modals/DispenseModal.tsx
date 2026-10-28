import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Prescription } from '../../types';
import { X, Pill, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription | null;
}

export const DispenseModal: React.FC<Props> = ({ isOpen, onClose, prescription }) => {
  const { medicines, dispensePrescription, currentUser } = useHospital();

  if (!isOpen || !prescription) return null;

  const handleDispense = () => {
    dispensePrescription(prescription.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Pill className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Prescription Dispensing & Verification
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Rx #{prescription.id.toUpperCase()} · Patient: {prescription.patientName} ({prescription.patientUhid})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Prescribing Physician</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{prescription.doctorName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Prescription Date</span>
              <span className="font-mono text-slate-600 dark:text-slate-300">
                {new Date(prescription.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2">
              Prescribed Drug Items ({prescription.items.length})
            </h4>
            <div className="space-y-2">
              {prescription.items.map(item => {
                const med = medicines.find(m => m.id === item.medicineId);
                const isStockLow = (med?.stockQuantity || 0) < (med?.reorderLevel || 10);
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {item.medicineName}
                      </span>
                      <span className="font-mono text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                        Qty: {item.durationDays * 2} Units
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.frequency} · Duration: {item.durationDays} Days
                    </div>
                    {item.instructions && (
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 italic">
                        Note: {item.instructions}
                      </div>
                    )}
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Batch: {med?.batchNumber || 'BT-STD-01'} · Expiry: {med?.expiryDate}</span>
                      <span className={isStockLow ? 'text-rose-500 font-bold' : 'text-emerald-600 font-medium'}>
                        Current Stock: {med?.stockQuantity || 0}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-900/60 text-teal-800 dark:text-teal-300 text-[11px] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
            <span>
              Dispensing will automatically deduct inventory stock and record a clinical audit log under Pharmacist: {currentUser.name}.
            </span>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDispense}
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Verify & Dispense Medication</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
