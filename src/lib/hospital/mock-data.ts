import type {
  HospitalStats,
  Patient,
  Appointment,
  IPDAdmission,
  Prescription,
  LabTestOrder,
  PatientBill,
  Doctor,
} from '@/src/types/hospitals';

export const MOCK_HOSPITAL_STATS: HospitalStats = {
  todayOPD: 84,
  todayOPDDelta: 12,
  occupiedBeds: 118,
  totalBeds: 150,
  todayRevenue: 142500,
  todayRevenueDelta: 8,
  pendingLabTests: 23,
  pendingPrescriptions: 11,
  scheduledSurgeries: 4,
  newPatients: 17,
};

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Priya Sharma', department: 'Cardiology', specialization: 'Interventional Cardiology', qualification: 'MBBS, MD, DM', phone: '9876543210', email: 'priya.sharma@hospital.com', isAvailable: true },
  { id: 'd2', name: 'Dr. Rajan Mehta', department: 'Orthopedics', specialization: 'Joint Replacement', qualification: 'MBBS, MS (Ortho)', phone: '9876543211', email: 'rajan.mehta@hospital.com', isAvailable: true },
  { id: 'd3', name: 'Dr. Ananya Krishnan', department: 'Neurology', specialization: 'Stroke & Epilepsy', qualification: 'MBBS, MD, DM (Neuro)', phone: '9876543212', email: 'ananya.k@hospital.com', isAvailable: false },
  { id: 'd4', name: 'Dr. Suresh Patel', department: 'General Medicine', specialization: 'Internal Medicine', qualification: 'MBBS, MD', phone: '9876543213', email: 'suresh.patel@hospital.com', isAvailable: true },
  { id: 'd5', name: 'Dr. Meera Iyer', department: 'Gynaecology', specialization: 'Maternal & Foetal Medicine', qualification: 'MBBS, MS (OBG)', phone: '9876543214', email: 'meera.iyer@hospital.com', isAvailable: true },
];

export const MOCK_PATIENTS: Patient[] = [
  { id: 'p1', mrn: 'MRN-2024-00001', firstName: 'Arjun', lastName: 'Kumar', dateOfBirth: '1985-03-15', gender: 'MALE', bloodGroup: 'B+', phone: '9876501001', email: 'arjun.k@gmail.com', address: '12, Anna Nagar', city: 'Chennai', emergencyContactName: 'Divya Kumar', emergencyContactPhone: '9876501002', status: 'ACTIVE', registeredAt: '2024-01-10T09:00:00Z', lastVisit: '2025-06-01T10:30:00Z' },
  { id: 'p2', mrn: 'MRN-2024-00002', firstName: 'Lakshmi', lastName: 'Venkat', dateOfBirth: '1972-08-22', gender: 'FEMALE', bloodGroup: 'O+', phone: '9876501003', email: '', address: '45, T Nagar', city: 'Chennai', emergencyContactName: 'Ravi Venkat', emergencyContactPhone: '9876501004', status: 'ACTIVE', registeredAt: '2024-01-12T11:00:00Z', lastVisit: '2025-06-05T14:00:00Z' },
  { id: 'p3', mrn: 'MRN-2024-00003', firstName: 'Mohammed', lastName: 'Salim', dateOfBirth: '1990-11-05', gender: 'MALE', bloodGroup: 'A+', phone: '9876501005', email: 'msalim@gmail.com', address: '78, Royapettah', city: 'Chennai', emergencyContactName: 'Fatima Salim', emergencyContactPhone: '9876501006', status: 'ACTIVE', registeredAt: '2024-02-01T08:30:00Z', lastVisit: '2025-05-28T09:00:00Z' },
  { id: 'p4', mrn: 'MRN-2024-00004', firstName: 'Sindhu', lastName: 'Rajan', dateOfBirth: '1998-06-18', gender: 'FEMALE', bloodGroup: 'AB+', phone: '9876501007', email: '', address: '3, Adyar', city: 'Chennai', emergencyContactName: 'Rajan M', emergencyContactPhone: '9876501008', status: 'ACTIVE', registeredAt: '2024-02-14T10:00:00Z' },
  { id: 'p5', mrn: 'MRN-2024-00005', firstName: 'Balaji', lastName: 'Narayanan', dateOfBirth: '1960-01-30', gender: 'MALE', bloodGroup: 'B-', phone: '9876501009', email: 'b.narayanan@yahoo.com', address: '22, Velachery', city: 'Chennai', emergencyContactName: 'Subha Balaji', emergencyContactPhone: '9876501010', status: 'ACTIVE', registeredAt: '2024-03-05T13:00:00Z', lastVisit: '2025-06-08T11:00:00Z' },
  { id: 'p6', mrn: 'MRN-2024-00006', firstName: 'Kavitha', lastName: 'Sundaram', dateOfBirth: '1955-09-12', gender: 'FEMALE', bloodGroup: 'O-', phone: '9876501011', email: '', address: '9, Perambur', city: 'Chennai', emergencyContactName: 'Sundaram R', emergencyContactPhone: '9876501012', status: 'DISCHARGED', registeredAt: '2024-01-20T09:00:00Z', lastVisit: '2025-04-15T16:00:00Z' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', patientId: 'p1', patientName: 'Arjun Kumar', patientMrn: 'MRN-2024-00001', doctorId: 'd1', doctorName: 'Dr. Priya Sharma', department: 'Cardiology', scheduledAt: new Date().toISOString().replace(/T\d{2}/, 'T09'), duration: 15, type: 'FOLLOW_UP', status: 'CHECKED_IN', chiefComplaint: 'Chest pain follow-up', tokenNumber: 3 },
  { id: 'a2', patientId: 'p2', patientName: 'Lakshmi Venkat', patientMrn: 'MRN-2024-00002', doctorId: 'd4', doctorName: 'Dr. Suresh Patel', department: 'General Medicine', scheduledAt: new Date().toISOString().replace(/T\d{2}/, 'T10'), duration: 15, type: 'NEW_VISIT', status: 'SCHEDULED', chiefComplaint: 'Fever, body ache', tokenNumber: 7 },
  { id: 'a3', patientId: 'p3', patientName: 'Mohammed Salim', patientMrn: 'MRN-2024-00003', doctorId: 'd2', doctorName: 'Dr. Rajan Mehta', department: 'Orthopedics', scheduledAt: new Date().toISOString().replace(/T\d{2}/, 'T11'), duration: 20, type: 'FOLLOW_UP', status: 'COMPLETED', chiefComplaint: 'Knee pain', tokenNumber: 2 },
  { id: 'a4', patientId: 'p4', patientName: 'Sindhu Rajan', patientMrn: 'MRN-2024-00004', doctorId: 'd5', doctorName: 'Dr. Meera Iyer', department: 'Gynaecology', scheduledAt: new Date().toISOString().replace(/T\d{2}/, 'T14'), duration: 20, type: 'NEW_VISIT', status: 'SCHEDULED', chiefComplaint: 'Routine checkup', tokenNumber: 1 },
  { id: 'a5', patientId: 'p5', patientName: 'Balaji Narayanan', patientMrn: 'MRN-2024-00005', doctorId: 'd3', doctorName: 'Dr. Ananya Krishnan', department: 'Neurology', scheduledAt: new Date().toISOString().replace(/T\d{2}/, 'T15'), duration: 30, type: 'FOLLOW_UP', status: 'SCHEDULED', chiefComplaint: 'Migraine management', tokenNumber: 5 },
  { id: 'a6', patientId: 'p6', patientName: 'Kavitha Sundaram', patientMrn: 'MRN-2024-00006', doctorId: 'd1', doctorName: 'Dr. Priya Sharma', department: 'Cardiology', scheduledAt: new Date().toISOString().replace(/T\d{2}/, 'T16'), duration: 15, type: 'EMERGENCY', status: 'CANCELLED', tokenNumber: 9 },
];

export const MOCK_IPD: IPDAdmission[] = [
  { id: 'i1', admissionNumber: 'IPD-2025-0142', patientId: 'p1', patientName: 'Arjun Kumar', patientMrn: 'MRN-2024-00001', admittingDoctorId: 'd1', admittingDoctorName: 'Dr. Priya Sharma', admissionDate: '2025-06-05T08:00:00Z', expectedDischarge: '2025-06-12T10:00:00Z', ward: 'PRIVATE', bedNumber: 'B-204', roomNumber: 'R-204', status: 'RECOVERING', diagnosis: 'Acute Myocardial Infarction', notes: 'Post-angioplasty recovery' },
  { id: 'i2', admissionNumber: 'IPD-2025-0143', patientId: 'p5', patientName: 'Balaji Narayanan', patientMrn: 'MRN-2024-00005', admittingDoctorId: 'd3', admittingDoctorName: 'Dr. Ananya Krishnan', admissionDate: '2025-06-08T14:00:00Z', expectedDischarge: '2025-06-14T10:00:00Z', ward: 'GENERAL', bedNumber: 'G-12', roomNumber: 'W-1', status: 'ADMITTED', diagnosis: 'Ischemic Stroke', notes: 'Under observation' },
  { id: 'i3', admissionNumber: 'IPD-2025-0140', patientId: 'p2', patientName: 'Lakshmi Venkat', patientMrn: 'MRN-2024-00002', admittingDoctorId: 'd4', admittingDoctorName: 'Dr. Suresh Patel', admissionDate: '2025-06-03T09:30:00Z', expectedDischarge: '2025-06-11T10:00:00Z', ward: 'ICU', bedNumber: 'ICU-3', roomNumber: 'ICU', status: 'ICU', diagnosis: 'Sepsis - severe', notes: 'On ventilator support' },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: 'rx1', prescriptionNumber: 'RX-2025-00891', patientId: 'p2', patientName: 'Lakshmi Venkat', patientMrn: 'MRN-2024-00002', doctorName: 'Dr. Suresh Patel', issuedAt: new Date().toISOString(), status: 'PENDING', items: [{ drugName: 'Paracetamol 500mg', dosage: '1 tab', frequency: 'TID', duration: '5 days', quantity: 15, dispensedQuantity: 0, instructions: 'After meals' }, { drugName: 'Azithromycin 500mg', dosage: '1 tab', frequency: 'OD', duration: '3 days', quantity: 3, dispensedQuantity: 0, instructions: 'After breakfast' }], totalAmount: 145 },
  { id: 'rx2', prescriptionNumber: 'RX-2025-00892', patientId: 'p3', patientName: 'Mohammed Salim', patientMrn: 'MRN-2024-00003', doctorName: 'Dr. Rajan Mehta', issuedAt: new Date().toISOString(), status: 'DISPENSED', items: [{ drugName: 'Diclofenac 50mg', dosage: '1 tab', frequency: 'BD', duration: '7 days', quantity: 14, dispensedQuantity: 14, instructions: 'After meals' }], totalAmount: 85 },
  { id: 'rx3', prescriptionNumber: 'RX-2025-00893', patientId: 'p1', patientName: 'Arjun Kumar', patientMrn: 'MRN-2024-00001', doctorName: 'Dr. Priya Sharma', issuedAt: new Date().toISOString(), status: 'PARTIAL', items: [{ drugName: 'Aspirin 75mg', dosage: '1 tab', frequency: 'OD', duration: '30 days', quantity: 30, dispensedQuantity: 15 }, { drugName: 'Atorvastatin 40mg', dosage: '1 tab', frequency: 'OD', duration: '30 days', quantity: 30, dispensedQuantity: 0 }], totalAmount: 320 },
];

export const MOCK_LAB_ORDERS: LabTestOrder[] = [
  { id: 'l1', orderNumber: 'LAB-2025-01234', patientId: 'p1', patientName: 'Arjun Kumar', patientMrn: 'MRN-2024-00001', doctorName: 'Dr. Priya Sharma', orderedAt: new Date().toISOString(), status: 'COMPLETED', completedAt: new Date().toISOString(), tests: [{ name: 'CBC', category: 'Haematology', result: '14.2', unit: 'g/dL', referenceRange: '13-17', isAbnormal: false }, { name: 'Troponin I', category: 'Cardiac Markers', result: '0.8', unit: 'ng/mL', referenceRange: '< 0.04', isAbnormal: true }], reportUrl: '/reports/LAB-2025-01234.pdf' },
  { id: 'l2', orderNumber: 'LAB-2025-01235', patientId: 'p2', patientName: 'Lakshmi Venkat', patientMrn: 'MRN-2024-00002', doctorName: 'Dr. Suresh Patel', orderedAt: new Date().toISOString(), status: 'IN_PROGRESS', tests: [{ name: 'Blood Culture', category: 'Microbiology' }, { name: 'Procalcitonin', category: 'Inflammation Markers' }] },
  { id: 'l3', orderNumber: 'LAB-2025-01236', patientId: 'p5', patientName: 'Balaji Narayanan', patientMrn: 'MRN-2024-00005', doctorName: 'Dr. Ananya Krishnan', orderedAt: new Date().toISOString(), status: 'SAMPLE_COLLECTED', tests: [{ name: 'MRI Brain Report', category: 'Radiology' }, { name: 'Lipid Profile', category: 'Biochemistry' }] },
];

export const MOCK_PATIENT_BILLS: PatientBill[] = [
  { id: 'b1', billNumber: 'BILL-2025-00456', patientId: 'p1', patientName: 'Arjun Kumar', patientMrn: 'MRN-2024-00001', billDate: new Date().toISOString(), status: 'PARTIAL', items: [{ description: 'Consultation - Cardiology', category: 'OPD', quantity: 1, unitPrice: 800, discount: 0, tax: 0, total: 800 }, { description: 'Angioplasty Procedure', category: 'Procedure', quantity: 1, unitPrice: 85000, discount: 5000, tax: 0, total: 80000 }, { description: 'Room Charges (7 days)', category: 'IPD', quantity: 7, unitPrice: 2500, discount: 0, tax: 0, total: 17500 }], subtotal: 98300, discountTotal: 5000, taxTotal: 0, grandTotal: 93300, paidAmount: 50000, balance: 43300, paymentMode: 'INSURANCE', insuranceClaim: 'CLM-2025-8821' },
  { id: 'b2', billNumber: 'BILL-2025-00457', patientId: 'p3', patientName: 'Mohammed Salim', patientMrn: 'MRN-2024-00003', billDate: new Date().toISOString(), status: 'PAID', items: [{ description: 'Consultation - Ortho', category: 'OPD', quantity: 1, unitPrice: 600, discount: 0, tax: 0, total: 600 }, { description: 'X-Ray (Knee)', category: 'Radiology', quantity: 2, unitPrice: 450, discount: 0, tax: 0, total: 900 }], subtotal: 1500, discountTotal: 0, taxTotal: 0, grandTotal: 1500, paidAmount: 1500, balance: 0, paymentMode: 'UPI' },
  { id: 'b3', billNumber: 'BILL-2025-00458', patientId: 'p4', patientName: 'Sindhu Rajan', patientMrn: 'MRN-2024-00004', billDate: new Date().toISOString(), status: 'PENDING', items: [{ description: 'Consultation - Gynae', category: 'OPD', quantity: 1, unitPrice: 700, discount: 0, tax: 0, total: 700 }, { description: 'Ultrasound - Abdomen', category: 'Radiology', quantity: 1, unitPrice: 1200, discount: 0, tax: 0, total: 1200 }], subtotal: 1900, discountTotal: 0, taxTotal: 0, grandTotal: 1900, paidAmount: 0, balance: 1900 },
];