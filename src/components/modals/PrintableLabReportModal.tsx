import React from 'react';
import { LabOrder } from '../../types';
import { useHospital } from '../../context/HospitalContext';
import { X, Printer, FlaskConical, CheckCircle2, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: LabOrder | null;
}

export const PrintableLabReportModal: React.FC<Props> = ({ isOpen, onClose, order }) => {
  const { labTests, patients } = useHospital();

  if (!isOpen || !order) return null;

  const testDef = labTests.find(t => t.id === order.testId);
  const patient = patients.find(p => p.id === order.patientId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-6">
        {/* Controls */}
        <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs font-bold text-slate-700">Official Laboratory Diagnostic Report</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Body */}
        <div className="p-8 space-y-6 text-xs bg-white text-slate-900">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-700 text-white font-bold flex items-center justify-center text-sm">
                  CP
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  CarePulse Department of Pathology & Laboratory Medicine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                ISO 15189 & CAP Accredited Clinical Testing Facility
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                Order ID: {order.id}
              </span>
              <div className="text-[11px] text-slate-500 mt-1">
                Issued: {new Date(order.completedAt || order.orderedAt).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Patient & Sample Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Patient Name</span>
              <span className="font-bold text-slate-900">{order.patientName}</span>
              <span className="font-mono text-teal-700 block text-[10px]">{order.patientUhid}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Demographics</span>
              <span className="text-slate-800">{patient?.age || 50} Yrs / {patient?.gender || 'Adult'}</span>
              <span className="text-slate-500 block text-[10px]">Blood: {patient?.bloodGroup || 'O+'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Specimen</span>
              <span className="text-slate-800">{testDef?.sampleType || 'Whole Blood'}</span>
              <span className="text-slate-500 block text-[10px]">Collected: {order.sampleCollectedAt ? new Date(order.sampleCollectedAt).toLocaleDateString() : 'Today'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Ordering Physician</span>
              <span className="text-slate-800 font-semibold">{order.doctorName}</span>
              <span className="text-slate-500 block text-[10px]">Outpatient Clinic</span>
            </div>
          </div>

          {/* Test Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-300 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5">Test Parameter</th>
                  <th className="py-2.5 text-center">Result Value</th>
                  <th className="py-2.5 text-center">Units</th>
                  <th className="py-2.5 text-center">Reference Interval</th>
                  <th className="py-2.5 text-right">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-3 font-bold text-slate-900">
                    {order.testName}
                    <span className="font-mono text-[10px] text-slate-400 ml-2">({order.testCode})</span>
                  </td>
                  <td className="py-3 text-center font-mono font-black text-sm text-slate-900">
                    {order.resultValue || 'Under Processing'}
                  </td>
                  <td className="py-3 text-center font-mono text-slate-500">
                    {order.unit || testDef?.unit || 'mg/dL'}
                  </td>
                  <td className="py-3 text-center font-mono text-slate-600 text-[11px]">
                    {order.normalRange || testDef?.normalRange}
                  </td>
                  <td className="py-3 text-right">
                    {order.isAbnormal ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> High / Abnormal
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Normal
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Clinical Impressions */}
          {order.clinicalRemarks && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Pathologist / Technologist Clinical Remarks
              </span>
              <p className="text-slate-800 leading-relaxed">
                {order.clinicalRemarks}
              </p>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-[10px] text-slate-400">
            <div>
              <div className="w-36 border-b border-slate-400 mb-1"></div>
              <span className="font-semibold text-slate-700">{order.technicianName || 'Kavita Patel, MLS(ASCP)'}</span>
              <div className="text-[9px]">Medical Laboratory Scientist</div>
            </div>
            <div className="text-right">
              <div className="w-36 border-b border-slate-400 mb-1 ml-auto"></div>
              <span className="font-semibold text-slate-700">Dr. Arthur Vance, MD, FACP</span>
              <div className="text-[9px]">Director of Clinical Laboratories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
