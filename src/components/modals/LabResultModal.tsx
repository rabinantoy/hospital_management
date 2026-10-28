import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { LabOrder } from '../../types';
import { X, FlaskConical, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: LabOrder | null;
}

export const LabResultModal: React.FC<Props> = ({ isOpen, onClose, order }) => {
  const { labTests, submitLabResult } = useHospital();

  const testDef = labTests.find(t => t.id === order?.testId);

  const [resultValue, setResultValue] = useState('');
  const [isAbnormal, setIsAbnormal] = useState(false);
  const [remarks, setRemarks] = useState('All parameters within standard reference intervals.');

  if (!isOpen || !order) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resultValue.trim()) return;

    submitLabResult(
      order.id,
      resultValue.trim(),
      isAbnormal,
      remarks.trim() || 'Completed according to standard operating diagnostic protocol.'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Enter Diagnostic Lab Results
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {order.testName} ({order.testCode})
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
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">Patient</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{order.patientName}</span>
                <span className="font-mono text-teal-600 block text-[10px]">{order.patientUhid}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Ordering Physician</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{order.doctorName}</span>
              </div>
            </div>
          </div>

          {testDef && (
            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
              <div className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-1">
                Standard Reference Interval
              </div>
              <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                {testDef.normalRange}
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quantitative / Qualitative Diagnostic Value *
            </label>
            <input
              type="text"
              required
              value={resultValue}
              onChange={e => setResultValue(e.target.value)}
              placeholder="e.g. 5.8% (or 14.2 g/dL, 185 mg/dL)"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isAbnormal"
              checked={isAbnormal}
              onChange={e => setIsAbnormal(e.target.checked)}
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
            />
            <label htmlFor="isAbnormal" className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
              <AlertTriangle className={`w-3.5 h-3.5 ${isAbnormal ? 'text-rose-500' : 'text-slate-400'}`} />
              <span>Flag as Abnormal / Critical Value (Triggers urgent clinical alert)</span>
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Pathology Remarks / Impression
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Verified by repeat assay. Correlate with clinical findings."
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
              Authorize & Issue Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
