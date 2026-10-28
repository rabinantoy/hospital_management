import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { X, BedDouble } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedBedId?: string;
}

export const AdmitPatientModal: React.FC<Props> = ({ isOpen, onClose, preselectedBedId }) => {
  const { patients, beds, admitToBed } = useHospital();

  const availableBeds = beds.filter(b => b.status === 'AVAILABLE' || b.id === preselectedBedId);

  const [bedId, setBedId] = useState(preselectedBedId || (availableBeds[0]?.id || ''));
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [reason, setReason] = useState('Inpatient clinical observation & medication stabilization');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bedId || !patientId || !reason.trim()) return;

    admitToBed(bedId, patientId, reason.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <BedDouble className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Inpatient Bed Admission
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Assign patient to available hospital ward bed
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Available Bed *
            </label>
            <select
              value={bedId}
              onChange={e => setBedId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500 font-mono"
            >
              {availableBeds.map(b => (
                <option key={b.id} value={b.id}>
                  {b.bedNumber} — {b.wardName} (${b.chargePerDay}/day)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Admit Patient *
            </label>
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.uhid}) — Age: {p.age}y
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Admission Reason & Clinical Indication *
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Acute exacerbation of COPD, post-catheterization monitoring"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-colors"
            >
              Admit Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
