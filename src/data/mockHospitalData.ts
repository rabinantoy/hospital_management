import {
  User,
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
  SystemNotification
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    email: 'admin@carepulse.hospital',
    role: 'ADMIN',
    name: 'Dr. Arthur Vance, MD, MHA',
    phone: '+1 (555) 234-5601',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=256&q=80',
    department: 'Hospital Administration',
    specialization: 'Chief Medical Officer',
    shift: 'General (09:00 - 18:00)'
  },
  {
    id: 'usr-doc-1',
    email: 'doctor@carepulse.hospital',
    role: 'DOCTOR',
    name: 'Dr. Sarah Lin, MD, FACC',
    phone: '+1 (555) 234-5602',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80',
    department: 'Cardiology',
    specialization: 'Interventional Cardiology',
    licenseNumber: 'MD-92841-CAR',
    shift: 'Morning (08:30 - 16:30)'
  },
  {
    id: 'usr-doc-2',
    email: 'doc.neuro@carepulse.hospital',
    role: 'DOCTOR',
    name: 'Dr. Marcus Sterling, MD',
    phone: '+1 (555) 234-5603',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=256&q=80',
    department: 'Neurology',
    specialization: 'Clinical Neurophysiology',
    licenseNumber: 'MD-83719-NEU',
    shift: 'General (09:00 - 17:00)'
  },
  {
    id: 'usr-nurse-1',
    email: 'nurse@carepulse.hospital',
    role: 'NURSE',
    name: 'Elena Rostova, RN, BSN',
    phone: '+1 (555) 234-5604',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813580-b26a45974026?auto=format&fit=crop&w=256&q=80',
    department: 'Intensive Care Unit (ICU)',
    specialization: 'Critical Care Nursing',
    shift: 'Day Shift (07:00 - 19:00)'
  },
  {
    id: 'usr-recep-1',
    email: 'reception@carepulse.hospital',
    role: 'RECEPTIONIST',
    name: 'Chloe Davenport',
    phone: '+1 (555) 234-5605',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    department: 'Front Desk & Patient Admissions',
    specialization: 'Patient Relations Lead',
    shift: 'Morning (08:00 - 16:00)'
  },
  {
    id: 'usr-pharm-1',
    email: 'pharmacy@carepulse.hospital',
    role: 'PHARMACIST',
    name: 'David O\'Connor, PharmD',
    phone: '+1 (555) 234-5606',
    avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=256&q=80',
    department: 'Central Hospital Pharmacy',
    specialization: 'Clinical Pharmacotherapy',
    licenseNumber: 'RPH-48190-CLIN',
    shift: 'General (09:00 - 17:00)'
  },
  {
    id: 'usr-lab-1',
    email: 'lab@carepulse.hospital',
    role: 'LAB_TECH',
    name: 'Kavita Patel, MLS(ASCP)',
    phone: '+1 (555) 234-5607',
    avatarUrl: 'https://images.unsplash.com/photo-1583912267670-6575ad472688?auto=format&fit=crop&w=256&q=80',
    department: 'Diagnostic Pathology & Biochemistry',
    specialization: 'Medical Laboratory Scientist',
    shift: 'General (08:30 - 17:00)'
  },
  {
    id: 'usr-patient-1',
    email: 'patient@carepulse.hospital',
    role: 'PATIENT',
    name: 'Robert Hastings',
    phone: '+1 (555) 912-4011',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    department: 'Patient Portal',
    shift: 'N/A'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    uhid: 'CP-2026-0041',
    userId: 'usr-patient-1',
    fullName: 'Robert Hastings',
    dateOfBirth: '1974-05-18',
    age: 52,
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 (555) 912-4011',
    email: 'patient@carepulse.hospital',
    address: '422 Elmwood Terrace, Suite 3B, Metro City',
    emergencyContact: {
      name: 'Claire Hastings',
      relationship: 'Spouse',
      phone: '+1 (555) 912-4012'
    },
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicDiseases: ['Hypertension (Stage 2)', 'Dyslipidemia'],
    insuranceProvider: 'BlueShield Premier Health',
    insurancePolicyNumber: 'BSP-8839210-99',
    registeredAt: '2025-11-14T09:20:00Z',
    documents: [
      { id: 'doc-1', title: 'Cardiac Echo Doppler Report', category: 'LAB', uploadedAt: '2026-02-10', fileSize: '2.4 MB' },
      { id: 'doc-2', title: 'Insurance Pre-Authorization Form', category: 'ID', uploadedAt: '2026-01-15', fileSize: '1.1 MB' }
    ]
  },
  {
    id: 'pat-2',
    uhid: 'CP-2026-0042',
    fullName: 'Maria Santos-Gomez',
    dateOfBirth: '1989-11-03',
    age: 36,
    gender: 'Female',
    bloodGroup: 'A+',
    phone: '+1 (555) 881-9922',
    email: 'm.santos@outlook.com',
    address: '78 Pinecrest Drive, Apt 4C, Metro City',
    emergencyContact: {
      name: 'Carlos Gomez',
      relationship: 'Brother',
      phone: '+1 (555) 881-9923'
    },
    allergies: ['Latex', 'NSAIDs (Ibuprofen)'],
    chronicDiseases: ['Type 2 Diabetes Mellitus', 'Mild Asthma'],
    insuranceProvider: 'Aetna Global Medical',
    insurancePolicyNumber: 'AET-49102-12',
    registeredAt: '2026-01-08T11:45:00Z',
    documents: [
      { id: 'doc-3', title: 'HbA1c Lab Summary 2026', category: 'LAB', uploadedAt: '2026-03-01', fileSize: '850 KB' }
    ]
  },
  {
    id: 'pat-3',
    uhid: 'CP-2026-0043',
    fullName: 'Jonathan Meyer',
    dateOfBirth: '1962-08-22',
    age: 64,
    gender: 'Male',
    bloodGroup: 'B-',
    phone: '+1 (555) 720-3341',
    email: 'jmeyer62@gmail.com',
    address: '1105 Lakeshore Blvd, Metro City',
    emergencyContact: {
      name: 'Rachel Meyer',
      relationship: 'Daughter',
      phone: '+1 (555) 720-3349'
    },
    allergies: ['Ciprofloxacin'],
    chronicDiseases: ['Coronary Artery Disease', 'Osteoarthritis'],
    insuranceProvider: 'United Healthcare Medicare Advantage',
    insurancePolicyNumber: 'UHC-992384-01',
    registeredAt: '2025-08-20T14:10:00Z',
    documents: [
      { id: 'doc-4', title: 'Coronary Angiogram Disc Image', category: 'LAB', uploadedAt: '2025-09-02', fileSize: '14.2 MB' }
    ]
  },
  {
    id: 'pat-4',
    uhid: 'CP-2026-0044',
    fullName: 'Aisha Al-Mansoor',
    dateOfBirth: '1998-03-12',
    age: 28,
    gender: 'Female',
    bloodGroup: 'AB+',
    phone: '+1 (555) 604-1290',
    email: 'aisha.almansoor@techcorp.io',
    address: '350 Sunset Avenue, Unit 802, Metro City',
    emergencyContact: {
      name: 'Tariq Al-Mansoor',
      relationship: 'Father',
      phone: '+1 (555) 604-1299'
    },
    allergies: ['No Known Drug Allergies (NKDA)'],
    chronicDiseases: [],
    insuranceProvider: 'Cigna Choice Plus',
    insurancePolicyNumber: 'CGN-55419-77',
    registeredAt: '2026-02-18T10:00:00Z',
    documents: []
  },
  {
    id: 'pat-5',
    uhid: 'CP-2026-0045',
    fullName: 'Liam Patrick Gallagher',
    dateOfBirth: '2016-09-14',
    age: 10,
    gender: 'Male',
    bloodGroup: 'O-',
    phone: '+1 (555) 431-7782',
    address: '14 Meadow Lane, Metro City',
    emergencyContact: {
      name: 'Fiona Gallagher',
      relationship: 'Mother',
      phone: '+1 (555) 431-7782'
    },
    allergies: ['Peanuts', 'Amoxicillin rash'],
    chronicDiseases: ['Seasonal Allergic Rhinitis'],
    insuranceProvider: 'BlueShield Family Shield',
    insurancePolicyNumber: 'BSP-110294-04',
    registeredAt: '2026-03-05T15:30:00Z',
    documents: []
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'pat-1',
    patientName: 'Robert Hastings',
    patientUhid: 'CP-2026-0041',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    doctorSpecialization: 'Interventional Cardiology',
    date: '2026-10-28',
    startTime: '09:30',
    endTime: '10:00',
    status: 'IN_PROGRESS',
    type: 'Follow-up',
    reason: 'Hypertension evaluation and post-angioplasty treadmill review',
    notes: 'Patient notes occasional morning dizziness when standing quickly.',
    createdAt: '2026-10-20T10:15:00Z'
  },
  {
    id: 'apt-2',
    patientId: 'pat-2',
    patientName: 'Maria Santos-Gomez',
    patientUhid: 'CP-2026-0042',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    doctorSpecialization: 'Interventional Cardiology',
    date: '2026-10-28',
    startTime: '10:30',
    endTime: '11:00',
    status: 'CHECKED_IN',
    type: 'OPD',
    reason: 'Exertional chest tightness and palpitations during climbing stairs',
    notes: 'Needs resting 12-lead ECG and baseline lipid evaluation.',
    createdAt: '2026-10-22T14:40:00Z'
  },
  {
    id: 'apt-3',
    patientId: 'pat-4',
    patientName: 'Aisha Al-Mansoor',
    patientUhid: 'CP-2026-0044',
    doctorId: 'usr-doc-2',
    doctorName: 'Dr. Marcus Sterling, MD',
    doctorSpecialization: 'Neurology',
    date: '2026-10-28',
    startTime: '11:30',
    endTime: '12:00',
    status: 'SCHEDULED',
    type: 'OPD',
    reason: 'Recurrent throbbing unilateral migraines with visual aura',
    notes: 'Started 3 months ago, worse under fluorescent lighting.',
    createdAt: '2026-10-24T09:10:00Z'
  },
  {
    id: 'apt-4',
    patientId: 'pat-3',
    patientName: 'Jonathan Meyer',
    patientUhid: 'CP-2026-0043',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    doctorSpecialization: 'Interventional Cardiology',
    date: '2026-10-28',
    startTime: '14:00',
    endTime: '14:30',
    status: 'SCHEDULED',
    type: 'Follow-up',
    reason: 'Post-stent 6-month clinical review and medication tolerance',
    notes: 'Checking dual antiplatelet compliance and INR levels.',
    createdAt: '2026-10-25T11:20:00Z'
  },
  {
    id: 'apt-5',
    patientId: 'pat-5',
    patientName: 'Liam Patrick Gallagher',
    patientUhid: 'CP-2026-0045',
    doctorId: 'usr-doc-2',
    doctorName: 'Dr. Marcus Sterling, MD',
    doctorSpecialization: 'Neurology',
    date: '2026-10-29',
    startTime: '10:00',
    endTime: '10:30',
    status: 'SCHEDULED',
    type: 'Routine Checkup',
    reason: 'Sleep disturbances and nocturnal twitching evaluation',
    createdAt: '2026-10-26T16:05:00Z'
  }
];

export const INITIAL_VITALS: VitalsRecord[] = [
  {
    id: 'vit-1',
    patientId: 'pat-1',
    patientUhid: 'CP-2026-0041',
    recordedBy: 'Elena Rostova, RN',
    recordedByRole: 'NURSE',
    systolicBp: 138,
    diastolicBp: 86,
    heartRate: 74,
    temperatureF: 98.4,
    oxygenSpO2: 98,
    respiratoryRate: 16,
    weightKg: 82.5,
    heightCm: 178,
    bmi: 26.0,
    notes: 'Patient took morning Losartan 2 hours prior to arrival. Alert, comfortable.',
    recordedAt: '2026-10-28T09:15:00Z'
  },
  {
    id: 'vit-2',
    patientId: 'pat-2',
    patientUhid: 'CP-2026-0042',
    recordedBy: 'Elena Rostova, RN',
    recordedByRole: 'NURSE',
    systolicBp: 142,
    diastolicBp: 92,
    heartRate: 88,
    temperatureF: 98.8,
    oxygenSpO2: 97,
    respiratoryRate: 18,
    weightKg: 68.0,
    heightCm: 162,
    bmi: 25.9,
    notes: 'Slightly anxious about chest discomfort. Resting quietly in triage.',
    recordedAt: '2026-10-28T10:10:00Z'
  },
  {
    id: 'vit-3',
    patientId: 'pat-3',
    patientUhid: 'CP-2026-0043',
    recordedBy: 'Elena Rostova, RN',
    recordedByRole: 'NURSE',
    systolicBp: 128,
    diastolicBp: 78,
    heartRate: 66,
    temperatureF: 98.2,
    oxygenSpO2: 99,
    respiratoryRate: 14,
    weightKg: 79.2,
    heightCm: 174,
    bmi: 26.2,
    notes: 'Inpatient observation in Ward Bed GEN-101. Vitals stable.',
    recordedAt: '2026-10-27T18:00:00Z'
  }
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'cns-1',
    patientId: 'pat-1',
    patientName: 'Robert Hastings',
    patientUhid: 'CP-2026-0041',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    doctorSpecialization: 'Interventional Cardiology',
    appointmentId: 'apt-1',
    chiefComplaint: 'Morning postural lightheadedness; follow-up hypertension and hyperlipidemia.',
    symptoms: 'Transient lightheadedness on standing; no syncope, no angina or shortness of breath.',
    diagnosis: 'I10 - Essential (primary) Hypertension; E78.0 - Pure Hypercholesterolemia',
    clinicalNotes: 'Cardiovascular exam reveals regular S1/S2 without murmurs. Lungs clear to auscultation bilaterally. Peripheral pulses 2+ throughout. Suspect mild orthostasis due to diuretic timing.',
    treatmentPlan: 'Adjust Atorvastatin to 20mg at bedtime; maintain Losartan 50mg PO daily with increased hydration. Ordered Fasting Lipid Panel & Comprehensive Metabolic Panel.',
    prescriptionId: 'rx-1',
    labOrderIds: ['lab-ord-1'],
    consultedAt: '2026-10-28T09:45:00Z'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-1',
    consultationId: 'cns-1',
    patientId: 'pat-1',
    patientName: 'Robert Hastings',
    patientUhid: 'CP-2026-0041',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    status: 'PENDING',
    items: [
      {
        id: 'rx-item-1',
        medicineId: 'med-1',
        medicineName: 'Atorvastatin Calcium',
        genericName: 'Atorvastatin',
        dosage: '20 mg',
        frequency: '0-0-1 (Once daily at bedtime)',
        durationDays: 30,
        instructions: 'Take with or without food. Avoid grapefruit juice.',
        isDispensed: false
      },
      {
        id: 'rx-item-2',
        medicineId: 'med-2',
        medicineName: 'Losartan Potassium',
        genericName: 'Losartan',
        dosage: '50 mg',
        frequency: '1-0-0 (Once daily in the morning)',
        durationDays: 30,
        instructions: 'Monitor blood pressure weekly. Stay hydrated.',
        isDispensed: false
      }
    ],
    createdAt: '2026-10-28T09:50:00Z'
  },
  {
    id: 'rx-2',
    patientId: 'pat-2',
    patientName: 'Maria Santos-Gomez',
    patientUhid: 'CP-2026-0042',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    status: 'DISPENSED',
    items: [
      {
        id: 'rx-item-3',
        medicineId: 'med-3',
        medicineName: 'Metformin Hydrochloride',
        genericName: 'Metformin',
        dosage: '500 mg',
        frequency: '1-0-1 (Twice daily with meals)',
        durationDays: 30,
        instructions: 'Take immediately with meals to minimize GI upset.',
        isDispensed: true
      }
    ],
    dispensedAt: '2026-10-27T14:30:00Z',
    dispensedBy: 'David O\'Connor, PharmD',
    createdAt: '2026-10-27T11:00:00Z'
  }
];

export const INITIAL_MEDICINES: Medicine[] = [
  {
    id: 'med-1',
    name: 'Atorvastatin Calcium',
    genericName: 'Atorvastatin',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '20mg',
    unitPrice: 14.50,
    stockQuantity: 420,
    reorderLevel: 100,
    batchNumber: 'BT-ATV-8821',
    expiryDate: '2027-11-30',
    supplier: 'Pfizer Healthcare Direct',
    location: 'Shelf C-04'
  },
  {
    id: 'med-2',
    name: 'Losartan Potassium',
    genericName: 'Losartan',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    strength: '50mg',
    unitPrice: 18.00,
    stockQuantity: 280,
    reorderLevel: 80,
    batchNumber: 'BT-LOS-4412',
    expiryDate: '2027-08-15',
    supplier: 'Merck Sharpe & Dohme',
    location: 'Shelf C-08'
  },
  {
    id: 'med-3',
    name: 'Metformin Hydrochloride',
    genericName: 'Metformin',
    category: 'Antidiabetic',
    dosageForm: 'Tablet',
    strength: '500mg',
    unitPrice: 9.75,
    stockQuantity: 550,
    reorderLevel: 120,
    batchNumber: 'BT-MET-9910',
    expiryDate: '2028-01-30',
    supplier: 'Novartis Pharmaceuticals',
    location: 'Shelf D-02'
  },
  {
    id: 'med-4',
    name: 'Amoxicillin + Clavulanic Acid',
    genericName: 'Augmentin',
    category: 'Antibiotic',
    dosageForm: 'Tablet',
    strength: '625mg',
    unitPrice: 22.00,
    stockQuantity: 42, // LOW STOCK!
    reorderLevel: 60,
    batchNumber: 'BT-AUG-1029',
    expiryDate: '2026-12-15', // EXPIRING SOON!
    supplier: 'GSK Life Sciences',
    location: 'Shelf A-02'
  },
  {
    id: 'med-5',
    name: 'Paracetamol / Acetaminophen',
    genericName: 'Paracetamol',
    category: 'Antipyretic',
    dosageForm: 'Tablet',
    strength: '650mg',
    unitPrice: 4.25,
    stockQuantity: 1200,
    reorderLevel: 250,
    batchNumber: 'BT-PCM-3391',
    expiryDate: '2028-06-30',
    supplier: 'Abbott Healthcare',
    location: 'Shelf B-01'
  },
  {
    id: 'med-6',
    name: 'Levothyroxine Sodium',
    genericName: 'Levothyroxine',
    category: 'Other',
    dosageForm: 'Tablet',
    strength: '50mcg',
    unitPrice: 11.20,
    stockQuantity: 18, // URGENT LOW STOCK!
    reorderLevel: 50,
    batchNumber: 'BT-LVO-6623',
    expiryDate: '2027-04-10',
    supplier: 'AbbVie Laboratories',
    location: 'Shelf E-05'
  },
  {
    id: 'med-7',
    name: 'Albuterol Sulfate Inhalation Aerosol',
    genericName: 'Albuterol',
    category: 'Respiratory',
    dosageForm: 'Drops',
    strength: '90mcg/actuation',
    unitPrice: 38.50,
    stockQuantity: 75,
    reorderLevel: 30,
    batchNumber: 'BT-ALB-7719',
    expiryDate: '2027-09-30',
    supplier: 'Teva Respiratory',
    location: 'Refrigerated Bay R-01'
  }
];

export const INITIAL_LAB_TESTS: LabTest[] = [
  {
    id: 'test-1',
    name: 'Complete Blood Count (CBC) with Differential',
    code: 'CBC-DIFF',
    category: 'Hematology',
    sampleType: 'Blood (EDTA)',
    turnaroundHours: 3,
    price: 35.00,
    normalRange: 'WBC: 4.5-11.0 K/uL, RBC: 4.2-5.9 M/uL, Hgb: 13.5-17.5 g/dL, Plt: 150-450 K/uL',
    unit: 'Standard Panel'
  },
  {
    id: 'test-2',
    name: 'Comprehensive Lipid Profile',
    code: 'LIPID-PANEL',
    category: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundHours: 4,
    price: 45.00,
    normalRange: 'Total Chol < 200 mg/dL, Triglycerides < 150 mg/dL, HDL > 40 mg/dL, LDL < 100 mg/dL',
    unit: 'mg/dL'
  },
  {
    id: 'test-3',
    name: 'Glycated Hemoglobin (HbA1c)',
    code: 'HBA1C',
    category: 'Biochemistry',
    sampleType: 'Blood (EDTA)',
    turnaroundHours: 2,
    price: 30.00,
    normalRange: 'Normal: < 5.7%, Pre-diabetic: 5.7-6.4%, Diabetic: >= 6.5%',
    unit: '%'
  },
  {
    id: 'test-4',
    name: 'Liver Function Test (LFT Panel)',
    code: 'LFT-COMP',
    category: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundHours: 4,
    price: 55.00,
    normalRange: 'ALT: 7-56 U/L, AST: 10-40 U/L, Bilirubin: 0.1-1.2 mg/dL, Albumin: 3.5-5.0 g/dL',
    unit: 'U/L'
  },
  {
    id: 'test-5',
    name: 'Serum Creatinine & eGFR (Renal Function)',
    code: 'KFT-CREAT',
    category: 'Biochemistry',
    sampleType: 'Serum',
    turnaroundHours: 3,
    price: 28.00,
    normalRange: 'Creatinine: 0.7-1.3 mg/dL, eGFR: > 90 mL/min/1.73m²',
    unit: 'mg/dL'
  }
];

export const INITIAL_LAB_ORDERS: LabOrder[] = [
  {
    id: 'lab-ord-1',
    testId: 'test-2',
    testName: 'Comprehensive Lipid Profile',
    testCode: 'LIPID-PANEL',
    patientId: 'pat-1',
    patientName: 'Robert Hastings',
    patientUhid: 'CP-2026-0041',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    status: 'IN_ANALYSIS',
    sampleCollectedAt: '2026-10-28T09:55:00Z',
    technicianName: 'Kavita Patel, MLS',
    orderedAt: '2026-10-28T09:48:00Z',
    clinicalRemarks: 'Evaluate statin therapy efficacy'
  },
  {
    id: 'lab-ord-2',
    testId: 'test-1',
    testName: 'Complete Blood Count (CBC) with Differential',
    testCode: 'CBC-DIFF',
    patientId: 'pat-2',
    patientName: 'Maria Santos-Gomez',
    patientUhid: 'CP-2026-0042',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    status: 'ORDERED',
    orderedAt: '2026-10-28T10:15:00Z',
    clinicalRemarks: 'Rule out occult infection or anemia'
  },
  {
    id: 'lab-ord-3',
    testId: 'test-3',
    testName: 'Glycated Hemoglobin (HbA1c)',
    testCode: 'HBA1C',
    patientId: 'pat-3',
    patientName: 'Jonathan Meyer',
    patientUhid: 'CP-2026-0043',
    doctorId: 'usr-doc-1',
    doctorName: 'Dr. Sarah Lin, MD, FACC',
    status: 'COMPLETED',
    sampleCollectedAt: '2026-10-27T08:30:00Z',
    resultValue: '7.1%',
    unit: '%',
    normalRange: '< 5.7%',
    isAbnormal: true,
    clinicalRemarks: 'Sub-optimally controlled glycemic index. Endocrinologist consult recommended.',
    technicianName: 'Kavita Patel, MLS',
    orderedAt: '2026-10-26T16:00:00Z',
    completedAt: '2026-10-27T11:45:00Z'
  }
];

export const INITIAL_BEDS: Bed[] = [
  // ICU WARD
  { id: 'bed-1', wardId: 'w-icu', wardName: 'Intensive Care Unit (ICU)', wardType: 'ICU', bedNumber: 'ICU-01', status: 'OCCUPIED', currentPatientId: 'pat-3', currentPatientName: 'Jonathan Meyer', currentPatientUhid: 'CP-2026-0043', admittedAt: '2026-10-27T16:00:00Z', chargePerDay: 750 },
  { id: 'bed-2', wardId: 'w-icu', wardName: 'Intensive Care Unit (ICU)', wardType: 'ICU', bedNumber: 'ICU-02', status: 'AVAILABLE', chargePerDay: 750 },
  { id: 'bed-3', wardId: 'w-icu', wardName: 'Intensive Care Unit (ICU)', wardType: 'ICU', bedNumber: 'ICU-03', status: 'AVAILABLE', chargePerDay: 750 },
  { id: 'bed-4', wardId: 'w-icu', wardName: 'Intensive Care Unit (ICU)', wardType: 'ICU', bedNumber: 'ICU-04', status: 'MAINTENANCE', chargePerDay: 750 },

  // GENERAL WARD A
  { id: 'bed-5', wardId: 'w-gen-a', wardName: 'General Ward A (Medical)', wardType: 'GENERAL', bedNumber: 'GEN-101', status: 'AVAILABLE', chargePerDay: 180 },
  { id: 'bed-6', wardId: 'w-gen-a', wardName: 'General Ward A (Medical)', wardType: 'GENERAL', bedNumber: 'GEN-102', status: 'AVAILABLE', chargePerDay: 180 },
  { id: 'bed-7', wardId: 'w-gen-a', wardName: 'General Ward A (Medical)', wardType: 'GENERAL', bedNumber: 'GEN-103', status: 'CLEANING', chargePerDay: 180 },
  { id: 'bed-8', wardId: 'w-gen-a', wardName: 'General Ward A (Medical)', wardType: 'GENERAL', bedNumber: 'GEN-104', status: 'AVAILABLE', chargePerDay: 180 },

  // EMERGENCY TRIAGE
  { id: 'bed-9', wardId: 'w-emg', wardName: 'Emergency & Acute Trauma', wardType: 'EMERGENCY', bedNumber: 'ER-BAY-1', status: 'OCCUPIED', currentPatientId: 'pat-1', currentPatientName: 'Robert Hastings', currentPatientUhid: 'CP-2026-0041', admittedAt: '2026-10-28T09:10:00Z', chargePerDay: 400 },
  { id: 'bed-10', wardId: 'w-emg', wardName: 'Emergency & Acute Trauma', wardType: 'EMERGENCY', bedNumber: 'ER-BAY-2', status: 'AVAILABLE', chargePerDay: 400 },

  // PEDIATRIC
  { id: 'bed-11', wardId: 'w-ped', wardName: 'Pediatric Care Ward', wardType: 'PEDIATRIC', bedNumber: 'PED-201', status: 'AVAILABLE', chargePerDay: 220 },
  { id: 'bed-12', wardId: 'w-ped', wardName: 'Pediatric Care Ward', wardType: 'PEDIATRIC', bedNumber: 'PED-202', status: 'AVAILABLE', chargePerDay: 220 }
];

export const INITIAL_BED_ADMISSIONS: BedAdmission[] = [
  {
    id: 'adm-1',
    patientId: 'pat-3',
    patientName: 'Jonathan Meyer',
    patientUhid: 'CP-2026-0043',
    bedId: 'bed-1',
    bedNumber: 'ICU-01',
    wardName: 'Intensive Care Unit (ICU)',
    admittedAt: '2026-10-27T16:00:00Z',
    reason: 'Acute telemetry observation post-coronary catheterization',
    attendingDoctor: 'Dr. Sarah Lin, MD, FACC',
    status: 'ACTIVE'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2026-0189',
    patientId: 'pat-1',
    patientName: 'Robert Hastings',
    patientUhid: 'CP-2026-0041',
    items: [
      { id: 'item-1', description: 'Specialist Cardiology Consultation (Dr. Sarah Lin)', category: 'CONSULTATION', quantity: 1, unitPrice: 120.00, total: 120.00 },
      { id: 'item-2', description: 'Comprehensive Lipid Profile (LIPID-PANEL)', category: 'LAB', quantity: 1, unitPrice: 45.00, total: 45.00 },
      { id: 'item-3', description: 'Emergency Observation Bay Care (2 Hours)', category: 'BED', quantity: 1, unitPrice: 80.00, total: 80.00 }
    ],
    subtotal: 245.00,
    discount: 20.00,
    tax: 11.25,
    totalAmount: 236.25,
    status: 'PENDING',
    createdAt: '2026-10-28T10:05:00Z',
    insuranceClaim: {
      provider: 'BlueShield Premier Health',
      policyNumber: 'BSP-8839210-99',
      approvalCode: 'AUTH-99214',
      claimedAmount: 180.00
    }
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2026-0188',
    patientId: 'pat-2',
    patientName: 'Maria Santos-Gomez',
    patientUhid: 'CP-2026-0042',
    items: [
      { id: 'item-4', description: 'Outpatient Triage Consultation', category: 'CONSULTATION', quantity: 1, unitPrice: 90.00, total: 90.00 },
      { id: 'item-5', description: 'Metformin Hydrochloride 500mg (60 tabs)', category: 'PHARMACY', quantity: 1, unitPrice: 19.50, total: 19.50 }
    ],
    subtotal: 109.50,
    discount: 0,
    tax: 5.48,
    totalAmount: 114.98,
    status: 'PAID',
    paymentMethod: 'UPI',
    paidAt: '2026-10-27T15:00:00Z',
    transactionRef: 'UPI-TXN-88129034',
    createdAt: '2026-10-27T14:40:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-1',
    userId: 'usr-doc-1',
    userName: 'Dr. Sarah Lin, MD, FACC',
    userRole: 'DOCTOR',
    patientId: 'pat-1',
    patientUhid: 'CP-2026-0041',
    action: 'VIEW',
    entityType: 'EMR',
    entityId: 'pat-1',
    details: 'Viewed patient past medical history, Doppler reports, and recent vital signs.',
    ipAddress: '192.168.10.45',
    timestamp: '2026-10-28T09:32:10Z'
  },
  {
    id: 'aud-2',
    userId: 'usr-nurse-1',
    userName: 'Elena Rostova, RN',
    userRole: 'NURSE',
    patientId: 'pat-1',
    patientUhid: 'CP-2026-0041',
    action: 'CREATE',
    entityType: 'VITALS',
    entityId: 'vit-1',
    details: 'Recorded baseline vitals: BP 138/86, HR 74, SpO2 98%.',
    ipAddress: '192.168.10.88',
    timestamp: '2026-10-28T09:15:35Z'
  },
  {
    id: 'aud-3',
    userId: 'usr-pharm-1',
    userName: 'David O\'Connor, PharmD',
    userRole: 'PHARMACIST',
    patientId: 'pat-2',
    patientUhid: 'CP-2026-0042',
    action: 'DISPENSE',
    entityType: 'PHARMACY',
    entityId: 'rx-2',
    details: 'Dispensed Metformin 500mg against Prescription RX-2. Stock decremented by 60.',
    ipAddress: '192.168.12.19',
    timestamp: '2026-10-27T14:30:12Z'
  },
  {
    id: 'aud-4',
    userId: 'usr-recep-1',
    userName: 'Chloe Davenport',
    userRole: 'RECEPTIONIST',
    patientId: 'pat-2',
    patientUhid: 'CP-2026-0042',
    action: 'UPDATE',
    entityType: 'APPOINTMENT',
    entityId: 'apt-2',
    details: 'Checked-in patient Maria Santos-Gomez for Cardiology OPD slot.',
    ipAddress: '192.168.10.12',
    timestamp: '2026-10-28T10:05:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Low Stock Alert: Augmentin 625mg',
    message: 'Augmentin 625mg is down to 42 units (below threshold of 60). Expiring Dec 2026.',
    type: 'warning',
    targetRoles: ['ADMIN', 'PHARMACIST'],
    timestamp: '2026-10-28T08:00:00Z',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Stat Lab Result Completed: HbA1c',
    message: 'HbA1c for Jonathan Meyer (CP-2026-0043) is 7.1% (High). Available in EMR.',
    type: 'urgent',
    targetRoles: ['DOCTOR', 'NURSE', 'ADMIN'],
    timestamp: '2026-10-27T11:46:00Z',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Patient Checked-In: Maria Santos-Gomez',
    message: 'Checked-in for Cardiology consultation with Dr. Sarah Lin (Slot 10:30).',
    type: 'info',
    targetRoles: ['DOCTOR', 'NURSE', 'RECEPTIONIST'],
    timestamp: '2026-10-28T10:06:00Z',
    read: true
  }
];
