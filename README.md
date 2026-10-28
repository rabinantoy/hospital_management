# CarePulse Regional Hospital Management System (HMS)

CarePulse is an enterprise-grade, responsive healthcare management web application designed for hospitals, polyclinics, and regional health systems. It features role-based access control (RBAC) across 7 clinical and administrative roles, Electronic Medical Records (EMR), bed occupancy tracking, pharmacy dispensing, diagnostic laboratory orders, itemized tax invoices, and HIPAA/DPDP audit trails.

---

## 🏥 User Roles & Portal Capabilities

1. **Administrator (Admin)**: Full executive KPIs, hospital revenue analytics, staff directory, bed occupancy overview, system-wide HIPAA / DPDP audit inspection, and pharmacy stock thresholds.
2. **Physician (Doctor)**: Consultation agenda queue, vitals inspection, clinical encounter notes, ICD-10 diagnosis entry, e-prescriptions with dosage/frequency, and diagnostic lab test orders.
3. **Registered Nurse (Nurse)**: Inpatient bed floor map (ICU, General, Pediatric, Emergency), triage vitals recording (BP, SpO2, HR, temp, BMI), admission, and bed discharge.
4. **Receptionist**: Walk-in patient registration wizard with unique UHID generation (`CP-2026-XXXX`), doctor appointment slot scheduling, and patient arrival check-in.
5. **Pharmacist**: Prescription fulfillment queue, medicine inventory catalog, stock level alerts, and batch expiry tracking with live stock decrement.
6. **Laboratory Technician**: Diagnostic test orders worklist, specimen collection status (`ORDERED` -> `SAMPLE_COLLECTED` -> `IN_ANALYSIS` -> `COMPLETED`), result entry with abnormal flags, and official PDF report generation.
7. **Patient (Portal)**: Personal health vault with medical history and allergies, upcoming appointments with reschedule/cancel options, digital prescriptions, lab test reports, and online bill settlement.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts
- **Backend API**: Node.js & Express (REST API with JWT authentication and audit logger middleware)
- **Database & ORM**: PostgreSQL with Prisma ORM (`prisma/schema.prisma`)
- **Containerization**: Docker & Docker Compose (`docker-compose.yml`)
- **Security**: Role-Based Access Control (RBAC), HIPAA/DPDP access audit trail, client IP tracking, input validation

---

## 📁 Folder Structure

```
├── .env.example                     # Environment variables template
├── Dockerfile                       # Multi-stage production container build
├── docker-compose.yml               # App + PostgreSQL container orchestration
├── README.md                        # Setup and architecture documentation
├── prisma/
│   └── schema.prisma                # Complete 14-model PostgreSQL database schema
├── server/
│   ├── server.ts                    # Express REST API routes & middleware
│   └── tests/
│       ├── auth.test.ts             # Auth & RBAC unit tests
│       └── appointment.test.ts      # Appointment booking & slot availability tests
├── src/
│   ├── App.tsx                      # Root component & multi-role layout coordinator
│   ├── main.tsx                     # Entry point
│   ├── index.css                    # Tailwind CSS v4 and print styles
│   ├── types/
│   │   └── index.ts                 # TypeScript domain models and interfaces
│   ├── data/
│   │   └── mockHospitalData.ts      # Realistic clinical seed data for 7 roles
│   ├── context/
│   │   └── HospitalContext.tsx      # State management, local storage, audit logger
│   ├── components/
│   │   ├── common/                  # Header (search, role switcher) & Sidebar
│   │   └── modals/                  # Modals for Register, Book, Vitals, Consult,
│   │                                # Dispense, Lab Results, Invoice, Printables
│   └── views/                       # Dedicated dashboards for each user role
│       ├── AdminDashboard.tsx
│       ├── DoctorDashboard.tsx
│       ├── NurseDashboard.tsx
│       ├── ReceptionistDashboard.tsx
│       ├── PharmacistDashboard.tsx
│       ├── LabTechDashboard.tsx
│       ├── PatientPortal.tsx
│       ├── PatientsView.tsx
│       ├── AppointmentsView.tsx
│       ├── WardsView.tsx
│       ├── PharmacyView.tsx
│       ├── LaboratoryView.tsx
│       ├── BillingView.tsx
│       ├── StaffView.tsx
│       ├── AuditLogsView.tsx
│       └── AnalyticsView.tsx
```

---

## 🚀 Running the Project

### Option 1: Live Interactive Browser Preview
The web application runs out of the box with an in-memory client-persisted relational data store pre-populated with realistic clinical entities. Use the **Role Switcher** pill in the top navigation bar to test each role with zero setup.

### Option 2: Local Development with PostgreSQL & Prisma
1. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
2. Start PostgreSQL via Docker or local service:
   ```bash
   docker-compose up -d postgres
   ```
3. Run Prisma database migrations & client generation:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Option 3: Full Docker Orchestration
To run the full stack (Frontend, REST Backend, and PostgreSQL database) in isolated containers:
```bash
docker-compose up --build
```
Access the application at `http://localhost:3000`.

---

## 🛡️ Security & Compliance Highlights

- **HIPAA Security Rule / DPDP Act**: Every time a clinical record, vitals sheet, or lab order is viewed or modified, an immutable audit event is captured with Actor, Role, Target Patient UHID, Action (`VIEW`, `CREATE`, `DISPENSE`, etc.), Timestamp, and Client IP.
- **Role Isolation**: Only physicians can write prescriptions and clinical diagnoses; only pharmacists can dispense medicines and adjust inventory; only lab technologists can finalize diagnostic reports.
