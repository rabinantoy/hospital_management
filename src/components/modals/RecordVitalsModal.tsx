import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { X, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
}

export const RecordVitalsModal: React.FC<Props> = ({ isOpen, onClose, preselectedPatientId }) => {
  const { patients, recordVitals } = useHospital();

  const [patientId, setPatientId] = useState(preselectedPatientId || (patients[0]?.id || ''));
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [diastolicBp, setDiastolicBp] = useState<number>(80);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [temperatureF, setTemperatureF] = useState<number>(98.6);
  const [oxygenSpO2, setOxygenSpO2] = useState<number>(98);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(16);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightCm, setHeightCm] = useState<number>(172);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Real-time BMI calculation
  const heightM = heightCm / 100;
  const computedBmi = heightM > 0 ? (weightKg / (heightM * heightM)).toFixed(1) : '22.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;

    recordVitals({
      patientId: patient.id,
      patientUhid: patient.uhid,
      systolicBp: Number(systolicBp),
      diastolicBp: Number(diastolicBp),
      heartRate: Number(heartRate),
      temperatureF: Number(temperatureF),
      oxygenSpO2: Number(oxygenSpO2),
      respiratoryRate: Number(respiratoryRate),
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Record Patient Vital Signs
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Clinical triage observation and monitoring
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
          {/* Patient */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Patient *
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

          {/* Blood Pressure & Heart Rate */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Systolic (mmHg)
              </label>
              <input
                type="number"
                min="60"
                max="260"
                required
                value={systolicBp}
                onChange={e => setSystolicBp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Diastolic (mmHg)
              </label>
              <input
                type="number"
                min="40"
                max="160"
                required
                value={diastolicBp}
                onChange={e => setDiastolicBp(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Heart Rate (BPM)
              </label>
              <input
                type="number"
                min="30"
                max="220"
                required
                value={heartRate}
                onChange={e => setHeartRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Temperature, SpO2 & Respiratory Rate */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Temp (°F)
              </label>
              <input
                type="number"
                step="0.1"
                min="92"
                max="108"
                required
                value={temperatureF}
                onChange={e => setTemperatureF(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Oxygen SpO2 (%)
              </label>
              <input
                type="number"
                min="60"
                max="100"
                required
                value={oxygenSpO2}
                onChange={e => setOxygenSpO2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resp Rate (/min)
              </label>
              <input
                type="number"
                min="8"
                max="60"
                required
                value={respiratoryRate}
                onChange={e => setRespiratoryRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Weight, Height & Computed BMI */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.5"
                min="2"
                max="300"
                value={weightKg}
                onChange={e => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Height (cm)
              </label>
              <input
                type="number"
                min="40"
                max="240"
                value={heightCm}
                onChange={e => setHeightCm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-center focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Computed BMI
              </label>
              <div className="w-full px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-teal-700 dark:text-teal-400 font-mono font-bold text-center">
                {computedBmi}
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Observation / Nurse Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Patient is ambulatory, slightly tachycardic, states compliant with medications."
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
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-colors"
            >
              Save Vital Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
