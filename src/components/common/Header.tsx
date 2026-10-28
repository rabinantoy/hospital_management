import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Role } from '../../types';
import {
  Bell,
  Sun,
  Moon,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  UserCheck,
  ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchRole,
    darkMode,
    toggleDarkMode,
    notifications,
    markNotificationAsRead,
    patients,
    setActiveTab
  } = useHospital();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof patients>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const roles: { role: Role; label: string; badge: string }[] = [
    { role: 'ADMIN', label: 'Admin', badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300' },
    { role: 'DOCTOR', label: 'Doctor', badge: 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300' },
    { role: 'NURSE', label: 'Nurse', badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' },
    { role: 'RECEPTIONIST', label: 'Receptionist', badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' },
    { role: 'PHARMACIST', label: 'Pharmacist', badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' },
    { role: 'LAB_TECH', label: 'Lab Tech', badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300' },
    { role: 'PATIENT', label: 'Patient Portal', badge: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' }
  ];

  // Filter notifications relevant to current user role
  const userNotifs = notifications.filter(
    n => n.targetRoles.includes(currentUser.role) || currentUser.role === 'ADMIN'
  );
  const unreadCount = userNotifs.filter(n => !n.read).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      const filtered = patients.filter(
        p =>
          p.fullName.toLowerCase().includes(q.toLowerCase()) ||
          p.uhid.toLowerCase().includes(q.toLowerCase()) ||
          p.phone.includes(q)
      );
      setSearchResults(filtered);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 lg:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Brand & Left Area */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/20 font-bold text-xl tracking-tight">
          CP
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
              CarePulse
            </span>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              Hospital System
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Regional Medical Center
          </p>
        </div>
      </div>

      {/* Global Patient Search (Quick lookup for clinical staff) */}
      <div className="relative flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search patient by UHID (CP-2026-...), name or phone..."
            className="w-full bg-slate-100 dark:bg-slate-800/80 border border-transparent focus:border-teal-500 dark:focus:border-teal-400 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
            onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Matching Patient Records ({searchResults.length})
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {searchResults.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => {
                    setActiveTab('patients');
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {patient.fullName}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-teal-600 dark:text-teal-400 font-medium">
                        {patient.uhid}
                      </span>
                      <span>·</span>
                      <span>{patient.age}y {patient.gender}</span>
                      <span>·</span>
                      <span>Blood {patient.bloodGroup}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium hover:underline">
                    View Record
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Actions: Role Switcher, Notifications, Dark Mode, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100/80 dark:bg-teal-950/40 dark:hover:bg-teal-950/70 text-teal-800 dark:text-teal-200 border border-teal-200/70 dark:border-teal-800/60 text-xs font-semibold transition-colors"
            title="Switch demo role instantly"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Role:</span>
            <span className="font-bold">{currentUser.role}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1.5 z-50">
              <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch User Perspective
              </div>
              {roles.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    currentUser.role === r.role
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className={`w-3.5 h-3.5 ${currentUser.role === r.role ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'}`} />
                    <span>{r.label}</span>
                  </div>
                  {currentUser.role === r.role && (
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Hospital Alerts & Activity
                </span>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                  {unreadCount} unread
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {userNotifs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active notifications.
                  </div>
                ) : (
                  userNotifs.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 text-left transition-colors cursor-pointer ${
                        n.read
                          ? 'bg-transparent text-slate-600 dark:text-slate-400'
                          : 'bg-teal-50/50 dark:bg-teal-950/20 text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {n.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                        <div className="flex-1">
                          <div className="text-xs font-semibold leading-tight">{n.title}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {n.message}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1 font-mono">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Mini Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 border border-teal-300 dark:border-teal-700 flex items-center justify-center text-teal-800 dark:text-teal-200 font-bold text-xs">
            {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              {currentUser.specialization || currentUser.department || currentUser.role}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
