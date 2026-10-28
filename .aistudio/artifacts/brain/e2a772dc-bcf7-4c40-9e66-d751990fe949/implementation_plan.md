# CarePulse Hospital Management System (HMS)

A responsive, enterprise-grade healthcare management platform providing role-based access control across 7 clinical and administrative roles, comprehensive Electronic Medical Records (EMR), automated pharmacy dispensing, bed occupancy tracking, diagnostic lab workflows, and itemized billing.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> To support both live browser evaluation in AI Studio and production Docker containerization with PostgreSQL and Prisma ORM, we implement a **Dual-Architecture pattern**:
> 1. **Live Interactive Engine**: Full-stack in-memory + client-persisted REST and simulated Prisma data store pre-seeded with realistic clinical data across all 7 roles, allowing instant zero-setup demonstration in the preview environment.
> 2. **Production-Ready Artifacts**: Complete production Prisma schema (`prisma/schema.prisma`), Express REST controllers/middleware, database migration scripts, `docker-compose.yml`, environment configuration, and Jest/Supertest test suites for auth and appointment booking.

- **Confirmed Branding**: CarePulse Regional Hospital (clinical deep teal `#0D9488`, slate navy `#0F172A`, crisp high-contrast medical surface `#F8FAFC`, dark mode support).
- **Interactive Multi-Role Switcher**: Persistent top role switcher allowing instantaneous evaluation of Admin, Doctor, Nurse, Receptionist, Pharmacist, Lab Technician, and Patient portals with pre-populated credentials.
- **HIPAA / DPDP Compliance**: Complete immutable audit log capturing user ID, timestamp, patient UHID, action (`VIEW`, `EDIT`, `DISPENSE`, `ADMIT`, `EXPORT`), and IP address.

---

## 1. Overview & Core Concept

CarePulse connects clinical staff, administrators, and patients through a centralized clinical information system. The system optimizes patient throughput, eliminates medication dispensing errors, tracks ward bed occupancy in real time, and streamlines billing from outpatient consultation to inpatient discharge.

### Target Personas & Core Capabilities

| Role | Primary Responsibilities & Daily Workflows | Key Dashboards & Controls |
| :--- | :--- | :--- |
| **Admin** | Staff lifecycle, departments, room pricing, financial reporting, system audit logs | Executive KPI widgets, department revenue, audit inspection table |
| **Doctor** | Consultation queue, clinical visit notes, ICD-10 diagnoses, e-prescriptions, lab orders | Daily appointment agenda, patient EMR timeline, quick prescription writer |
| **Nurse** | Vitals recording (BP, SpO2, temp, pulse), bed allocation, inpatient observation | Vitals recording modal, ward floor tracker, rapid patient lookup |
| **Receptionist** | Patient registration (UHID), doctor slot availability, appointment scheduling, check-in | Quick registration wizard, multi-doctor calendar slot picker, queue desk |
| **Pharmacist** | Prescription verification, medicine batch tracking, inventory expiry & reorder levels | Dispensing queue, stock alert badges, batch update modal |
| **Lab Tech** | Diagnostic orders, specimen collection status, test parameter entry, report issuance | Lab order queue, parameter normal-range checker, report generation |
| **Patient** | Appointment self-booking, health record timeline, digital prescriptions, bill payment | Personal medical vault, upcoming bookings, downloadable PDF invoices |

---

## 2. User Experience & Visual Design

### Design Language & Aesthetic Direction
- **Palette**: Deep slate canvas (`#0F172A` in dark mode, `#F8FAFC` in light mode), Clinical Teal primary (`#0D9488`), Muted Cyan hover (`#047857`), Alert Crimson (`#EF4444`), Warning Amber (`#F59E0B`), and Subtle Slate borders (`#E2E8F0` / `#1E293B`).
- **Typography**: Clean sans-serif hierarchy using `Plus Jakarta Sans` for headers and UI controls, paired with tabular numbers (`tabular-nums`) and monospace elements (`IBM Plex Mono`) for clinical vitals, lab values, invoices, and UHID identifiers.
- **Visual Discipline**: Zero-pill metadata tags, clean typographic separators (`·`, `/`), hairline surface borders, and high scannability for fast-paced hospital environments.

### Key User Flows

```
[ Receptionist / Patient ] ────► Register / Select Doctor ────► Slot Picker ────► Booked (Status: Scheduled)
                                                                                       │
                                                                                       ▼
[ Receptionist ] ──────────────► Check-In Patient ────────────► Queue Active (Status: Checked-In)
                                                                                       │
                                                                                       ▼
[ Nurse ] ─────────────────────► Record Vitals (BP, HR, Temp, SpO2) ───────────► Vitals Recorded
                                                                                       │
                                                                                       ▼
[ Doctor ] ────────────────────► Clinical Consultation ───────► Diagnosis + E-Prescription + Lab Order
                                                                      │                       │
                                    ┌─────────────────────────────────┘                       └────────────────────────┐
                                    ▼                                                                                  ▼
                         [ Pharmacist Dispense ]                                                            [ Lab Tech Processing ]
                         Verify Stock -> Dispense                                                           Collect Sample -> Results
                                    │                                                                                  │
                                    └─────────────────────────────────┬────────────────────────────────────────────────┘
                                                                      ▼
                                                          [ Billing & Invoice ]
                                             Itemized Bill: Consultation + Meds + Lab + Bed
                                                                      │
                                                                      ▼
                                                    Payment (Cash/Card/UPI/Insurance)
```

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Architecture (Interactive In-App Engine + Production Prisma/Docker Files)**
  - *Chosen Approach*: Deliver a self-contained in-memory relational REST client and server layer with pre-seeded data for instant preview testing, while also authoring the exact production `prisma/schema.prisma`, Express controllers, database seeds, and `docker-compose.yml`.
  - *Why*: Ensures the application can be evaluated immediately without external database dependencies, while providing 100% compliant production artifacts.
- **Decision 2: Universal Patient Identifier (UHID) Structure**
  - *Chosen Approach*: Structured unique ID format `CP-YYYY-XXXX` (e.g., `CP-2026-0142`) for patient identification and barcoding.
  - *Why*: Standard clinical practice preventing record collision across identical names.
- **Decision 3: Immutable Audit Trail**
  - *Chosen Approach*: Every read and write to sensitive patient records creates an unmodifiable audit event containing actor ID, role, target patient UHID, action type, and timestamp.
  - *Why*: Strict adherence to healthcare compliance (HIPAA Security Rule / DPDP Act).

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CAREPULSE FRONTEND (React 19)                   │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar (Role Switcher, Notifications Center, Global Patient Search)  │
│  Sidebar Navigation (Dynamic based on RBAC Token & Role)               │
├────────────────────────────────────────────────────────────────────────┤
│  [Views & Feature Modules]                                             │
│  ├── Admin Overview (KPI Cards, Financial Trends, Audit Logs)          │
│  ├── Patient Directory (Registration Wizard, Filter, Demographics)     │
│  ├── EMR & Clinical Records (Timeline, Vitals Tracker, Diagnoses)      │
│  ├── Appointment Hub (Doctor Availability, Calendar & Slot Booking)    │
│  ├── Pharmacy & Inventory (Catalog, Expiry/Low-Stock, Dispensing)      │
│  ├── Laboratory (Test Catalog, Order Tracking, Result Entry, Reports)  │
│  ├── Wards & Beds (Floor Map, ICU/General Status, Bed Allocation)      │
│  └── Billing & Invoices (Itemized Breakdown, Payment, PDF Generation)  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ HTTPS / REST (JWT Bearer Auth)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       EXPRESS REST BACKEND API                         │
├────────────────────────────────────────────────────────────────────────┤
│  Middleware: Helmet, CORS, Rate-Limiting, JWT Verification, RBAC Guard │
│  Audit Logger: Intercepts /api/patients/* and /api/emr/* requests      │
├────────────────────────────────────────────────────────────────────────┤
│  API Route Handlers:                                                   │
│  ├── /api/auth (login, register, refresh, me)                          │
│  ├── /api/patients (CRUD, search, allergies, medical history)          │
│  ├── /api/appointments (slots, book, reschedule, cancel, status)       │
│  ├── /api/doctors & /api/staff (departments, shifts, specializations)  │
│  ├── /api/emr (consultations, vitals, prescriptions, diagnoses)        │
│  ├── /api/pharmacy (medicines, batches, dispense, stock alerts)        │
│  ├── /api/lab (tests, orders, specimens, results)                      │
│  ├── /api/wards (wards, beds, admit, transfer, discharge)              │
│  ├── /api/billing (invoices, payments, insurance claims)               │
│  └── /api/reports (occupancy, revenue, volume stats)                   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Prisma ORM Client
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   POSTGRESQL RELATIONAL DATABASE                       │
│  14 Relational Models: Users, Patients, Appointments, Vitals,          │
│  Consultations, Prescriptions, Medicines, LabTests, LabOrders,         │
│  Wards, Beds, Invoices, InvoiceItems, AuditLogs                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Relational Database Schema (Prisma ER Model)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  ADMIN
  DOCTOR
  NURSE
  RECEPTIONIST
  PHARMACIST
  LAB_TECH
  PATIENT
}

enum AppointmentStatus {
  SCHEDULED
  CHECKED_IN
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}

enum BedStatus {
  AVAILABLE
  OCCUPIED
  MAINTENANCE
  CLEANING
}

enum InvoiceStatus {
  DRAFT
  PENDING
  PAID
  CANCELLED
  PARTIALLY_PAID
}

model User {
  id             String         @id @default(uuid())
  email          String         @unique
  passwordHash   String
  role           Role
  name           String
  phone          String?
  avatarUrl      String?
  departmentId   String?
  department     Department?    @relation(fields: [departmentId], references: [id])
  specialization String?
  doctorProfile  DoctorProfile?
  nurseProfile   NurseProfile?
  patientProfile Patient?
  auditLogs      AuditLog[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model Department {
  id          String   @id @default(uuid())
  name        String   @unique
  code        String   @unique
  headDoctor  String?
  users       User[]
  wards       Ward[]
  createdAt   DateTime @default(now())
}

model Patient {
  id               String            @id @default(uuid())
  uhid             String            @unique // e.g. CP-2026-0042
  userId           String?           @unique
  user             User?             @relation(fields: [userId], references: [id])
  fullName         String
  dateOfBirth      DateTime
  gender           String
  bloodGroup       String
  phone            String
  email            String?
  address          String
  emergencyContact Json // { name, relationship, phone }
  allergies        String[]
  chronicDiseases  String[]
  appointments     Appointment[]
  consultations    Consultation[]
  vitals           VitalsRecord[]
  prescriptions    Prescription[]
  labOrders        LabOrder[]
  bedAdmissions    BedAdmission[]
  invoices         Invoice[]
  auditLogs        AuditLog[]
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt
}

model DoctorProfile {
  id             String        @id @default(uuid())
  userId         String        @unique
  user           User          @relation(fields: [userId], references: [id])
  licenseNumber  String        @unique
  qualifications String
  consultationFee Decimal
  availableDays  String[]      // ["MON", "TUE", "WED", "THU", "FRI"]
  slotDurationMin Int          @default(30)
  startHour      Int           @default(9)
  endHour        Int           @default(17)
  appointments   Appointment[]
  consultations  Consultation[]
}

model Appointment {
  id          String            @id @default(uuid())
  patientId   String
  patient     Patient           @relation(fields: [patientId], references: [id])
  doctorId    String
  doctor      DoctorProfile     @relation(fields: [doctorId], references: [id])
  date        DateTime
  startTime   String            // "10:00"
  endTime     String            // "10:30"
  reason      String
  status      AppointmentStatus @default(SCHEDULED)
  type        String            // "OPD", "Follow-up", "Emergency"
  notes       String?
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
}

model VitalsRecord {
  id             String    @id @default(uuid())
  patientId      String
  patient        Patient   @relation(fields: [patientId], references: [id])
  recordedById   String
  systolicBp     Int
  diastolicBp    Int
  heartRate      Int
  temperatureF   Decimal
  oxygenSpO2     Int
  respiratoryRate Int?
  weightKg       Decimal?
  heightCm       Decimal?
  notes          String?
  recordedAt     DateTime  @default(now())
}

model Consultation {
  id           String        @id @default(uuid())
  patientId    String
  patient      Patient       @relation(fields: [patientId], references: [id])
  doctorId     String
  doctor       DoctorProfile @relation(fields: [doctorId], references: [id])
  chiefComplaint String
  symptoms     String
  diagnosis    String        // Clinical assessment / ICD-10
  treatmentPlan String
  prescription Prescription?
  labOrders    LabOrder[]
  consultedAt  DateTime      @default(now())
}

model Medicine {
  id            String              @id @default(uuid())
  name          String
  genericName   String
  category      String              // Antibiotic, Analgesic, Antipyretic, etc.
  dosageForm    String              // Tablet, Syrup, Injection, Ointment
  strength      String              // "500mg", "10ml"
  unitPrice     Decimal
  stockQuantity Int
  reorderLevel  Int
  batchNumber   String
  expiryDate    DateTime
  supplier      String
  items         PrescriptionItem[]
}

model Prescription {
  id             String             @id @default(uuid())
  consultationId String?            @unique
  consultation   Consultation?      @relation(fields: [consultationId], references: [id])
  patientId      String
  patient        Patient            @relation(fields: [patientId], references: [id])
  doctorId       String
  items          PrescriptionItem[]
  status         String             // "PENDING", "DISPENSED", "PARTIALLY_DISPENSED"
  dispensedAt    DateTime?
  dispensedById  String?
  createdAt      DateTime           @default(now())
}

model PrescriptionItem {
  id             String       @id @default(uuid())
  prescriptionId String
  prescription   Prescription @relation(fields: [prescriptionId], references: [id])
  medicineId     String
  medicine       Medicine     @relation(fields: [medicineId], references: [id])
  dosage         String       // "1 tablet"
  frequency      String       // "1-0-1 (Twice daily after food)"
  durationDays   Int
  instructions   String?
  isDispensed    Boolean      @default(false)
}

model LabTest {
  id           String     @id @default(uuid())
  name         String
  code         String     @unique // "CBC", "LFT", "LIPID"
  department   String
  sampleType   String     // "Blood", "Urine", "Swab"
  turnaroundHrs Int
  price        Decimal
  normalRange  String
  orders       LabOrder[]
}

model LabOrder {
  id             String        @id @default(uuid())
  patientId      String
  patient        Patient       @relation(fields: [patientId], references: [id])
  testId         String
  test           LabTest       @relation(fields: [testId], references: [id])
  consultationId String?
  consultation   Consultation? @relation(fields: [consultationId], references: [id])
  status         String        // "ORDERED", "SAMPLE_COLLECTED", "IN_ANALYSIS", "COMPLETED"
  sampleCollectedAt DateTime?
  resultValue    String?
  clinicalRemarks String?
  technicianId   String?
  completedAt    DateTime?
  createdAt      DateTime      @default(now())
}

model Ward {
  id         String   @id @default(uuid())
  name       String
  type       String   // "ICU", "GENERAL", "PEDIATRIC", "MATERNITY", "EMERGENCY"
  departmentId String?
  department Department? @relation(fields: [departmentId], references: [id])
  floor      Int
  chargePerDay Decimal
  beds       Bed[]
}

model Bed {
  id          String         @id @default(uuid())
  wardId      String
  ward        Ward           @relation(fields: [wardId], references: [id])
  bedNumber   String         // e.g. "B-101", "ICU-04"
  status      BedStatus      @default(AVAILABLE)
  admissions  BedAdmission[]
}

model BedAdmission {
  id           String    @id @default(uuid())
  patientId    String
  patient      Patient   @relation(fields: [patientId], references: [id])
  bedId        String
  bed          Bed       @relation(fields: [bedId], references: [id])
  admittedAt   DateTime  @default(now())
  dischargedAt DateTime?
  reason       String
  admittedById String
}

model Invoice {
  id            String        @id @default(uuid())
  invoiceNumber String        @unique // e.g. "INV-2026-0038"
  patientId     String
  patient       Patient       @relation(fields: [patientId], references: [id])
  items         InvoiceItem[]
  subtotal      Decimal
  discount      Decimal       @default(0)
  taxRate       Decimal       @default(0.05)
  totalAmount   Decimal
  status        InvoiceStatus @default(PENDING)
  paymentMethod String?       // "CASH", "CARD", "UPI", "INSURANCE"
  paidAt        DateTime?
  insuranceInfo Json?         // { provider, policyNumber, approvalCode, claimAmount }
  createdAt     DateTime      @default(now())
}

model InvoiceItem {
  id          String   @id @default(uuid())
  invoiceId   String
  invoice     Invoice  @relation(fields: [invoiceId], references: [id])
  description String
  category    String   // "CONSULTATION", "LAB", "PHARMACY", "BED", "PROCEDURE"
  quantity    Int      @default(1)
  unitPrice   Decimal
  total       Decimal
}

model AuditLog {
  id         String   @id @default(uuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  patientId  String?
  patient    Patient? @relation(fields: [patientId], references: [id])
  action     String   // "VIEW_RECORD", "UPDATE_VITALS", "DISPENSE_MEDS", "CREATE_INVOICE"
  entityType String   // "PATIENT", "CONSULTATION", "LAB_ORDER", "PRESCRIPTION", "INVOICE"
  entityId   String
  details    String?
  ipAddress  String?
  timestamp  DateTime @default(now())
}
```

---

## 5. Directory Structure & Modular Layout

```
├── .env.example                     # Environment template (PORT, JWT_SECRET, DATABASE_URL)
├── Dockerfile                       # Multi-stage production container build
├── docker-compose.yml               # Complete orchestration (App + PostgreSQL)
├── README.md                        # Setup instructions, architecture overview & seed guide
├── prisma/
│   └── schema.prisma                # Full PostgreSQL schema with all relations
├── server/
│   ├── server.ts                    # Express app entry point & route registration
│   ├── config/                      # Environment & security config (helmet, cors, jwt)
│   ├── middleware/
│   │   ├── auth.middleware.ts       # JWT verification & claims decoding
│   │   ├── rbac.middleware.ts       # Role-Based Access Control gatekeeper
│   │   ├── audit.middleware.ts      # Automatic HIPAA/DPDP access log interceptor
│   │   └── validate.middleware.ts   # Zod request payload validation
│   ├── controllers/                 # Modular controllers
│   │   ├── auth.controller.ts
│   │   ├── patient.controller.ts
│   │   ├── appointment.controller.ts
│   │   ├── emr.controller.ts
│   │   ├── pharmacy.controller.ts
│   │   ├── lab.controller.ts
│   │   ├── ward.controller.ts
│   │   ├── billing.controller.ts
│   │   └── report.controller.ts
│   ├── db/
│   │   ├── mockData.ts              # Rich seed dataset with realistic clinical entities
│   │   └── store.ts                 # Full relational CRUD data store for API & preview
│   └── tests/
│       ├── auth.test.ts             # Jest / Supertest authentication tests
│       └── appointment.test.ts      # Appointment booking and availability tests
└── src/
    ├── main.tsx
    ├── App.tsx                      # Root layout, role switcher banner, global toast context
    ├── types/                       # Shared TypeScript clinical and user models
    ├── context/                     # AuthContext, NotificationContext, ThemeContext
    ├── components/
    │   ├── common/                  # Navbar, Sidebar, Modal, Badge, StatCard, DataTable
    │   ├── appointments/            # BookingModal, DoctorSlotGrid, CalendarView
    │   ├── patients/                # RegistrationModal, PatientProfileCard, UHIDBadge
    │   ├── emr/                     # VitalsRecordModal, PrescriptionForm, EMRTimeline
    │   ├── pharmacy/                # DispenseModal, LowStockAlerts, BatchTracker
    │   ├── lab/                     # ResultEntryModal, SampleStatusBadge, LabReportView
    │   ├── wards/                   # WardOccupancyMap, BedCard, AdmitPatientModal
    │   ├── billing/                 # InvoiceGenerator, PrintableInvoice, PaymentModal
    │   └── audit/                   # AuditLogTable with role and timestamp filters
    └── views/
        ├── AdminDashboard.tsx       # Executive overview, revenue, bed statistics, logs
        ├── DoctorDashboard.tsx      # Today's appointments, consult queue, quick write
        ├── NurseDashboard.tsx       # Inpatient vitals monitor, ward rounds, bed status
        ├── ReceptionistDashboard.tsx # Quick registration, slot booking, OPD queue
        ├── PharmacistDashboard.tsx  # Dispensing queue, inventory alerts, catalog
        ├── LabTechDashboard.tsx     # Pending test orders, specimen tracker, result entry
        ├── PatientPortal.tsx        # Personal appointments, prescriptions, bills, records
        └── LoginView.tsx            # Login with role tabs and demo credential autoloader
```

---

## 6. Execution & Step-by-Step Implementation Strategy

1. **Step 1: Core Foundation & Data Layer**
   - Install essential packages (`recharts`, `jspdf` or print engine, `zod`).
   - Setup typed domain models matching the Prisma schema.
   - Establish rich clinical seed data (sample doctors across Cardiology, Neurology, Pediatrics, Orthopedics; registered patients; active appointments; hospital beds; medicines and lab tests).
2. **Step 2: Authentication & RBAC Engine**
   - Implement JWT authentication simulation and state management (`AuthContext`).
   - Implement universal Demo Role Switcher to effortlessly navigate between the 7 roles.
   - Implement audit logger tracking every view and edit action.
3. **Step 3: Clinical Workflows (Patients, Appointments & EMR)**
   - Patient registration wizard with automatic UHID generation, emergency contacts, allergy tags.
   - Interactive appointment slot calendar with status progression (`Scheduled` -> `Checked-In` -> `In-Progress` -> `Completed`).
   - Doctor consultation encounter view: write diagnoses, enter vitals, generate digital prescriptions.
4. **Step 4: Ancillary Modules (Pharmacy, Lab, Wards & Billing)**
   - Pharmacy dispensing queue with real-time stock deductions and expiry alerts.
   - Diagnostic laboratory order management with specimen collection, result entry, and printable report modal.
   - Interactive visual ward & bed occupancy layout with bed admission/discharge modal.
   - Itemized billing engine calculating consultations, tests, medicines, and room rates, plus printable PDF invoice view.
5. **Step 5: Reports, Analytics & Auditing**
   - Recharts visual analytics: department revenue, daily patient volume, and ward occupancy metrics.
   - HIPAA/DPDP audit log inspection view for compliance monitoring.
6. **Step 6: Production Artifacts & Testing**
   - Generate production files (`prisma/schema.prisma`, `docker-compose.yml`, `Dockerfile`, `README.md`, Jest test specifications).
   - Verify compilation, responsiveness, and dark mode styling.
