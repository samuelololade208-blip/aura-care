import React from 'react';
import { Menu, Sun, Moon, Sparkles } from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { AuraLogo } from './AuraLogo';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { activeTab, theme, toggleTheme, hospitalName, doctorName } = useHospital();

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Hospital Overview';
      case 'patients':
        return 'Patient Directory';
      case 'appointments':
        return 'Appointment Schedule';
      case 'doctors':
        return 'Medical Staff';
      case 'medical-records':
        return 'Clinical Records';
      case 'billing':
        return 'Financial & Invoicing';
      case 'pharmacy':
        return 'Pharmacy Dispensary';
      case 'laboratory':
        return 'Diagnostic Laboratory';
      case 'settings':
        return 'System Configuration';
      default:
        return 'Hospital Overview';
    }
  };

  const todayString = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="w-full px-4 lg:px-8 pt-4 lg:pt-6 pb-2 shrink-0">
      <div className="liquid-glass rounded-[22px] px-4 py-3.5 flex items-center justify-between shadow-sm">
        {/* Left: Mobile menu button & breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-purple-800 dark:text-purple-200 hover:bg-purple-100/60 dark:hover:bg-purple-800/40"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 lg:hidden">
            <AuraLogo size={28} />
            <span className="font-bold text-purple-950 dark:text-purple-100 text-sm">
              {hospitalName}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-sm text-purple-900/60 dark:text-purple-300/60">
            <span className="font-semibold text-purple-950 dark:text-purple-200">
              {hospitalName}
            </span>
            <span>/</span>
            <span className="font-medium text-purple-800 dark:text-purple-300">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Right: Date, Doctor James Smith, Theme toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50/80 dark:bg-purple-900/30 border border-purple-200/50 dark:border-purple-800/50 text-xs font-medium text-purple-900 dark:text-purple-200">
            <span>{todayString}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100/50 dark:bg-purple-850/40 border border-purple-200/60 dark:border-purple-700/50 text-xs font-medium text-purple-950 dark:text-purple-100">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{doctorName}</span>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full text-purple-800 dark:text-purple-200 hover:bg-purple-100/60 dark:hover:bg-purple-800/40 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
