import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { AppointmentStatus, AppointmentType } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';

interface Props {
  onOpenBookAppointmentModal: () => void;
}

export const AppointmentsView: React.FC<Props> = ({ onOpenBookAppointmentModal }) => {
  const {
    appointments,
    updateAppointmentStatus,
    users
  } = useHospital();

  const doctors = users.filter(u => u.role === 'DOCTOR');

  const [selectedDoctor, setSelectedDoctor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  const filtered = appointments.filter(apt => {
    const matchesDoc = selectedDoctor === 'ALL' || apt.doctorId === selectedDoctor;
    const matchesStatus = selectedStatus === 'ALL' || apt.status === selectedStatus;
    const matchesSearch =
      apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
      apt.patientUhid.toLowerCase().includes(search.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(search.toLowerCase());
    return matchesDoc && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Hospital Appointment Master & Slot Scheduler
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage outpatient queues, doctor availability slots, and clinical follow-ups
          </p>
        </div>
        <button
          onClick={onOpenBookAppointmentModal}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Book Appointment Slot</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search patient name, UHID, or doctor..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Physician:</span>
            <select
              value={selectedDoctor}
              onChange={e => setSelectedDoctor(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Physicians</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialization})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Date & Slot</th>
                <th className="py-2.5">Patient Details</th>
                <th className="py-2.5">Attending Doctor</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Chief Complaint</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filtered.map(apt => (
                <tr key={apt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 font-mono">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{apt.date}</div>
                    <div className="text-[11px] text-teal-600 font-semibold">{apt.startTime} - {apt.endTime}</div>
                  </td>
                  <td className="py-3 font-sans">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{apt.patientName}</div>
                    <div className="font-mono text-[10px] text-teal-600">{apt.patientUhid}</div>
                  </td>
                  <td className="py-3 font-sans">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{apt.doctorName}</div>
                    <div className="text-[10px] text-slate-400">{apt.doctorSpecialization}</div>
                  </td>
                  <td className="py-3 font-sans text-slate-600 dark:text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                      {apt.type}
                    </span>
                  </td>
                  <td className="py-3 font-sans text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {apt.reason}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      apt.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : apt.status === 'IN_PROGRESS'
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300'
                        : apt.status === 'CHECKED_IN'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : apt.status === 'CANCELLED'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {apt.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {apt.status === 'SCHEDULED' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'CHECKED_IN')}
                          className="px-2.5 py-1 rounded bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 hover:bg-teal-100 text-[11px] font-semibold"
                        >
                          Check In
                        </button>
                      )}
                      {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED')}
                          className="px-2 py-1 rounded text-slate-400 hover:text-rose-500 text-[11px]"
                          title="Cancel appointment"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
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
