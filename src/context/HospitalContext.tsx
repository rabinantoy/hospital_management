import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Role,
  Patient,
  Appointment,
  VitalsRecord,
  Consultation,
  Prescription,
  Medicine,
  LabTest,
  LabOrder,
  Bed,
  BedAdmission,
  Invoice,
  AuditLog,
  SystemNotification,
  AppointmentStatus,
  BedStatus,
  LabOrderStatus
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_VITALS,
  INITIAL_CONSULTATIONS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICINES,
  INITIAL_LAB_TESTS,
  INITIAL_LAB_ORDERS,
  INITIAL_BEDS,
  INITIAL_BED_ADMISSIONS,
  INITIAL_INVOICES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS
} from '../data/mockHospitalData';

interface HospitalContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  users: User[];

  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'uhid' | 'registeredAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  getPatientById: (id: string) => Patient | undefined;

  appointments: Appointment[];
  bookAppointment: (apt: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  rescheduleAppointment: (id: string, date: string, startTime: string, endTime: string) => void;

  vitals: VitalsRecord[];
  recordVitals: (record: Omit<VitalsRecord, 'id' | 'recordedAt' | 'recordedBy' | 'recordedByRole' | 'bmi'>) => VitalsRecord;

  consultations: Consultation[];
  createConsultation: (consult: Omit<Consultation, 'id' | 'consultedAt'>) => Consultation;

  prescriptions: Prescription[];
  createPrescription: (rx: Omit<Prescription, 'id' | 'createdAt' | 'status'>) => Prescription;
  dispensePrescription: (prescriptionId: string) => void;

  medicines: Medicine[];
  updateMedicineStock: (id: string, quantityChange: number) => void;
  addMedicine: (med: Omit<Medicine, 'id'>) => Medicine;

  labTests: LabTest[];
  labOrders: LabOrder[];
  createLabOrder: (testId: string, patientId: string, remarks?: string) => LabOrder;
  updateLabOrderStatus: (orderId: string, status: LabOrderStatus) => void;
  submitLabResult: (orderId: string, resultValue: string, isAbnormal: boolean, remarks: string) => void;

  beds: Bed[];
  bedAdmissions: BedAdmission[];
  admitToBed: (bedId: string, patientId: string, reason: string) => void;
  dischargeFromBed: (bedId: string) => void;
  updateBedStatus: (bedId: string, status: BedStatus) => void;

  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>) => Invoice;
  recordPayment: (invoiceId: string, method: 'CASH' | 'CARD' | 'UPI' | 'INSURANCE', ref?: string) => void;

  auditLogs: AuditLog[];
  logAudit: (action: AuditLog['action'], entityType: AuditLog['entityType'], entityId: string, details: string, patientId?: string, patientUhid?: string) => void;

  notifications: SystemNotification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notif: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;

  darkMode: boolean;
  toggleDarkMode: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('carepulse_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('carepulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('carepulse_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Entities state with local storage fallback
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('carepulse_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0]; // Admin by default
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('carepulse_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('carepulse_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [vitals, setVitals] = useState<VitalsRecord[]>(() => {
    const saved = localStorage.getItem('carepulse_vitals');
    return saved ? JSON.parse(saved) : INITIAL_VITALS;
  });

  const [consultations, setConsultations] = useState<Consultation[]>(() => {
    const saved = localStorage.getItem('carepulse_consultations');
    return saved ? JSON.parse(saved) : INITIAL_CONSULTATIONS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('carepulse_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('carepulse_medicines');
    return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
  });

  const [labTests] = useState<LabTest[]>(INITIAL_LAB_TESTS);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(() => {
    const saved = localStorage.getItem('carepulse_lab_orders');
    return saved ? JSON.parse(saved) : INITIAL_LAB_ORDERS;
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    const saved = localStorage.getItem('carepulse_beds');
    return saved ? JSON.parse(saved) : INITIAL_BEDS;
  });

  const [bedAdmissions, setBedAdmissions] = useState<BedAdmission[]>(() => {
    const saved = localStorage.getItem('carepulse_admissions');
    return saved ? JSON.parse(saved) : INITIAL_BED_ADMISSIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('carepulse_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('carepulse_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>(() => {
    const saved = localStorage.getItem('carepulse_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem('carepulse_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('carepulse_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('carepulse_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('carepulse_vitals', JSON.stringify(vitals));
  }, [vitals]);

  useEffect(() => {
    localStorage.setItem('carepulse_consultations', JSON.stringify(consultations));
  }, [consultations]);

  useEffect(() => {
    localStorage.setItem('carepulse_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('carepulse_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('carepulse_lab_orders', JSON.stringify(labOrders));
  }, [labOrders]);

  useEffect(() => {
    localStorage.setItem('carepulse_beds', JSON.stringify(beds));
  }, [beds]);

  useEffect(() => {
    localStorage.setItem('carepulse_admissions', JSON.stringify(bedAdmissions));
  }, [bedAdmissions]);

  useEffect(() => {
    localStorage.setItem('carepulse_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('carepulse_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('carepulse_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Audit Logger
  const logAudit = (
    action: AuditLog['action'],
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string,
    patientId?: string,
    patientUhid?: string
  ) => {
    const newLog: AuditLog = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      patientId,
      patientUhid,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '192.168.1.104',
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Switch role helper
  const switchRole = (role: Role) => {
    const matchingUser = users.find(u => u.role === role) || {
      id: `usr-${role.toLowerCase()}`,
      email: `${role.toLowerCase()}@carepulse.hospital`,
      role,
      name: `${role.charAt(0) + role.slice(1).toLowerCase()} User`,
      department: 'Clinical Services'
    };
    setCurrentUser(matchingUser);
    setActiveTab('dashboard'); // reset to role dashboard
    logAudit('VIEW', 'PATIENT', 'system-nav', `Switched active session to role: ${role}`);
  };

  // Patient Actions
  const addPatient = (patientData: Omit<Patient, 'id' | 'uhid' | 'registeredAt'>): Patient => {
    const nextNum = patients.length + 46;
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      uhid: `CP-2026-${String(nextNum).padStart(4, '0')}`,
      registeredAt: new Date().toISOString(),
      documents: []
    };
    setPatients(prev => [newPatient, ...prev]);
    logAudit('CREATE', 'PATIENT', newPatient.id, `Registered new patient: ${newPatient.fullName} (${newPatient.uhid})`, newPatient.id, newPatient.uhid);
    addNotification({
      title: 'New Patient Registered',
      message: `${newPatient.fullName} (${newPatient.uhid}) has been registered.`,
      type: 'info',
      targetRoles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'NURSE']
    });
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          logAudit('UPDATE', 'PATIENT', id, `Updated demographic/clinical profile for ${updated.fullName}`, id, updated.uhid);
          return updated;
        }
        return p;
      })
    );
  };

  const getPatientById = (id: string) => patients.find(p => p.id === id);

  // Appointment Actions
  const bookAppointment = (aptData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt: Appointment = {
      ...aptData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newApt, ...prev]);
    logAudit('CREATE', 'APPOINTMENT', newApt.id, `Booked appointment with ${newApt.doctorName} on ${newApt.date} at ${newApt.startTime}`, newApt.patientId, newApt.patientUhid);
    addNotification({
      title: 'Appointment Booked',
      message: `Appointment scheduled for ${newApt.patientName} with ${newApt.doctorName} at ${newApt.startTime}.`,
      type: 'info',
      targetRoles: ['DOCTOR', 'RECEPTIONIST', 'NURSE', 'ADMIN']
    });
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          const updated = { ...apt, status };
          logAudit('UPDATE', 'APPOINTMENT', id, `Changed appointment status to ${status} for ${apt.patientName}`, apt.patientId, apt.patientUhid);
          if (status === 'CHECKED_IN') {
            addNotification({
              title: 'Patient Checked-In',
              message: `${apt.patientName} is ready for ${apt.doctorName}.`,
              type: 'info',
              targetRoles: ['DOCTOR', 'NURSE']
            });
          }
          return updated;
        }
        return apt;
      })
    );
  };

  const rescheduleAppointment = (id: string, date: string, startTime: string, endTime: string) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          const updated = { ...apt, date, startTime, endTime, status: 'SCHEDULED' as AppointmentStatus };
          logAudit('UPDATE', 'APPOINTMENT', id, `Rescheduled appointment to ${date} at ${startTime}`, apt.patientId, apt.patientUhid);
          return updated;
        }
        return apt;
      })
    );
  };

  // Vitals Actions
  const recordVitals = (recordData: Omit<VitalsRecord, 'id' | 'recordedAt' | 'recordedBy' | 'recordedByRole' | 'bmi'>): VitalsRecord => {
    const heightM = recordData.heightCm / 100;
    const bmi = heightM > 0 ? Number((recordData.weightKg / (heightM * heightM)).toFixed(1)) : 22.0;

    const newVitals: VitalsRecord = {
      ...recordData,
      id: `vit-${Date.now()}`,
      recordedBy: currentUser.name,
      recordedByRole: currentUser.role,
      bmi,
      recordedAt: new Date().toISOString()
    };
    setVitals(prev => [newVitals, ...prev]);
    logAudit('CREATE', 'VITALS', newVitals.id, `Recorded vitals: BP ${newVitals.systolicBp}/${newVitals.diastolicBp}, HR ${newVitals.heartRate}, SpO2 ${newVitals.oxygenSpO2}%`, newVitals.patientId, newVitals.patientUhid);
    return newVitals;
  };

  // Consultation & Prescription Actions
  const createConsultation = (consultData: Omit<Consultation, 'id' | 'consultedAt'>): Consultation => {
    const newConsult: Consultation = {
      ...consultData,
      id: `cns-${Date.now()}`,
      consultedAt: new Date().toISOString()
    };
    setConsultations(prev => [newConsult, ...prev]);
    logAudit('CREATE', 'EMR', newConsult.id, `Completed clinical consultation. Diagnosis: ${newConsult.diagnosis}`, newConsult.patientId, newConsult.patientUhid);
    return newConsult;
  };

  const createPrescription = (rxData: Omit<Prescription, 'id' | 'createdAt' | 'status'>): Prescription => {
    const newRx: Prescription = {
      ...rxData,
      id: `rx-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    setPrescriptions(prev => [newRx, ...prev]);
    logAudit('CREATE', 'PRESCRIPTION', newRx.id, `Created prescription with ${newRx.items.length} items for ${newRx.patientName}`, newRx.patientId, newRx.patientUhid);
    addNotification({
      title: 'New Prescription Sent to Pharmacy',
      message: `Prescription #${newRx.id.toUpperCase()} waiting for dispensing.`,
      type: 'info',
      targetRoles: ['PHARMACIST', 'ADMIN']
    });
    return newRx;
  };

  const dispensePrescription = (prescriptionId: string) => {
    setPrescriptions(prev =>
      prev.map(rx => {
        if (rx.id === prescriptionId) {
          // Decrement medicine stock for each item
          rx.items.forEach(item => {
            updateMedicineStock(item.medicineId, -(item.durationDays * 2));
          });

          const updated: Prescription = {
            ...rx,
            status: 'DISPENSED',
            dispensedAt: new Date().toISOString(),
            dispensedBy: currentUser.name,
            items: rx.items.map(i => ({ ...i, isDispensed: true }))
          };
          logAudit('DISPENSE', 'PHARMACY', prescriptionId, `Dispensed medications for prescription #${prescriptionId}`, rx.patientId, rx.patientUhid);
          addNotification({
            title: 'Medication Dispensed',
            message: `Prescription #${prescriptionId} has been dispensed by ${currentUser.name}.`,
            type: 'success',
            targetRoles: ['DOCTOR', 'NURSE', 'PATIENT']
          });
          return updated;
        }
        return rx;
      })
    );
  };

  // Medicine Inventory Actions
  const updateMedicineStock = (id: string, quantityChange: number) => {
    setMedicines(prev =>
      prev.map(m => {
        if (m.id === id) {
          const newQuantity = Math.max(0, m.stockQuantity + quantityChange);
          if (newQuantity <= m.reorderLevel) {
            addNotification({
              title: `Low Stock Alert: ${m.name}`,
              message: `Current stock: ${newQuantity} (Reorder threshold: ${m.reorderLevel}).`,
              type: 'warning',
              targetRoles: ['ADMIN', 'PHARMACIST']
            });
          }
          return { ...m, stockQuantity: newQuantity };
        }
        return m;
      })
    );
  };

  const addMedicine = (medData: Omit<Medicine, 'id'>): Medicine => {
    const newMed: Medicine = {
      ...medData,
      id: `med-${Date.now()}`
    };
    setMedicines(prev => [newMed, ...prev]);
    logAudit('CREATE', 'PHARMACY', newMed.id, `Added new medicine to pharmacy catalog: ${newMed.name}`);
    return newMed;
  };

  // Lab Actions
  const createLabOrder = (testId: string, patientId: string, remarks?: string): LabOrder => {
    const test = labTests.find(t => t.id === testId);
    const patient = patients.find(p => p.id === patientId);

    const newOrder: LabOrder = {
      id: `lab-ord-${Date.now()}`,
      testId,
      testName: test?.name || 'Diagnostic Test',
      testCode: test?.code || 'LAB',
      patientId,
      patientName: patient?.fullName || 'Unknown Patient',
      patientUhid: patient?.uhid || 'CP-2026-XXXX',
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      status: 'ORDERED',
      orderedAt: new Date().toISOString(),
      clinicalRemarks: remarks
    };

    setLabOrders(prev => [newOrder, ...prev]);
    logAudit('CREATE', 'LAB', newOrder.id, `Ordered lab test ${newOrder.testName} for ${newOrder.patientName}`, patientId, patient?.uhid);
    addNotification({
      title: 'New Lab Test Ordered',
      message: `${newOrder.testCode} ordered for ${newOrder.patientName}.`,
      type: 'info',
      targetRoles: ['LAB_TECH', 'ADMIN']
    });
    return newOrder;
  };

  const updateLabOrderStatus = (orderId: string, status: LabOrderStatus) => {
    setLabOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updated = {
            ...ord,
            status,
            sampleCollectedAt: status === 'SAMPLE_COLLECTED' ? new Date().toISOString() : ord.sampleCollectedAt
          };
          logAudit('UPDATE', 'LAB', orderId, `Lab order status changed to ${status}`, ord.patientId, ord.patientUhid);
          return updated;
        }
        return ord;
      })
    );
  };

  const submitLabResult = (orderId: string, resultValue: string, isAbnormal: boolean, remarks: string) => {
    setLabOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          const updated: LabOrder = {
            ...ord,
            status: 'COMPLETED',
            resultValue,
            isAbnormal,
            clinicalRemarks: remarks,
            technicianName: currentUser.name,
            completedAt: new Date().toISOString()
          };
          logAudit('UPDATE', 'LAB', orderId, `Submitted lab test results for ${ord.testName} (${resultValue})`, ord.patientId, ord.patientUhid);
          addNotification({
            title: `Lab Result Ready: ${ord.testName}`,
            message: `Result for ${ord.patientName} is ready. ${isAbnormal ? 'Flagged as Abnormal!' : 'Normal range.'}`,
            type: isAbnormal ? 'urgent' : 'success',
            targetRoles: ['DOCTOR', 'NURSE', 'ADMIN', 'PATIENT']
          });
          return updated;
        }
        return ord;
      })
    );
  };

  // Ward & Bed Actions
  const admitToBed = (bedId: string, patientId: string, reason: string) => {
    const patient = patients.find(p => p.id === patientId);
    const bed = beds.find(b => b.id === bedId);
    if (!bed || !patient) return;

    setBeds(prev =>
      prev.map(b => (b.id === bedId ? {
        ...b,
        status: 'OCCUPIED' as BedStatus,
        currentPatientId: patient.id,
        currentPatientName: patient.fullName,
        currentPatientUhid: patient.uhid,
        admittedAt: new Date().toISOString()
      } : b))
    );

    const newAdmission: BedAdmission = {
      id: `adm-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      patientUhid: patient.uhid,
      bedId,
      bedNumber: bed.bedNumber,
      wardName: bed.wardName,
      admittedAt: new Date().toISOString(),
      reason,
      attendingDoctor: currentUser.name,
      status: 'ACTIVE'
    };
    setBedAdmissions(prev => [newAdmission, ...prev]);

    logAudit('ADMIT', 'BED', bedId, `Admitted ${patient.fullName} to ${bed.bedNumber} (${bed.wardName}). Reason: ${reason}`, patient.id, patient.uhid);
    addNotification({
      title: 'Patient Admitted to Bed',
      message: `${patient.fullName} admitted to ${bed.bedNumber} (${bed.wardName}).`,
      type: 'info',
      targetRoles: ['NURSE', 'DOCTOR', 'ADMIN']
    });
  };

  const dischargeFromBed = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (!bed) return;

    const patientName = bed.currentPatientName || 'Patient';
    const patientId = bed.currentPatientId;

    setBeds(prev =>
      prev.map(b => (b.id === bedId ? {
        ...b,
        status: 'CLEANING' as BedStatus,
        currentPatientId: undefined,
        currentPatientName: undefined,
        currentPatientUhid: undefined,
        admittedAt: undefined
      } : b))
    );

    setBedAdmissions(prev =>
      prev.map(adm => (adm.bedId === bedId && adm.status === 'ACTIVE' ? {
        ...adm,
        status: 'DISCHARGED',
        dischargedAt: new Date().toISOString()
      } : adm))
    );

    logAudit('DISCHARGE', 'BED', bedId, `Discharged ${patientName} from bed ${bed.bedNumber}`, patientId, bed.currentPatientUhid);
    addNotification({
      title: 'Bed Discharged',
      message: `${bed.bedNumber} is now vacant and queued for sanitation.`,
      type: 'info',
      targetRoles: ['NURSE', 'ADMIN']
    });
  };

  const updateBedStatus = (bedId: string, status: BedStatus) => {
    setBeds(prev => prev.map(b => (b.id === bedId ? { ...b, status } : b)));
    logAudit('UPDATE', 'BED', bedId, `Updated bed status to ${status}`);
  };

  // Billing Actions
  const createInvoice = (invData: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt'>): Invoice => {
    const nextNum = invoices.length + 190;
    const newInv: Invoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${String(nextNum).padStart(4, '0')}`,
      createdAt: new Date().toISOString()
    };
    setInvoices(prev => [newInv, ...prev]);
    logAudit('CREATE', 'BILLING', newInv.id, `Generated invoice #${newInv.invoiceNumber} for ${newInv.patientName}. Total: $${newInv.totalAmount.toFixed(2)}`, newInv.patientId, newInv.patientUhid);
    addNotification({
      title: 'Invoice Generated',
      message: `Invoice #${newInv.invoiceNumber} generated for ${newInv.patientName} ($${newInv.totalAmount.toFixed(2)}).`,
      type: 'info',
      targetRoles: ['ADMIN', 'RECEPTIONIST', 'PATIENT']
    });
    return newInv;
  };

  const recordPayment = (invoiceId: string, method: 'CASH' | 'CARD' | 'UPI' | 'INSURANCE', ref?: string) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          const updated: Invoice = {
            ...inv,
            status: 'PAID',
            paymentMethod: method,
            paidAt: new Date().toISOString(),
            transactionRef: ref || `TXN-${Date.now().toString().slice(-6)}`
          };
          logAudit('PAYMENT', 'BILLING', invoiceId, `Recorded payment of $${inv.totalAmount.toFixed(2)} via ${method} for ${inv.patientName}`, inv.patientId, inv.patientUhid);
          addNotification({
            title: 'Payment Received',
            message: `Invoice #${inv.invoiceNumber} has been marked as PAID via ${method}.`,
            type: 'success',
            targetRoles: ['ADMIN', 'RECEPTIONIST', 'PATIENT']
          });
          return updated;
        }
        return inv;
      })
    );
  };

  // Notification Actions
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const addNotification = (notifData: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <HospitalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        patients,
        addPatient,
        updatePatient,
        getPatientById,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        vitals,
        recordVitals,
        consultations,
        createConsultation,
        prescriptions,
        createPrescription,
        dispensePrescription,
        medicines,
        updateMedicineStock,
        addMedicine,
        labTests,
        labOrders,
        createLabOrder,
        updateLabOrderStatus,
        submitLabResult,
        beds,
        bedAdmissions,
        admitToBed,
        dischargeFromBed,
        updateBedStatus,
        invoices,
        createInvoice,
        recordPayment,
        auditLogs,
        logAudit,
        notifications,
        markNotificationAsRead,
        addNotification,
        darkMode,
        toggleDarkMode,
        activeTab,
        setActiveTab
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
