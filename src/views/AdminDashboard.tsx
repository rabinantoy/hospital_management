import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  Users,
  BedDouble,
  Receipt,
  AlertTriangle,
  Calendar,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  UserPlus,
  Stethoscope
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const AdminDashboard: React.FC<{
  onOpenRegisterModal: () => void;
  onOpenConsultModal: () => void;
}> = ({ onOpenRegisterModal, onOpenConsultModal }) => {
  const {
    patients,
    appointments,
    beds,
    invoices,
    medicines,
    auditLogs,
    setActiveTab
  } = useHospital();

  // Metrics
  const totalPatients = patients.length;
  const occupiedBeds = beds.filter(b => b.status === 'OCCUPIED').length;
  const totalBeds = beds.length;
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const todayAppointments = appointments.length;
  const lowStockCount = medicines.filter(m => m.stockQuantity <= m.reorderLevel).length;

  const totalRevenue = invoices
    .filter(i => i.status === 'PAID')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  // Chart Data
  const patientTrendData = [
    { day: 'Mon', outpatient: 42, inpatient: 12 },
    { day: 'Tue', outpatient: 58, inpatient: 15 },
    { day: 'Wed', outpatient: 63, inpatient: 18 },
    { day: 'Thu', outpatient: 51, inpatient: 14 },
    { day: 'Fri', outpatient: 70, inpatient: 22 },
    { day: 'Sat', outpatient: 38, inpatient: 19 },
    { day: 'Sun', outpatient: 29, inpatient: 16 }
  ];

  const departmentRevenueData = [
    { department: 'Cardiology', revenue: 14200 },
    { department: 'Neurology', revenue: 9800 },
    { department: 'Emergency', revenue: 18500 },
    { department: 'ICU / Wards', revenue: 24000 },
    { department: 'Pharmacy', revenue: 11300 },
    { department: 'Pathology Lab', revenue: 8600 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Hospital Executive Command Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time clinical throughput, bed census, pharmacy supply & HIPAA compliance oversight
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenRegisterModal}
            className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Patient</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className="px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
            <span>View Audit Trail</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Patients */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Registered Patients</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              {totalPatients}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              +14% mo/mo
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Unique UHID records on file</p>
        </div>

        {/* Bed Occupancy */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Ward Bed Census</span>
            <BedDouble className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              {occupancyRate}%
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {occupiedBeds}/{totalBeds} Beds
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${occupancyRate > 80 ? 'bg-amber-500' : 'bg-teal-600'}`}
              style={{ width: `${occupancyRate}%` }}
            ></div>
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Today's OPD Queue</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              {todayAppointments}
            </span>
            <span className="text-[11px] font-semibold text-teal-600 dark:text-teal-400">
              4 Specialists Active
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">OPD & Follow-ups scheduled</p>
        </div>

        {/* Settled Revenue */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Settled Revenue</span>
            <Receipt className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              ${totalRevenue.toFixed(0)}
            </span>
            <span className="text-[11px] font-mono text-emerald-600">
              Settled
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">From OPD, pharmacy, lab & bed stay</p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Footfall Trend Area Chart */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Weekly Clinical Volume Trends
              </h3>
              <p className="text-[11px] text-slate-400">
                Outpatient consultations vs Inpatient admissions
              </p>
            </div>
            <span className="text-[11px] text-teal-600 font-semibold font-mono">
              7-Day Average: 52/day
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOutpatient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInpatient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Area type="monotone" dataKey="outpatient" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#colorOutpatient)" name="Outpatients" />
                <Area type="monotone" dataKey="inpatient" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorInpatient)" name="Inpatients" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Revenue Breakdown */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Department Revenue Contribution ($)
              </h3>
              <p className="text-[11px] text-slate-400">
                Revenue generated across hospital cost centers
              </p>
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold font-mono">
              Total: $86.4K MTD
            </span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#1E293B',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Bar dataKey="revenue" fill="#0D9488" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Alerts & HIPAA Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pharmacy & Stock Alerts */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Pharmacy Stock Alerts
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('pharmacy')}
              className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              Inventory
            </button>
          </div>
          <div className="space-y-2">
            {medicines
              .filter(m => m.stockQuantity <= m.reorderLevel)
              .map(med => (
                <div
                  key={med.id}
                  className="p-2.5 rounded-lg border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">{med.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Batch: {med.batchNumber} · Exp: {med.expiryDate}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-rose-600 font-bold text-xs">
                      {med.stockQuantity} left
                    </span>
                    <span className="block text-[9px] text-slate-400">
                      Min: {med.reorderLevel}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* HIPAA Audit Stream Preview */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Recent HIPAA / DPDP Security Audit Stream
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('audit')}
              className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Full Ledger</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
            {auditLogs.slice(0, 4).map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {log.userName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">({log.userRole})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-md">
                    {log.details}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono">
                    {log.ipAddress}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
