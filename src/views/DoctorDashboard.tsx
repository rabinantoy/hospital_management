import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Activity,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus
} from 'lucide-react';

interface Props {
  onStartConsult: (patientId: string, appointmentId: string) => void;
  onRecordVitals: (patientId: string) => void;
}

export const DoctorDashboard: React.FC<Props> = ({ onStartConsult, onRecordVitals }) => {
  const {
    currentUser,
    appointments,
    updateAppointmentStatus,
    consultations,
    vitals,
    patients
  } = useHospital();

  // Appointments for this doctor
  const myAppointments = appointments.filter(
    a => a.doctorId === currentUser.id || currentUser.role === 'ADMIN'
  );

  const pendingQueue = myAppointments.filter(
    a => a.status === 'CHECKED_IN' || a.status === 'IN_PROGRESS' || a.status === 'SCHEDULED'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold">
            <Stethoscope className="w-4 h-4" />
            <span>Physician Clinical Workspace</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold mt-1 tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-teal-100/80 mt-0.5">
            Specialty: {currentUser.specialization || 'Attending Physician'} · Shift: {currentUser.shift || '08:30 - 16:30'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10">
            <div className="text-xl font-black font-mono">{pendingQueue.length}</div>
            <div className="text-[10px] uppercase font-bold text-teal-200">Patients in Queue</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl text-center border border-white/10">
            <div className="text-xl font-black font-mono">
              {myAppointments.filter(a => a.status === 'COMPLETED').length}
            </div>
            <div className="text-[10px] uppercase font-bold text-teal-200">Completed Today</div>
          </div>
        </div>
      </div>

      {/* Appointment Consultation Queue */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Today's Consultation Queue & Agenda
            </h2>
            <p className="text-[11px] text-slate-400">
              Patients waiting for triage, consultation or prescription authorization
            </p>
          </div>
          <span className="text-[11px] font-mono font-semibold text-teal-600 dark:text-teal-400">
            {myAppointments.length} Bookings
          </span>
        </div>

        <div className="space-y-3">
          {myAppointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              No appointments scheduled for your profile today.
            </div>
          ) : (
            myAppointments.map(apt => {
              const patient = patients.find(p => p.id === apt.patientId);
              const latestVital = vitals.find(v => v.patientId === apt.patientId);

              const isWaiting = apt.status === 'CHECKED_IN';
              const isInProgress = apt.status === 'IN_PROGRESS';
              const isCompleted = apt.status === 'COMPLETED';

              return (
                <div
                  key={apt.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isInProgress
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 shadow-xs'
                      : isWaiting
                      ? 'border-amber-300 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-950/10'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Patient & Booking Details */}
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold text-xs shrink-0">
                        {apt.patientName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {apt.patientName}
                          </span>
                          <span className="font-mono text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                            {apt.patientUhid}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                            {apt.type}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : isInProgress
                              ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                              : isWaiting
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {apt.status.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono font-medium">{apt.startTime} - {apt.endTime}</span>
                          <span>·</span>
                          <span>Complaint: {apt.reason}</span>
                        </div>

                        {/* Patient Vitals Snippet */}
                        {latestVital && (
                          <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2 font-mono">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Latest Vitals:</span>
                            <span>BP: {latestVital.systolicBp}/{latestVital.diastolicBp}</span>
                            <span>·</span>
                            <span>HR: {latestVital.heartRate} bpm</span>
                            <span>·</span>
                            <span>SpO2: {latestVital.oxygenSpO2}%</span>
                            <span>·</span>
                            <span>Temp: {latestVital.temperatureF}°F</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onRecordVitals(apt.patientId)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Activity className="w-3 h-3 text-teal-600" />
                        <span>Vitals</span>
                      </button>

                      {!isCompleted && (
                        <button
                          onClick={() => {
                            updateAppointmentStatus(apt.id, 'IN_PROGRESS');
                            onStartConsult(apt.patientId, apt.id);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                        >
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span>{isInProgress ? 'Resume Consult' : 'Start Consult'}</span>
                        </button>
                      )}

                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Consulted</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Recent Consultations History */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-3">
          Completed Clinical Diagnoses & Encounter Summaries
        </h3>
        <div className="space-y-3">
          {consultations.map(c => (
            <div
              key={c.id}
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                  <span>{c.patientName}</span>
                  <span className="font-mono text-[10px] text-teal-600">{c.patientUhid}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(c.consultedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                </span>
              </div>
              <div className="mt-1 font-semibold text-teal-700 dark:text-teal-400 text-[11px]">
                Diagnosis: {c.diagnosis}
              </div>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {c.clinicalNotes}
              </p>
              <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-2">
                <span>Treatment: {c.treatmentPlan}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
