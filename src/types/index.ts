export type Role =
  | 'ADMIN'
  | 'DOCTOR'
  | 'NURSE'
  | 'RECEPTIONIST'
  | 'PHARMACIST'
  | 'LAB_TECH'
  | 'PATIENT';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
  phone?: string;
  avatarUrl?: string;
  department?: string;
  specialization?: string;
  licenseNumber?: string;
  shift?: string; // e.g. "Morning (08:00 - 16:00)"
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface PatientDocument {
  id: string;
  title: string;
  category: 'LAB' | 'PRESCRIPTION' | 'ID' | 'DISCHARGE_SUMMARY';
  uploadedAt: string;
  fileSize: string;
}

export interface Patient {
  id: string;
  uhid: string; // e.g., "CP-2026-0101"
  userId?: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email?: string;
  address: string;
  emergencyContact: EmergencyContact;
  allergies: string[];
  chronicDiseases: string[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  registeredAt: string;
  documents?: PatientDocument[];
}

export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CHECKED_IN'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type AppointmentType = 'OPD' | 'Follow-up' | 'Emergency' | 'Routine Checkup';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "09:30"
  endTime: string; // "10:00"
  status: AppointmentStatus;
  type: AppointmentType;
  reason: string;
  notes?: string;
  createdAt: string;
}

export interface VitalsRecord {
  id: string;
  patientId: string;
  patientUhid: string;
  recordedBy: string; // Staff name
  recordedByRole: Role;
  systolicBp: number;
  diastolicBp: number;
  heartRate: number; // bpm
  temperatureF: number; // Fahrenheit
  oxygenSpO2: number; // Percentage (e.g. 98)
  respiratoryRate: number; // breaths/min
  weightKg: number;
  heightCm: number;
  bmi: number;
  notes?: string;
  recordedAt: string;
}

export interface PrescriptionItem {
  id: string;
  medicineId: string;
  medicineName: string;
  genericName: string;
  dosage: string; // e.g., "1 Tablet"
  frequency: string; // e.g., "1-0-1 (After Food)"
  durationDays: number;
  instructions?: string;
  isDispensed: boolean;
}

export interface Prescription {
  id: string;
  consultationId?: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  doctorId: string;
  doctorName: string;
  status: 'PENDING' | 'DISPENSED' | 'PARTIALLY_DISPENSED';
  items: PrescriptionItem[];
  dispensedAt?: string;
  dispensedBy?: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentId?: string;
  chiefComplaint: string;
  symptoms: string;
  diagnosis: string; // ICD-10 or clinical description
  clinicalNotes: string;
  treatmentPlan: string;
  prescriptionId?: string;
  labOrderIds?: string[];
  consultedAt: string;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Analgesic' | 'Antipyretic' | 'Cardiovascular' | 'Antidiabetic' | 'Respiratory' | 'GI' | 'Other';
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'Ointment' | 'Drops';
  strength: string; // "500mg", "10mg", "100ml"
  unitPrice: number;
  stockQuantity: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  supplier: string;
  location: string; // "Shelf A-14", "Cool Storage C-2"
}

export type LabOrderStatus = 'ORDERED' | 'SAMPLE_COLLECTED' | 'IN_ANALYSIS' | 'COMPLETED' | 'CANCELLED';

export interface LabTest {
  id: string;
  name: string;
  code: string; // "CBC", "LFT", "KFT", "LIPID", "HBA1C", "URINE-R"
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Pathology' | 'Radiology';
  sampleType: 'Blood (EDTA)' | 'Serum' | 'Urine' | 'Nasopharyngeal Swab' | 'X-Ray';
  turnaroundHours: number;
  price: number;
  normalRange: string;
  unit: string;
}

export interface LabOrder {
  id: string;
  testId: string;
  testName: string;
  testCode: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  doctorId: string;
  doctorName: string;
  status: LabOrderStatus;
  sampleCollectedAt?: string;
  resultValue?: string;
  unit?: string;
  normalRange?: string;
  isAbnormal?: boolean;
  clinicalRemarks?: string;
  technicianName?: string;
  orderedAt: string;
  completedAt?: string;
}

export type WardType = 'ICU' | 'GENERAL' | 'PEDIATRIC' | 'MATERNITY' | 'EMERGENCY' | 'CARDIAC_CARE';

export type BedStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';

export interface Bed {
  id: string;
  wardId: string;
  wardName: string;
  wardType: WardType;
  bedNumber: string; // "ICU-01", "GEN-104"
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  currentPatientUhid?: string;
  admittedAt?: string;
  chargePerDay: number;
}

export interface BedAdmission {
  id: string;
  patientId: string;
  patientName: string;
  patientUhid: string;
  bedId: string;
  bedNumber: string;
  wardName: string;
  admittedAt: string;
  dischargedAt?: string;
  reason: string;
  attendingDoctor: string;
  status: 'ACTIVE' | 'DISCHARGED';
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'CONSULTATION' | 'LAB' | 'PHARMACY' | 'BED' | 'PROCEDURE';
  quantity: number;
  unitPrice: number;
  total: number;
}

export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'PARTIALLY_PAID' | 'CANCELLED';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. "INV-2026-0812"
  patientId: string;
  patientName: string;
  patientUhid: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  totalAmount: number;
  status: InvoiceStatus;
  paymentMethod?: 'CASH' | 'CARD' | 'UPI' | 'INSURANCE';
  paidAt?: string;
  transactionRef?: string;
  insuranceClaim?: {
    provider: string;
    policyNumber: string;
    approvalCode: string;
    claimedAmount: number;
  };
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  patientId?: string;
  patientUhid?: string;
  action: 'VIEW' | 'CREATE' | 'UPDATE' | 'DELETE' | 'DISPENSE' | 'ADMIT' | 'DISCHARGE' | 'PAYMENT' | 'EXPORT';
  entityType: 'PATIENT' | 'APPOINTMENT' | 'EMR' | 'VITALS' | 'PRESCRIPTION' | 'PHARMACY' | 'LAB' | 'BED' | 'BILLING';
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  targetRoles: Role[];
  timestamp: string;
  read: boolean;
  link?: string;
}
