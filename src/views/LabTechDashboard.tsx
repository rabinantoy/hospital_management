import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { LabOrder } from '../types';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  Printer,
  AlertTriangle,
  Play
} from 'lucide-react';

interface Props {
  onOpenResultModal: (order: LabOrder) => void;
  onOpenReportModal: (order: LabOrder) => void;
}

export const LabTechDashboard: React.FC<Props> = ({
  onOpenResultModal,
  onOpenReportModal
}) => {
  const {
    labOrders,
    updateLabOrderStatus,
    labTests,
    currentUser
  } = useHospital();

  const pendingOrders = labOrders.filter(o => o.status !== 'COMPLETED');
  const completedOrders = labOrders.filter(o => o.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <FlaskConical className="w-4 h-4" />
            <span>Pathology & Diagnostic Laboratory Console</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Diagnostic Test Orders & Specimen Processing
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Technologist: {currentUser.name} · Department: {currentUser.department}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending Assays</span>
            <span className="text-xl font-mono font-black text-amber-600">
              {pendingOrders.length}
            </span>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Authorized Reports</span>
            <span className="text-xl font-mono font-black text-emerald-600">
              {completedOrders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Active Worklist Orders */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Diagnostic Specimen Worklist
            </h2>
            <p className="text-[11px] text-slate-400">
              Track sample collection, assay processing, and record quantitative values
            </p>
          </div>
          <span className="text-[11px] font-mono text-indigo-600 font-bold">
            {pendingOrders.length} In Pipeline
          </span>
        </div>

        <div className="space-y-3">
          {pendingOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No pending laboratory specimens in queue.
            </div>
          ) : (
            pendingOrders.map(order => {
              const test = labTests.find(t => t.id === order.testId);
              return (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {order.testCode}
                      </span>
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {order.testName}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase font-bold">
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      Patient: <strong className="text-slate-800 dark:text-slate-200">{order.patientName}</strong> ({order.patientUhid}) · Physician: {order.doctorName}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-1 font-mono">
                      Specimen: {test?.sampleType || 'Whole Blood'} · Normal Range: {test?.normalRange}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {order.status === 'ORDERED' && (
                      <button
                        onClick={() => updateLabOrderStatus(order.id, 'SAMPLE_COLLECTED')}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
                      >
                        Collect Sample
                      </button>
                    )}

                    {order.status === 'SAMPLE_COLLECTED' && (
                      <button
                        onClick={() => updateLabOrderStatus(order.id, 'IN_ANALYSIS')}
                        className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Run Assay</span>
                      </button>
                    )}

                    {order.status === 'IN_ANALYSIS' && (
                      <button
                        onClick={() => onOpenResultModal(order)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
                      >
                        Enter Results & Finalize
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Authorized Completed Lab Reports Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Completed Diagnostic Reports
          </h3>
          <span className="text-[11px] text-slate-400">
            Authorized by Laboratory Medicine
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Test & Patient</th>
                <th className="py-2.5 text-center">Result Value</th>
                <th className="py-2.5 text-center">Reference Interval</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-right">View / Print</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {completedOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-sans">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{order.testName}</div>
                    <div className="text-[10px] text-slate-400">{order.patientName} ({order.patientUhid})</div>
                  </td>
                  <td className="py-3 text-center font-bold text-sm text-slate-900 dark:text-slate-100">
                    {order.resultValue}
                  </td>
                  <td className="py-3 text-center text-slate-500 text-[11px]">
                    {order.normalRange || '< 5.7%'}
                  </td>
                  <td className="py-3 text-center">
                    {order.isAbnormal ? (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-bold">
                        ABNORMAL
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">
                        NORMAL
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-right font-sans">
                    <button
                      onClick={() => onOpenReportModal(order)}
                      className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3 text-teal-600" />
                      <span>Print PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
