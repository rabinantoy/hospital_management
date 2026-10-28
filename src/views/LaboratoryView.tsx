import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { LabOrder } from '../types';
import {
  FlaskConical,
  Search,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  Play
} from 'lucide-react';

interface Props {
  onOpenResultModal: (order: LabOrder) => void;
  onOpenReportModal: (order: LabOrder) => void;
}

export const LaboratoryView: React.FC<Props> = ({
  onOpenResultModal,
  onOpenReportModal
}) => {
  const {
    labOrders,
    labTests,
    patients,
    createLabOrder,
    updateLabOrderStatus
  } = useHospital();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showOrderModal, setShowOrderModal] = useState(false);

  // New order state
  const [testId, setTestId] = useState(labTests[0]?.id || '');
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [remarks, setRemarks] = useState('');

  const filtered = labOrders.filter(o => {
    const matchesSearch =
      o.testName.toLowerCase().includes(search.toLowerCase()) ||
      o.patientName.toLowerCase().includes(search.toLowerCase()) ||
      o.patientUhid.toLowerCase().includes(search.toLowerCase()) ||
      o.testCode.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testId || !patientId) return;
    createLabOrder(testId, patientId, remarks.trim() || undefined);
    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Diagnostic Pathology & Laboratory Services
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test ordering, specimen chain of custody, analytical testing, and formal clinical reporting
          </p>
        </div>
        <button
          onClick={() => setShowOrderModal(true)}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Order Diagnostic Test</span>
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
            placeholder="Search test name, code, patient, or UHID..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ORDERED">Ordered</option>
            <option value="SAMPLE_COLLECTED">Sample Collected</option>
            <option value="IN_ANALYSIS">In Analysis</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Test Code & Name</th>
                <th className="py-2.5">Patient Details</th>
                <th className="py-2.5">Ordering Doctor</th>
                <th className="py-2.5">Ordered Date</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-center">Result</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filtered.map(order => {
                const isCompleted = order.status === 'COMPLETED';
                return (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{order.testName}</div>
                      <div className="font-mono text-[10px] text-teal-600 font-bold">{order.testCode}</div>
                    </td>
                    <td className="py-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{order.patientName}</div>
                      <div className="font-mono text-[10px] text-slate-500">{order.patientUhid}</div>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">
                      {order.doctorName}
                    </td>
                    <td className="py-3 text-slate-500 font-mono text-[11px]">
                      {new Date(order.orderedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : order.status === 'IN_ANALYSIS'
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-center font-mono">
                      {isCompleted ? (
                        <span className="font-bold text-slate-900 dark:text-slate-100">{order.resultValue}</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Pending</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status === 'ORDERED' && (
                          <button
                            onClick={() => updateLabOrderStatus(order.id, 'SAMPLE_COLLECTED')}
                            className="px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 text-[11px] font-semibold"
                          >
                            Collect Specimen
                          </button>
                        )}
                        {order.status === 'SAMPLE_COLLECTED' && (
                          <button
                            onClick={() => updateLabOrderStatus(order.id, 'IN_ANALYSIS')}
                            className="px-2.5 py-1 rounded bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 text-[11px] font-semibold"
                          >
                            Analyze
                          </button>
                        )}
                        {order.status === 'IN_ANALYSIS' && (
                          <button
                            onClick={() => onOpenResultModal(order)}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold shadow-xs"
                          >
                            Enter Results
                          </button>
                        )}
                        {isCompleted && (
                          <button
                            onClick={() => onOpenReportModal(order)}
                            className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] font-semibold inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3 text-teal-600" />
                            <span>PDF</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Test Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-6">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-teal-600" />
                <span>Order Diagnostic Laboratory Test</span>
              </h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Patient *
                </label>
                <select
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.uhid})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Diagnostic Test Protocol *
                </label>
                <select
                  value={testId}
                  onChange={e => setTestId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {labTests.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code}) — ${t.price} · {t.sampleType}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Clinical Indication / Physician Remarks
                </label>
                <textarea
                  rows={2}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="e.g. Fasting specimen, evaluate lipid profile prior to statin dosage adjustment"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white font-bold rounded-lg"
                >
                  Issue Lab Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
