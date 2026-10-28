import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Activity,
  Pill,
  FlaskConical,
  BedDouble,
  Receipt,
  BarChart3,
  ShieldAlert,
  UserPlus,
  ClipboardList,
  FileText
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useHospital();

  // Role-based navigation definition
  const getNavItems = (): NavItem[] => {
    switch (currentUser.role) {
      case 'ADMIN':
        return [
          { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
          { id: 'patients', label: 'Patient Directory', icon: Users },
          { id: 'appointments', label: 'Appointments Master', icon: Calendar },
          { id: 'doctors', label: 'Doctors & Staff', icon: Stethoscope },
          { id: 'wards', label: 'Wards & Bed Capacity', icon: BedDouble },
          { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Pill },
          { id: 'lab', label: 'Laboratory & Tests', icon: FlaskConical },
          { id: 'billing', label: 'Billing & Invoices', icon: Receipt },
          { id: 'analytics', label: 'Reports & Analytics', icon: BarChart3 },
          { id: 'audit', label: 'HIPAA / DPDP Audit Logs', icon: ShieldAlert }
        ];

      case 'DOCTOR':
        return [
          { id: 'dashboard', label: 'Doctor Station', icon: LayoutDashboard },
          { id: 'appointments', label: 'My Appointments Queue', icon: Calendar },
          { id: 'patients', label: 'Patient EMR Records', icon: Users },
          { id: 'emr-consult', label: 'Clinical Consultation', icon: Stethoscope },
          { id: 'lab', label: 'Diagnostic Lab Orders', icon: FlaskConical },
          { id: 'pharmacy', label: 'Drug Formulary', icon: Pill }
        ];

      case 'NURSE':
        return [
          { id: 'dashboard', label: 'Nurse Station', icon: LayoutDashboard },
          { id: 'wards', label: 'Ward Floor & Beds', icon: BedDouble },
          { id: 'vitals', label: 'Record Patient Vitals', icon: Activity },
          { id: 'patients', label: 'Inpatient Roster', icon: Users },
          { id: 'appointments', label: 'Clinic Appointments', icon: Calendar }
        ];

      case 'RECEPTIONIST':
        return [
          { id: 'dashboard', label: 'Reception Desk', icon: LayoutDashboard },
          { id: 'register-patient', label: 'Patient Registration', icon: UserPlus },
          { id: 'appointments', label: 'Book & Schedule', icon: Calendar },
          { id: 'patients', label: 'All Patients', icon: Users },
          { id: 'billing', label: 'OPD Billing Desk', icon: Receipt },
          { id: 'wards', label: 'Bed Availability', icon: BedDouble }
        ];

      case 'PHARMACIST':
        return [
          { id: 'dashboard', label: 'Pharmacy Station', icon: LayoutDashboard },
          { id: 'dispense', label: 'Prescription Queue', icon: ClipboardList },
          { id: 'pharmacy', label: 'Medicine Inventory', icon: Pill },
          { id: 'stock-alerts', label: 'Stock & Expiry Alerts', icon: Activity },
          { id: 'patients', label: 'Patient Rx History', icon: Users }
        ];

      case 'LAB_TECH':
        return [
          { id: 'dashboard', label: 'Laboratory Console', icon: LayoutDashboard },
          { id: 'lab', label: 'Pending Test Orders', icon: FlaskConical },
          { id: 'test-catalog', label: 'Diagnostic Catalog', icon: ClipboardList },
          { id: 'patients', label: 'Specimen Registry', icon: Users }
        ];

      case 'PATIENT':
        return [
          { id: 'dashboard', label: 'My Health Vault', icon: LayoutDashboard },
          { id: 'appointments', label: 'Book Appointment', icon: Calendar },
          { id: 'my-prescriptions', label: 'My Prescriptions', icon: Pill },
          { id: 'my-lab-reports', label: 'Lab Reports', icon: FileText },
          { id: 'my-bills', label: 'Bills & Invoices', icon: Receipt }
        ];

      default:
        return [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 select-none">
      {/* Role Banner Indicator */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Portal Mode
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold">
            {currentUser.role}
          </span>
        </div>
        <div className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
          {currentUser.department || 'Clinical Operations'}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/20 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Hospital Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>CarePulse Core v3.4</span>
        </div>
        <p className="mt-1 text-[10px] text-slate-400 leading-tight">
          HIPAA & DPDP Encrypted Session
        </p>
      </div>
    </aside>
  );
};
