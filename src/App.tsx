import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';

// Views
import { AdminDashboard } from './views/AdminDashboard';
import { DoctorDashboard } from './views/DoctorDashboard';
import { NurseDashboard } from './views/NurseDashboard';
import { ReceptionistDashboard } from './views/ReceptionistDashboard';
import { PharmacistDashboard } from './views/PharmacistDashboard';
import { LabTechDashboard } from './views/LabTechDashboard';
import { PatientPortal } from './views/PatientPortal';
import { PatientsView } from './views/PatientsView';
import { AppointmentsView } from './views/AppointmentsView';
import { WardsView } from './views/WardsView';
import { PharmacyView } from './views/PharmacyView';
import { LaboratoryView } from './views/LaboratoryView';
import { BillingView } from './views/BillingView';
import { AuditLogsView } from './views/AuditLogsView';
import { AnalyticsView } from './views/AnalyticsView';
import { StaffView } from './views/StaffView';

// Modals
import { RegisterPatientModal } from './components/modals/RegisterPatientModal';
import { BookAppointmentModal } from './components/modals/BookAppointmentModal';
import { RecordVitalsModal } from './components/modals/RecordVitalsModal';
import { ConsultationModal } from './components/modals/ConsultationModal';
import { DispenseModal } from './components/modals/DispenseModal';
import { LabResultModal } from './components/modals/LabResultModal';
import { AdmitPatientModal } from './components/modals/AdmitPatientModal';
import { PrintableInvoiceModal } from './components/modals/PrintableInvoiceModal';
import { PrintableLabReportModal } from './components/modals/PrintableLabReportModal';
import { PaymentModal } from './components/modals/PaymentModal';

import { Prescription, LabOrder, Invoice } from './types';

const MainLayout: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useHospital();

  // Modal Open States
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [showLabResultModal, setShowLabResultModal] = useState(false);
  const [showAdmitBedModal, setShowAdmitBedModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Selected Entities for Modals
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>();
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | undefined>();
  const [selectedBedId, setSelectedBedId] = useState<string | undefined>();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [selectedLabOrder, setSelectedLabOrder] = useState<LabOrder | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Handlers for cross-component triggers
  const handleStartConsult = (patientId: string, appointmentId?: string) => {
    setSelectedPatientId(patientId);
    setSelectedAppointmentId(appointmentId);
    setShowConsultModal(true);
  };

  const handleRecordVitals = (patientId?: string) => {
    setSelectedPatientId(patientId);
    setShowVitalsModal(true);
  };

  const handleAdmitBed = (bedId?: string) => {
    setSelectedBedId(bedId);
    setShowAdmitBedModal(true);
  };

  const handleOpenDispense = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setShowDispenseModal(true);
  };

  const handleOpenResult = (order: LabOrder) => {
    setSelectedLabOrder(order);
    setShowLabResultModal(true);
  };

  const handleOpenReport = (order: LabOrder) => {
    setSelectedLabOrder(order);
    setShowReportModal(true);
  };

  const handleOpenInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceModal(true);
  };

  const handleOpenPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowPaymentModal(true);
  };

  // Render content according to activeTab and role
  const renderContent = () => {
    if (activeTab === 'dashboard') {
      switch (currentUser.role) {
        case 'ADMIN':
          return (
            <AdminDashboard
              onOpenRegisterModal={() => setShowRegisterModal(true)}
              onOpenConsultModal={() => handleStartConsult(selectedPatientId || '')}
            />
          );
        case 'DOCTOR':
          return (
            <DoctorDashboard
              onStartConsult={handleStartConsult}
              onRecordVitals={handleRecordVitals}
            />
          );
        case 'NURSE':
          return (
            <NurseDashboard
              onRecordVitals={handleRecordVitals}
              onAdmitBed={handleAdmitBed}
            />
          );
        case 'RECEPTIONIST':
          return (
            <ReceptionistDashboard
              onOpenRegisterModal={() => setShowRegisterModal(true)}
              onOpenBookAppointmentModal={() => setShowBookModal(true)}
            />
          );
        case 'PHARMACIST':
          return (
            <PharmacistDashboard
              onOpenDispenseModal={handleOpenDispense}
            />
          );
        case 'LAB_TECH':
          return (
            <LabTechDashboard
              onOpenResultModal={handleOpenResult}
              onOpenReportModal={handleOpenReport}
            />
          );
        case 'PATIENT':
          return (
            <PatientPortal
              onOpenBookAppointmentModal={() => setShowBookModal(true)}
              onOpenReportModal={handleOpenReport}
              onOpenInvoiceModal={handleOpenInvoice}
              onOpenPaymentModal={handleOpenPayment}
            />
          );
        default:
          return (
            <AdminDashboard
              onOpenRegisterModal={() => setShowRegisterModal(true)}
              onOpenConsultModal={() => handleStartConsult(selectedPatientId || '')}
            />
          );
      }
    }

    switch (activeTab) {
      case 'patients':
      case 'register-patient':
        return (
          <PatientsView
            onOpenRegisterModal={() => setShowRegisterModal(true)}
            onRecordVitals={handleRecordVitals}
            onStartConsult={handleStartConsult}
          />
        );

      case 'appointments':
        return (
          <AppointmentsView
            onOpenBookAppointmentModal={() => setShowBookModal(true)}
          />
        );

      case 'doctors':
        return <StaffView />;

      case 'wards':
        return (
          <WardsView
            onAdmitBed={handleAdmitBed}
            onRecordVitals={handleRecordVitals}
          />
        );

      case 'pharmacy':
      case 'dispense':
      case 'stock-alerts':
        return <PharmacyView />;

      case 'lab':
      case 'test-catalog':
        return (
          <LaboratoryView
            onOpenResultModal={handleOpenResult}
            onOpenReportModal={handleOpenReport}
          />
        );

      case 'billing':
      case 'my-bills':
        return (
          <BillingView
            onOpenInvoiceModal={handleOpenInvoice}
            onOpenPaymentModal={handleOpenPayment}
          />
        );

      case 'audit':
        return <AuditLogsView />;

      case 'analytics':
        return <AnalyticsView />;

      case 'vitals':
        return (
          <NurseDashboard
            onRecordVitals={handleRecordVitals}
            onAdmitBed={handleAdmitBed}
          />
        );

      case 'emr-consult':
        return (
          <DoctorDashboard
            onStartConsult={handleStartConsult}
            onRecordVitals={handleRecordVitals}
          />
        );

      case 'my-prescriptions':
      case 'my-lab-reports':
        return (
          <PatientPortal
            onOpenBookAppointmentModal={() => setShowBookModal(true)}
            onOpenReportModal={handleOpenReport}
            onOpenInvoiceModal={handleOpenInvoice}
            onOpenPaymentModal={handleOpenPayment}
          />
        );

      default:
        return (
          <AdminDashboard
            onOpenRegisterModal={() => setShowRegisterModal(true)}
            onOpenConsultModal={() => handleStartConsult(selectedPatientId || '')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <Header />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      {/* Interactive Modals */}
      <RegisterPatientModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
      />

      <BookAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        preselectedPatientId={selectedPatientId}
      />

      <RecordVitalsModal
        isOpen={showVitalsModal}
        onClose={() => setShowVitalsModal(false)}
        preselectedPatientId={selectedPatientId}
      />

      <ConsultationModal
        isOpen={showConsultModal}
        onClose={() => setShowConsultModal(false)}
        preselectedPatientId={selectedPatientId}
        preselectedAppointmentId={selectedAppointmentId}
      />

      <DispenseModal
        isOpen={showDispenseModal}
        onClose={() => {
          setShowDispenseModal(false);
          setSelectedPrescription(null);
        }}
        prescription={selectedPrescription}
      />

      <LabResultModal
        isOpen={showLabResultModal}
        onClose={() => {
          setShowLabResultModal(false);
          setSelectedLabOrder(null);
        }}
        order={selectedLabOrder}
      />

      <AdmitPatientModal
        isOpen={showAdmitBedModal}
        onClose={() => {
          setShowAdmitBedModal(false);
          setSelectedBedId(undefined);
        }}
        preselectedBedId={selectedBedId}
      />

      <PrintableInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />

      <PrintableLabReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          setSelectedLabOrder(null);
        }}
        order={selectedLabOrder}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />
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
