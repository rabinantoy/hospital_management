import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { User, Role } from '../types';
import {
  Stethoscope,
  Users,
  Search,
  Plus,
  ShieldCheck,
  Calendar,
  Clock,
  Phone,
  Mail
} from 'lucide-react';

export const StaffView: React.FC = () => {
  const { users, currentUser } = useHospital();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filtered = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase())) ||
      (u.specialization && u.specialization.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Doctors & Clinical Healthcare Staff
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Staff roster, medical licenses, departmental rosters, and duty shifts
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search staff by name, department, or specialization..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium">Role:</span>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
          >
            <option value="ALL">All Staff Roles</option>
            <option value="ADMIN">Administration</option>
            <option value="DOCTOR">Physicians / Doctors</option>
            <option value="NURSE">Nursing Staff</option>
            <option value="PHARMACIST">Pharmacists</option>
            <option value="LAB_TECH">Lab Technicians</option>
            <option value="RECEPTIONIST">Reception & Front Desk</option>
          </select>
        </div>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(staff => (
          <div
            key={staff.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-800 dark:text-teal-200 font-extrabold text-sm shrink-0">
                {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {staff.name}
                  </h3>
                </div>
                <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">
                  {staff.specialization || staff.role}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {staff.department}
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Shift: {staff.shift || 'General Hours'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-[11px]">{staff.email}</span>
              </div>
              {staff.licenseNumber && (
                <div className="flex items-center gap-2 font-mono text-[10px] text-teal-600">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>License: {staff.licenseNumber}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {staff.role}
              </span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active On Duty
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
