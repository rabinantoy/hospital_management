import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Invoice, LabOrder } from '../types';
import {
  User,
  Calendar,
  Pill,
  FileText,
  Receipt,
  CreditCard,
  Printer,
  ShieldCheck,
  Plus,
  AlertTriangle,
  Clock,
  HeartPulse
} from 'lucide-react';

interface Props {
  onOpenBookAppointmentModal: () => void;
  onOpenReportModal: (order: LabOrder) => void;
  onOpenInvoiceModal: (invoice: Invoice) => void;
  onOpenPaymentModal: (invoice: Invoice) => void;
}

export const PatientPortal: React.FC<Props> = ({
  onOpenBookAppointmentModal,
  onOpenReportModal,
  onOpenInvoiceModal,
  onOpenPaymentModal
}) => {
  const {
    patients,
    appointments,
    prescriptions,
    labOrders,
    invoices,
    updateAppointmentStatus
  } = useHospital();

  // Current patient (Robert Hastings by default or first patient in array)
  const currentPatient = patients[0] || {
    id: 'pat-1',
    uhid: 'CP-2026-0041',
    fullName: 'Robert Hastings',
    age: 52,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 (555) 912-4011',
    allergies: ['Penicillin'],
    chronicDiseases: ['Hypertension'],
    insuranceProvider: 'BlueShield Premier Health'
  };

  const [activePortalTab, setActivePortalTab] = useState<'appointments' | 'prescriptions' | 'lab' | 'billing'>('appointments');

  const myAppointments = appointments.filter(a => a.patientId === currentPatient.id || a.patientUhid === currentPatient.uhid);
  const myPrescriptions = prescriptions.filter(p => p.patientId === currentPatient.id || p.patientUhid === currentPatient.uhid);
  const myLabOrders = labOrders.filter(l => l.patientId === currentPatient.id || l.patientUhid === currentPatient.uhid);
  const myInvoices = invoices.filter(i => i.patientId === currentPatient.id || i.patientUhid === currentPatient.uhid);

  return (
    <div className="space-y-6">
      {/* Patient Health ID Card Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-teal-200 font-extrabold text-xl shrink-0">
            {currentPatient.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold tracking-tight">
                {currentPatient.fullName}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 font-semibold border border-teal-400/30">
                UHID: {currentPatient.uhid}
              </span>
            </div>
            <div className="text-xs text-teal-100/80 mt-1 flex flex-wrap items-center gap-3">
              <span>{currentPatient.age} yrs · {currentPatient.gender}</span>
              <span>·</span>
              <span className="font-mono font-bold">Blood Group: {currentPatient.bloodGroup}</span>
              <span>·</span>
              <span>Phone: {currentPatient.phone}</span>
            </div>
            <div className="text-[11px] text-teal-200/90 mt-2 flex flex-wrap items-center gap-2">
              <span className="font-bold">Allergies:</span>
              <span>{currentPatient.allergies.join(', ') || 'None'}</span>
              <span>·</span>
              <span className="font-bold">TPA Insurance:</span>
              <span>{currentPatient.insuranceProvider || 'Self-Pay'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenBookAppointmentModal}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-sm transition-colors self-start md:self-center shrink-0"
        >
          <Calendar className="w-4 h-4" />
          <span>Book New Consultation</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl max-w-xl">
        {[
          { id: 'appointments', label: 'My Bookings', count: myAppointments.length },
          { id: 'prescriptions', label: 'Prescriptions', count: myPrescriptions.length },
          { id: 'lab', label: 'Diagnostic Tests', count: myLabOrders.length },
          { id: 'billing', label: 'Bills & Invoices', count: myInvoices.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePortalTab(tab.id as any)}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activePortalTab === tab.id
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab 1: Appointments */}
      {activePortalTab === 'appointments' && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Consultation Schedule & Appointment History
            </h2>
            <button
              onClick={onOpenBookAppointmentModal}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Appointment Slot</span>
            </button>
          </div>

          <div className="space-y-3">
            {myAppointments.map(apt => (
              <div
                key={apt.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{apt.doctorName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold">
                      {apt.doctorSpecialization}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 uppercase">
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{apt.date} ({apt.startTime} - {apt.endTime})</span>
                    <span>·</span>
                    <span>Type: {apt.type}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Reason: {apt.reason}
                  </div>
                </div>

                {apt.status === 'SCHEDULED' && (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED')}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold self-end sm:self-center"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Prescriptions */}
      {activePortalTab === 'prescriptions' && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Active Digital Prescriptions
          </h2>

          <div className="space-y-4">
            {myPrescriptions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active prescriptions recorded.
              </div>
            ) : (
              myPrescriptions.map(rx => (
                <div
                  key={rx.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="font-mono text-xs font-bold text-teal-600">
                        Rx #{rx.id.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-600 dark:text-slate-400 ml-2">
                        Prescribed by {rx.doctorName}
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      rx.status === 'DISPENSED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {rx.status}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {rx.items.map(item => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {item.medicineName}
                          </div>
                          <div className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                            {item.frequency} · Duration: {item.durationDays} Days
                          </div>
                          {item.instructions && (
                            <div className="text-[10px] text-slate-400 mt-0.5 italic">
                              {item.instructions}
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                          {item.dosage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Lab Reports */}
      {activePortalTab === 'lab' && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Diagnostic Test Reports
          </h2>

          <div className="space-y-3">
            {myLabOrders.map(order => {
              const isCompleted = order.status === 'COMPLETED';
              return (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-slate-100">
                        {order.testName}
                      </span>
                      <span className="font-mono text-[10px] text-indigo-600">
                        {order.testCode}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 uppercase font-bold text-slate-600">
                        {order.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Ordered by {order.doctorName} on {new Date(order.orderedAt).toLocaleDateString()}
                    </div>
                    {isCompleted && (
                      <div className="text-xs mt-1">
                        Result: <strong className="font-mono text-slate-900 dark:text-slate-100">{order.resultValue}</strong> (Normal: {order.normalRange})
                      </div>
                    )}
                  </div>

                  {isCompleted && (
                    <button
                      onClick={() => onOpenReportModal(order)}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View & Print PDF</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Billing & Payments */}
      {activePortalTab === 'billing' && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Invoices & Settlement Ledger
          </h2>

          <div className="space-y-3">
            {myInvoices.map(inv => {
              const isPaid = inv.status === 'PAID';
              return (
                <div
                  key={inv.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        {inv.invoiceNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        isPaid
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Date: {new Date(inv.createdAt).toLocaleDateString()} · Items: {inv.items.length}
                    </div>
                    <div className="mt-1 font-mono text-sm font-extrabold text-teal-700 dark:text-teal-400">
                      ${inv.totalAmount.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onOpenInvoiceModal(inv)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Itemized Bill</span>
                    </button>

                    {!isPaid && (
                      <button
                        onClick={() => onOpenPaymentModal(inv)}
                        className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay Now ($ {inv.totalAmount.toFixed(2)})</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
