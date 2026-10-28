import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import {
  ShieldAlert,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Lock,
  Calendar
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useHospital();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filtered = auditLogs.filter(log => {
    const matchesSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      (log.patientUhid && log.patientUhid.toLowerCase().includes(search.toLowerCase())) ||
      log.ipAddress.includes(search);
    const matchesRole = roleFilter === 'ALL' || log.userRole === roleFilter;
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesRole && matchesAction;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Action', 'Entity', 'Actor Name', 'Role', 'Patient UHID', 'IP Address', 'Details'];
    const rows = filtered.map(l => [
      l.timestamp,
      l.action,
      l.entityType,
      `"${l.userName}"`,
      l.userRole,
      l.patientUhid || 'N/A',
      l.ipAddress,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `carepulse_audit_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-xs font-semibold">
            <Lock className="w-4 h-4" />
            <span>Healthcare Compliance & Privacy Safeguard</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
            HIPAA Security Rule & DPDP Access Audit Trail
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Immutable log of every patient record inspection, clinical change, and drug dispensation
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter controls */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by actor name, UHID, or IP address..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Actor Role:</span>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="DOCTOR">Doctor</option>
              <option value="NURSE">Nurse</option>
              <option value="PHARMACIST">Pharmacist</option>
              <option value="LAB_TECH">Lab Tech</option>
              <option value="RECEPTIONIST">Receptionist</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Action:</span>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none"
            >
              <option value="ALL">All Actions</option>
              <option value="VIEW">VIEW</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DISPENSE">DISPENSE</option>
              <option value="ADMIT">ADMIT</option>
              <option value="DISCHARGE">DISCHARGE</option>
              <option value="PAYMENT">PAYMENT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5">Timestamp</th>
                <th className="py-2.5">Action & Entity</th>
                <th className="py-2.5">Clinical Staff / Actor</th>
                <th className="py-2.5">Patient UHID</th>
                <th className="py-2.5">Audit Event Details</th>
                <th className="py-2.5 text-right">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 text-[11px] text-slate-500">
                    <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                    <div className="text-[10px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-3 font-sans">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono font-bold text-[10px] text-slate-700 dark:text-slate-300">
                      {log.action}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5 font-mono">
                      {log.entityType}
                    </span>
                  </td>
                  <td className="py-3 font-sans">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{log.userName}</div>
                    <div className="font-mono text-[10px] text-teal-600 font-semibold">{log.userRole}</div>
                  </td>
                  <td className="py-3 font-mono font-bold text-teal-600">
                    {log.patientUhid || '—'}
                  </td>
                  <td className="py-3 font-sans text-slate-700 dark:text-slate-300 max-w-md">
                    {log.details}
                  </td>
                  <td className="py-3 text-right text-[11px] text-slate-400">
                    {log.ipAddress}
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
