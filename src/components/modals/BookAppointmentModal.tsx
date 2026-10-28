import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { AppointmentType } from '../../types';
import { X, Calendar, Clock, Stethoscope } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedPatientId?: string;
  preselectedDoctorId?: string;
}

export const BookAppointmentModal: React.FC<Props> = ({
  isOpen,
  onClose,
  preselectedPatientId,
  preselectedDoctorId
}) => {
  const { patients, users, bookAppointment } = useHospital();

  const doctors = users.filter(u => u.role === 'DOCTOR');

  const [patientId, setPatientId] = useState(preselectedPatientId || (patients[0]?.id || ''));
  const [doctorId, setDoctorId] = useState(preselectedDoctorId || (doctors[0]?.id || ''));
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState('09:30');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('OPD');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const availableSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.id === patientId);
    const doctor = doctors.find(d => d.id === doctorId);

    if (!patient || !doctor || !reason.trim()) return;

    // Slot end time is 30 mins after start time
    const [hours, minutes] = selectedSlot.split(':').map(Number);
    const endMinutes = minutes + 30;
    const endHour = hours + Math.floor(endMinutes / 60);
    const formattedEndMin = (endMinutes % 60).toString().padStart(2, '0');
    const endTime = `${endHour.toString().padStart(2, '0')}:${formattedEndMin}`;

    bookAppointment({
      patientId: patient.id,
      patientName: patient.fullName,
      patientUhid: patient.uhid,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization || 'General Medicine',
      date,
      startTime: selectedSlot,
      endTime,
      status: 'SCHEDULED',
      type: appointmentType,
      reason: reason.trim(),
      notes: notes.trim() || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Schedule Medical Consultation
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Book outpatient or follow-up doctor slot
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Patient Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Patient *
            </label>
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.uhid}) — Age: {p.age}, Blood: {p.bloodGroup}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Attending Physician & Specialty *
            </label>
            <select
              value={doctorId}
              onChange={e => setDoctorId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} — {d.specialization} ({d.department})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Visit Category *
              </label>
              <select
                value={appointmentType}
                onChange={e => setAppointmentType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              >
                <option value="OPD">Outpatient (OPD)</option>
                <option value="Follow-up">Clinical Follow-up</option>
                <option value="Routine Checkup">Routine Physical Checkup</option>
                <option value="Emergency">Urgent / Emergency Review</option>
              </select>
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Select Available Time Slot (30 Mins)</span>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono">
                Selected: {selectedSlot}
              </span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {availableSlots.map(slot => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-1.5 px-2 rounded-md font-mono text-xs transition-colors border ${
                    selectedSlot === slot
                      ? 'bg-teal-600 text-white border-teal-600 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-500'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Primary Symptoms / Chief Complaint *
            </label>
            <input
              type="text"
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Chest tightness on climbing stairs, recurrent headaches"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Internal Clinical / Triage Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Referral notes, previous medications, or specific test requirements"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Actions */}
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
              className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm transition-colors"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
