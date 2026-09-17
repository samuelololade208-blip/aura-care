import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { AppointmentsView } from './views/AppointmentsView';
import { DoctorsView } from './views/DoctorsView';
import { MedicalRecordsView } from './views/MedicalRecordsView';
import { BillingView } from './views/BillingView';
import { PharmacyView } from './views/PharmacyView';
import { LaboratoryView } from './views/LaboratoryView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useHospital();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'patients':
        return <PatientsView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'doctors':
        return <DoctorsView />;
      case 'medical-records':
        return <MedicalRecordsView />;
      case 'billing':
        return <BillingView />;
      case 'pharmacy':
        return <PharmacyView />;
      case 'laboratory':
        return <LaboratoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#fcf8ff] dark:bg-[#0d091a] text-[#181445] dark:text-[#f3eeff] transition-colors duration-300 overflow-x-hidden">
      {/* Background Soft Liquid Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[55vw] h-[55vw] rounded-full bg-purple-200/40 dark:bg-purple-900/15 blur-[120px]" />
        <div className="absolute top-[40%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-purple-300/30 dark:bg-indigo-950/25 blur-[140px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-indigo-100/40 dark:bg-purple-950/20 blur-[130px]" />
      </div>

      {/* Sidebar (Desktop fixed/static, Mobile slide-out drawer) */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 px-4 lg:px-8 py-4 lg:py-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainLayout />
    </HospitalProvider>
  );
}
