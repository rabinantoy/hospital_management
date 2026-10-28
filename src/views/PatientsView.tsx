import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Patient } from '../types';
import {
  Users,
  Search,
  UserPlus,
  ShieldAlert,
  FileText,
  Phone,
  HeartPulse,
  ChevronRight,
  X
} from 'lucide-react';

interface Props {
  onOpenRegisterModal: () => void;
  onRecordVitals: (patientId: string) => void;
  onStartConsult: (patientId: string) => void;
}

export const PatientsView: React.FC<Props> = ({
  onOpenRegisterModal,
  onRecordVitals,
  onStartConsult
}) => {
  const { patients, vitals, logAudit } = useHospital();

  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('ALL');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filtered = patients.filter(p => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.uhid.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchesBlood = bloodFilter === 'ALL' || p.bloodGroup === bloodFilter;
    return matchesSearch && matchesBlood;
  });

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    logAudit('VIEW', 'PATIENT', patient.id, `Inspected detailed medical record for ${patient.fullName}`, patient.id, patient.uhid);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Patient Registry & Medical Records (EMR)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Centralized Electronic Health Records compliant with HIPAA & DPDP standards
          </p>
        </div>
        <button
          onClick={onOpenRegisterModal}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register Patient</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by UHID (CP-2026-...), patient name, or phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Blood Group:</span>
          <select
            value={bloodFilter}
            onChange={e => setBloodFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-none"
          >
            <option value="ALL">All Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Patient List + Details Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table / List */}
        <div className={`p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${selectedPatient ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5">UHID / Name</th>
                  <th className="py-2.5">Demographics</th>
                  <th className="py-2.5">Blood</th>
                  <th className="py-2.5">Contact Phone</th>
                  <th className="py-2.5">Clinical Alerts</th>
                  <th className="py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filtered.map(patient => (
                  <tr
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`cursor-pointer transition-colors ${
                      selectedPatient?.id === patient.id
                        ? 'bg-teal-50/60 dark:bg-teal-950/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{patient.fullName}</div>
                      <div className="font-mono text-[10px] text-teal-600 font-bold">{patient.uhid}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {patient.age}y · {patient.gender}
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {patient.bloodGroup}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {patient.phone}
                    </td>
                    <td className="py-3">
                      <div className="text-[10px] text-rose-600 dark:text-rose-400 truncate max-w-xs font-semibold">
                        {patient.allergies.join(', ') || 'NKDA'}
                      </div>
                      {patient.chronicDiseases.length > 0 && (
                        <div className="text-[9px] text-slate-400 truncate max-w-xs">
                          {patient.chronicDiseases.join(' · ')}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleSelectPatient(patient);
                        }}
                        className="text-teal-600 dark:text-teal-400 font-semibold text-xs hover:underline inline-flex items-center gap-0.5"
                      >
                        <span>Inspect EMR</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Patient Clinical EMR Drawer */}
        {selectedPatient && (
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-mono text-[10px] font-bold text-teal-600 block">
                  {selectedPatient.uhid}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedPatient.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onRecordVitals(selectedPatient.id)}
                className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1 shadow-xs"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Record Vitals</span>
              </button>
              <button
                onClick={() => onStartConsult(selectedPatient.id)}
                className="py-1.5 px-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-[11px] flex items-center justify-center gap-1 shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>New Consult</span>
              </button>
            </div>

            {/* Clinical Overview */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Emergency Next of Kin
                </span>
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relationship})
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {selectedPatient.emergencyContact.phone}
                </div>
              </div>

              <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <span className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400 block">
                  Documented Drug Allergies
                </span>
                <div className="text-rose-800 dark:text-rose-300 font-semibold mt-0.5">
                  {selectedPatient.allergies.join(', ') || 'No Known Drug Allergies'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Chronic Pathologies
                </span>
                <div className="text-slate-800 dark:text-slate-200">
                  {selectedPatient.chronicDiseases.join(', ') || 'None reported'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  Insurance TPA
                </span>
                <div className="text-slate-800 dark:text-slate-200 font-medium">
                  {selectedPatient.insuranceProvider || 'Self-Pay / Uninsured'}
                </div>
                {selectedPatient.insurancePolicyNumber && (
                  <div className="font-mono text-[10px] text-teal-600">
                    Policy: {selectedPatient.insurancePolicyNumber}
                  </div>
                )}
              </div>

              {/* Uploaded Documents */}
              {selectedPatient.documents && selectedPatient.documents.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Uploaded Medical Documents
                  </span>
                  <div className="space-y-1.5">
                    {selectedPatient.documents.map(doc => (
                      <div
                        key={doc.id}
                        className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]"
                      >
                        <div className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-teal-600" />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{doc.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{doc.fileSize}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
