import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  FileText,
  CreditCard,
  Pill,
  FlaskConical,
  Settings as SettingsIcon,
  X,
  UserCheck,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { AuraLogo } from './AuraLogo';
import { NavigationTab } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patients', icon: Users },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'doctors', label: 'Doctors & Nurses', icon: Stethoscope },
  { id: 'medical-records', label: 'Medical Records', icon: FileText },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
  { id: 'laboratory', label: 'Laboratory', icon: FlaskConical },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, doctorName, hospitalName, staff, doctors, nurses } = useHospital();

  const handleNavClick = (id: NavigationTab) => {
    setActiveTab(id);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-purple-950/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="aura-care-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } p-4 lg:py-6 lg:pl-6 lg:pr-2 shrink-0`}
      >
        <div className="h-full w-full liquid-glass rounded-[28px] p-5 flex flex-col justify-between overflow-hidden shadow-[0_12px_36px_-8px_rgba(109,40,217,0.12)]">
          {/* Top: Brand & Logo */}
          <div>
            <div className="flex items-center justify-between pb-6 mb-2 border-b border-purple-100/80 dark:border-purple-800/30">
              <div className="flex items-center gap-3">
                <AuraLogo size={38} />
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-purple-950 dark:text-purple-100 leading-none">
                    {hospitalName}
                  </h1>
                  <p className="text-[11px] font-medium text-purple-600 dark:text-purple-300/80 mt-1 uppercase tracking-wider">
                    Hospital System
                  </p>
                </div>
              </div>

              {/* Mobile close button */}
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-2 rounded-full text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-800/40"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5 mt-2" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-[0_4px_16px_-2px_rgba(109,40,217,0.4)]'
                        : 'text-purple-900/80 dark:text-purple-200 hover:bg-purple-100/50 dark:hover:bg-purple-800/30 hover:text-purple-950 dark:hover:text-white'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isActive ? 'text-white scale-105' : 'text-purple-600 dark:text-purple-300 group-hover:scale-110'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>

                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/90" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom: Doctor James Smith */}
          <div className="pt-4 border-t border-purple-100/80 dark:border-purple-800/30 mt-4">
            <div
              onClick={() => handleNavClick('doctors')}
              role="button"
              tabIndex={0}
              className="flex items-center gap-3 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/40 hover:border-purple-200 dark:hover:border-purple-700 transition-colors cursor-pointer"
            >
              {/* Medical icon inside glass circular container - NO PERSON PHOTO */}
              <div className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0 shadow-sm border border-purple-200/60 dark:border-purple-700/50">
                <Stethoscope className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950 dark:text-purple-100 truncate">
                    {doctors[0]?.fullName || doctorName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    {staff.length} Active Staff ({doctors.length}D / {nurses.length}N)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
