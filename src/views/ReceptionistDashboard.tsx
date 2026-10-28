import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  UserPlus,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Users,
  AlertCircle
} from 'lucide-react';

interface Props {
  onOpenRegisterModal: () => void;
  onOpenBookAppointmentModal: () => void;
}

export const ReceptionistDashboard: React.FC<Props> = ({
  onOpenRegisterModal,
  onOpenBookAppointmentModal
}) => {
  const {
    appointments,
    updateAppointmentStatus,
    patients,
    setActiveTab
  } = useHospital();

  const scheduledToday = appointments.filter(a => a.status === 'SCHEDULED');
  const checkedInToday = appointments.filter(a => a.status === 'CHECKED_IN');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Reception & Patient Admissions Desk
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Register outpatient walk-ins, manage doctor slots, and process check-ins
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRegisterModal}
            className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register New Patient</span>
          </button>
          <button
            onClick={onOpenBookAppointmentModal}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Awaiting Check-in
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-amber-600">
              {scheduledToday.length}
            </span>
            <span className="text-[11px] text-slate-400">Scheduled for today</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Checked-in & In Waiting Lounge
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-teal-600">
              {checkedInToday.length}
            </span>
            <span className="text-[11px] text-slate-400">Alerted Doctor/Nurse</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Total Patients in Registry
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              {patients.length}
            </span>
            <button
              onClick={() => setActiveTab('patients')}
              className="text-[11px] font-semibold text-teal-600 hover:underline"
            >
              Browse Registry →
            </button>
          </div>
        </div>
      </div>

      {/* Check-In Queue Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Today's Patient Arrival & Check-In Desk
            </h2>
            <p className="text-[11px] text-slate-400">
              Mark patient as arrived to notify physician and clinical triage
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {appointments.length} Appointments on file
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Time Slot</th>
                <th className="py-2.5">Patient Name</th>
                <th className="py-2.5">UHID</th>
                <th className="py-2.5">Doctor & Specialty</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Arrival Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {appointments.map(apt => {
                const isScheduled = apt.status === 'SCHEDULED';
                const isCheckedIn = apt.status === 'CHECKED_IN';
                const isInProgress = apt.status === 'IN_PROGRESS';
                const isCompleted = apt.status === 'COMPLETED';

                return (
                  <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {apt.startTime}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-slate-100">
                      {apt.patientName}
                      <span className="block text-[10px] text-slate-400 font-normal">{apt.type}</span>
                    </td>
                    <td className="py-3 font-mono text-teal-600 font-semibold">
                      {apt.patientUhid}
                    </td>
                    <td className="py-3">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{apt.doctorName}</div>
                      <div className="text-[10px] text-slate-400">{apt.doctorSpecialization}</div>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isInProgress
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                          : isCheckedIn
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {isScheduled && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'CHECKED_IN')}
                          className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs transition-colors"
                        >
                          Check In Patient
                        </button>
                      )}
                      {isCheckedIn && (
                        <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                          Waiting for Doctor
                        </span>
                      )}
                      {isInProgress && (
                        <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                          In Consultation Room
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[11px] font-semibold text-emerald-600">
                          Consult Completed
                        </span>
                      )}
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
