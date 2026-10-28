import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Activity,
  BedDouble,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Plus,
  UserCheck
} from 'lucide-react';

interface Props {
  onRecordVitals: (patientId?: string) => void;
  onAdmitBed: (bedId?: string) => void;
}

export const NurseDashboard: React.FC<Props> = ({ onRecordVitals, onAdmitBed }) => {
  const {
    currentUser,
    beds,
    dischargeFromBed,
    vitals,
    patients
  } = useHospital();

  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED');
  const availableBeds = beds.filter(b => b.status === 'AVAILABLE');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <HeartPulse className="w-4 h-4" />
            <span>Nurse Clinical Care Station</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            Inpatient Ward Floor & Triage Monitor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nurse in charge: {currentUser.name} · Unit: {currentUser.department}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onRecordVitals()}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Record Vital Signs</span>
          </button>
          <button
            onClick={() => onAdmitBed()}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <BedDouble className="w-3.5 h-3.5 text-teal-600" />
            <span>Admit to Bed</span>
          </button>
        </div>
      </div>

      {/* Ward Beds Visual Grid */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Live Ward & Bed Occupancy Map
            </h2>
            <p className="text-[11px] text-slate-400">
              {occupiedBeds.length} Occupied · {availableBeds.length} Ready for Admission
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Occupied
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Cleaning / Sanitizing
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {beds.map(bed => {
            const isOccupied = bed.status === 'OCCUPIED';
            const isAvailable = bed.status === 'AVAILABLE';
            const isCleaning = bed.status === 'CLEANING' || bed.status === 'MAINTENANCE';

            return (
              <div
                key={bed.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isOccupied
                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20'
                    : isAvailable
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                    : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {bed.bedNumber}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    isOccupied
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                      : isAvailable
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {bed.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  {bed.wardName}
                </div>

                {isOccupied ? (
                  <div className="mt-2.5 pt-2.5 border-t border-rose-200/60 dark:border-rose-900/40 text-xs">
                    <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                      {bed.currentPatientName}
                    </div>
                    <div className="font-mono text-[10px] text-teal-600 dark:text-teal-400">
                      {bed.currentPatientUhid}
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onRecordVitals(bed.currentPatientId)}
                        className="px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                      >
                        Vitals
                      </button>
                      <button
                        onClick={() => dischargeFromBed(bed.id)}
                        className="px-2 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-semibold"
                      >
                        Discharge
                      </button>
                    </div>
                  </div>
                ) : isAvailable ? (
                  <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-xs">
                    <span className="font-mono text-[10px] text-slate-500">${bed.chargePerDay}/day</span>
                    <button
                      onClick={() => onAdmitBed(bed.id)}
                      className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                    >
                      Assign Patient
                    </button>
                  </div>
                ) : (
                  <div className="mt-2.5 pt-2.5 border-t border-amber-200/60 dark:border-amber-900/40 text-[10px] text-amber-700 dark:text-amber-300">
                    Bed sanitization in progress
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Vitals Recorded Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Patient Vitals Observation Log
          </h3>
          <span className="text-[11px] text-slate-400">
            Recorded by Nursing Staff
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2">UHID / Patient</th>
                <th className="py-2 text-center">BP (mmHg)</th>
                <th className="py-2 text-center">Heart Rate</th>
                <th className="py-2 text-center">SpO2</th>
                <th className="py-2 text-center">Temp</th>
                <th className="py-2 text-center">BMI</th>
                <th className="py-2 text-right">Recorded At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {vitals.map(v => {
                const patient = patients.find(p => p.id === v.patientId);
                const isHighBp = v.systolicBp > 140 || v.diastolicBp > 90;
                const isLowO2 = v.oxygenSpO2 < 95;

                return (
                  <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 font-sans">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{patient?.fullName || 'Patient'}</div>
                      <div className="text-[10px] font-mono text-teal-600">{v.patientUhid}</div>
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={isHighBp ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                        {v.systolicBp}/{v.diastolicBp}
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-slate-700 dark:text-slate-300">
                      {v.heartRate} bpm
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={isLowO2 ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                        {v.oxygenSpO2}%
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-slate-700 dark:text-slate-300">
                      {v.temperatureF}°F
                    </td>
                    <td className="py-2.5 text-center text-teal-600 font-bold">
                      {v.bmi}
                    </td>
                    <td className="py-2.5 text-right font-sans text-[11px] text-slate-500">
                      {new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
