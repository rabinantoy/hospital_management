import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { BedStatus } from '../types';
import {
  BedDouble,
  Activity,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface Props {
  onAdmitBed: (bedId?: string) => void;
  onRecordVitals: (patientId: string) => void;
}

export const WardsView: React.FC<Props> = ({ onAdmitBed, onRecordVitals }) => {
  const {
    beds,
    dischargeFromBed,
    updateBedStatus
  } = useHospital();

  const [selectedWardType, setSelectedWardType] = useState<string>('ALL');

  const filteredBeds = beds.filter(
    b => selectedWardType === 'ALL' || b.wardType === selectedWardType
  );

  const total = beds.length;
  const occupied = beds.filter(b => b.status === 'OCCUPIED').length;
  const available = beds.filter(b => b.status === 'AVAILABLE').length;
  const cleaning = beds.filter(b => b.status === 'CLEANING' || b.status === 'MAINTENANCE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Ward & Inpatient Bed Census Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ICU telemetry, acute emergency bays, and general medical beds
          </p>
        </div>
        <button
          onClick={() => onAdmitBed()}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Admit Patient to Bed</span>
        </button>
      </div>

      {/* Capacity Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 block">Total Hospital Beds</span>
          <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 mt-1 block">
            {total}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20">
          <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 block">Ready & Available</span>
          <span className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400 mt-1 block">
            {available}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20">
          <span className="text-xs font-semibold text-rose-800 dark:text-rose-300 block">Currently Occupied</span>
          <span className="text-2xl font-black font-mono text-rose-700 dark:text-rose-400 mt-1 block">
            {occupied}
          </span>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
          <span className="text-xs font-semibold text-amber-800 dark:text-amber-300 block">Sanitizing / Turnover</span>
          <span className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400 mt-1 block">
            {cleaning}
          </span>
        </div>
      </div>

      {/* Ward Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto">
        {[
          { id: 'ALL', label: 'All Wards' },
          { id: 'ICU', label: 'Intensive Care Unit (ICU)' },
          { id: 'GENERAL', label: 'General Medical Wards' },
          { id: 'EMERGENCY', label: 'Emergency Trauma Bays' },
          { id: 'PEDIATRIC', label: 'Pediatric Care Ward' }
        ].map(w => (
          <button
            key={w.id}
            onClick={() => setSelectedWardType(w.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedWardType === w.id
                ? 'bg-white dark:bg-slate-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Interactive Bed Map */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredBeds.map(bed => {
          const isOccupied = bed.status === 'OCCUPIED';
          const isAvailable = bed.status === 'AVAILABLE';
          const isCleaning = bed.status === 'CLEANING' || bed.status === 'MAINTENANCE';

          return (
            <div
              key={bed.id}
              className={`p-4 rounded-2xl border transition-all ${
                isOccupied
                  ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20'
                  : isAvailable
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {bed.bedNumber}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  isOccupied
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : isAvailable
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  {bed.status}
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">
                {bed.wardName}
              </div>

              <div className="mt-1 font-mono text-[11px] text-slate-500">
                Rate: ${bed.chargePerDay}/day
              </div>

              {isOccupied ? (
                <div className="mt-3 pt-3 border-t border-rose-200/60 dark:border-rose-900/40 text-xs">
                  <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                    {bed.currentPatientName}
                  </div>
                  <div className="font-mono text-[10px] text-teal-600 dark:text-teal-400">
                    {bed.currentPatientUhid}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-500">
                    Admitted: {bed.admittedAt ? new Date(bed.admittedAt).toLocaleDateString() : 'Active'}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onRecordVitals(bed.currentPatientId!)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    >
                      Log Vitals
                    </button>
                    <button
                      onClick={() => dischargeFromBed(bed.id)}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-semibold shadow-xs"
                    >
                      Discharge Bed
                    </button>
                  </div>
                </div>
              ) : isAvailable ? (
                <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                    Vacant & Clean
                  </span>
                  <button
                    onClick={() => onAdmitBed(bed.id)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-semibold shadow-xs"
                  >
                    Admit Patient
                  </button>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                  <span className="text-[10px] text-amber-700 dark:text-amber-300">
                    Cleaning in progress
                  </span>
                  <button
                    onClick={() => updateBedStatus(bed.id, 'AVAILABLE')}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Mark Ready
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
