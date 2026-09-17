import React, { useState } from 'react';
import {
  Building2,
  User,
  Sun,
  Moon,
  Shield,
  RotateCcw,
  Check,
  Stethoscope,
  Sparkles,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { AuraLogo } from '../components/AuraLogo';

export const SettingsView: React.FC = () => {
  const {
    hospitalName,
    doctorName,
    staff,
    doctors,
    nurses,
    setActiveTab,
    theme,
    setTheme,
    clearAllData,
  } = useHospital();

  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    clearAllData();
    setResetConfirm(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-3xl">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-purple-950 dark:text-purple-100 tracking-tight">
          Settings
        </h2>
        <p className="text-sm text-purple-900/60 dark:text-purple-300/60 mt-1">
          System configuration, staff management, and theme preferences
        </p>
      </div>

      {/* Hospital Information Section */}
      <div className="liquid-glass rounded-[28px] p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-purple-100 dark:border-purple-800/40">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100">
              Hospital Information
            </h3>
            <p className="text-xs text-purple-900/60 dark:text-purple-300/60">
              Authorized clinical center identity
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40">
          <div className="flex items-center gap-3">
            <AuraLogo size={36} />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 block">
                Hospital Name
              </span>
              <span className="text-base font-bold text-purple-950 dark:text-purple-100">
                {hospitalName}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-200/60 text-purple-900 dark:bg-purple-900/60 dark:text-purple-200">
            Registered
          </span>
        </div>
      </div>

      {/* Clinical Staff Section */}
      <div className="liquid-glass rounded-[28px] p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100">
                Clinical Personnel
              </h3>
              <p className="text-xs text-purple-900/60 dark:text-purple-300/60">
                Physicians and nurses registry ({staff.length} active profiles)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            className="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-sm"
          >
            Manage Profiles
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full liquid-glass flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0 border border-purple-200/80">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-900/60 dark:text-purple-300/60 block">
                Chief Medical Officer
              </span>
              <span className="text-base font-bold text-purple-950 dark:text-purple-100">
                {doctorName}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
              {doctors.length} Doctor{doctors.length === 1 ? '' : 's'}
            </span>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200">
              {nurses.length} Nurse{nurses.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="liquid-glass rounded-[28px] p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-purple-100 dark:border-purple-800/40">
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100">
              Appearance
            </h3>
            <p className="text-xs text-purple-900/60 dark:text-purple-300/60">
              Default: Light purple liquid-glass theme
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl flex items-center justify-between text-left transition-all border ${
              theme === 'light'
                ? 'bg-white/90 dark:bg-purple-900/60 border-purple-600 shadow-[0_6px_20px_rgba(109,40,217,0.15)] ring-2 ring-purple-600/30'
                : 'liquid-glass border-purple-100/80 hover:border-purple-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-purple-950 dark:text-purple-100 block">
                  Light Mode
                </span>
                <span className="text-[11px] text-purple-900/60 dark:text-purple-300/60">
                  Light purple liquid-glass (Default)
                </span>
              </div>
            </div>
            {theme === 'light' && (
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl flex items-center justify-between text-left transition-all border ${
              theme === 'dark'
                ? 'bg-purple-950/80 border-purple-500 shadow-[0_6px_20px_rgba(109,40,217,0.25)] ring-2 ring-purple-500/30'
                : 'liquid-glass border-purple-100/80 hover:border-purple-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-900/60 flex items-center justify-center text-purple-300">
                <Moon className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <span className="text-sm font-bold text-purple-950 dark:text-purple-100 block">
                  Dark Mode
                </span>
                <span className="text-[11px] text-purple-900/60 dark:text-purple-300/60">
                  Deep violet night glass
                </span>
              </div>
            </div>
            {theme === 'dark' && (
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="liquid-glass rounded-[28px] p-6 sm:p-7 space-y-4 shadow-sm border border-rose-100 dark:border-rose-900/30">
        <div className="flex items-center gap-3 pb-3 border-b border-purple-100 dark:border-purple-800/40">
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-300">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-950 dark:text-purple-100">
              Reset System Data
            </h3>
            <p className="text-xs text-purple-900/60 dark:text-purple-300/60">
              Wipes recorded entries and returns all views to clean empty states
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
          <div>
            <p className="text-xs font-semibold text-rose-950 dark:text-rose-200">
              Clear All Clinical Records & Patients
            </p>
            <p className="text-[11px] text-rose-900/60 dark:text-rose-300/60 mt-0.5">
              Restores pure "No data available" and empty states.
            </p>
          </div>

          {!resetConfirm ? (
            <button
              type="button"
              onClick={() => setResetConfirm(true)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors shrink-0"
            >
              Reset Data
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setResetConfirm(false)}
                className="px-3 py-1.5 rounded-full text-xs font-medium liquid-glass text-purple-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Reset
              </button>
            </div>
          )}
        </div>

        {resetSuccess && (
          <div className="p-3 rounded-xl bg-emerald-100/80 text-emerald-800 text-xs font-medium text-center">
            All data reset. Empty states restored across all pages.
          </div>
        )}
      </div>
    </div>
  );
};
