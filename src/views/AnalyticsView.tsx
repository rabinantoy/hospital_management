import React from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  BedDouble,
  Activity
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
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const { patients, beds, appointments, invoices } = useHospital();

  const footfallData = [
    { date: 'Oct 22', opd: 45, emergency: 12, admissions: 6 },
    { date: 'Oct 23', opd: 52, emergency: 14, admissions: 8 },
    { date: 'Oct 24', opd: 59, emergency: 16, admissions: 11 },
    { date: 'Oct 25', opd: 48, emergency: 11, admissions: 5 },
    { date: 'Oct 26', opd: 64, emergency: 19, admissions: 14 },
    { date: 'Oct 27', opd: 68, emergency: 21, admissions: 12 },
    { date: 'Oct 28', opd: 72, emergency: 18, admissions: 9 }
  ];

  const specialtyDistribution = [
    { name: 'Cardiology', count: 38, color: '#0D9488' },
    { name: 'Neurology', count: 24, color: '#3B82F6' },
    { name: 'Internal Med', count: 42, color: '#8B5CF6' },
    { name: 'Emergency', count: 29, color: '#F59E0B' },
    { name: 'Pediatrics', count: 18, color: '#EC4899' }
  ];

  const bedOccupancyByWard = [
    { ward: 'ICU', occupied: 2, total: 4 },
    { ward: 'General A', occupied: 3, total: 4 },
    { ward: 'General B', occupied: 2, total: 4 },
    { ward: 'Emergency', occupied: 1, total: 2 },
    { ward: 'Pediatric', occupied: 1, total: 2 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Executive Reports & Clinical Intelligence
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time patient throughput, clinical department workloads, and bed census trends
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Average Daily Patient Volume</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            68.4 / day
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">+8.2% vs previous week</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Bed Turnover Rate</span>
            <BedDouble className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            3.2 Days ALOS
          </div>
          <span className="text-[11px] text-teal-600 font-semibold">Average length of stay</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Clinical Billing Efficiency</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            94.6%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">Clean insurance claims</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Footfall Trend */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
            7-Day Patient Volume Breakdown
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">
            Outpatient (OPD), Emergency triage, and Inpatient admissions
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={footfallData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
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
                <Area type="monotone" dataKey="opd" stroke="#0D9488" fill="#0D9488" fillOpacity={0.2} name="OPD" />
                <Area type="monotone" dataKey="emergency" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Emergency" />
                <Area type="monotone" dataKey="admissions" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="Admissions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bed Occupancy by Ward */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-1">
            Ward Bed Capacity & Current Census
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">
            Occupied beds vs total capacity across specialized wards
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bedOccupancyByWard} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="ward" tick={{ fontSize: 11 }} />
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
                <Bar dataKey="occupied" fill="#0D9488" name="Occupied" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="#E2E8F0" name="Total Capacity" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
