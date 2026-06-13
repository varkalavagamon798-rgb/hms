import apiClient from '@/src/lib/api-client';
import type {
  HospitalStats,
  Patient,
  RegisterPatientDto,
  Appointment,
  CreateAppointmentDto,
  IPDAdmission,
  Prescription,
  LabTestOrder,
  PatientBill,
} from '@/src/types/hospitals';
import {
  MOCK_HOSPITAL_STATS,
  MOCK_PATIENTS,
  MOCK_APPOINTMENTS,
  MOCK_IPD,
  MOCK_PRESCRIPTIONS,
  MOCK_LAB_ORDERS,
  MOCK_PATIENT_BILLS,
} from '@/src/lib/hospital/mock-data';

// ─── Stats ────────────────────────────────────────────────────────────────────
export const hospitalService = {
  async getStats(): Promise<HospitalStats> {
    try {
      const { data } = await apiClient.get<HospitalStats>('/hospital/stats');
      return data;
    } catch {
      return MOCK_HOSPITAL_STATS;
    }
  },

  // ─── Patients ───────────────────────────────────────────────────────────────
  async getPatients(search?: string): Promise<Patient[]> {
    try {
      const { data } = await apiClient.get<Patient[]>('/patients', { params: { search } });
      return data;
    } catch {
      if (search) {
        const q = search.toLowerCase();
        return MOCK_PATIENTS.filter(
          (p) =>
            p.firstName.toLowerCase().includes(q) ||
            p.lastName.toLowerCase().includes(q) ||
            p.mrn.toLowerCase().includes(q) ||
            p.phone.includes(q),
        );
      }
      return MOCK_PATIENTS;
    }
  },

  async getPatient(id: string): Promise<Patient> {
    try {
      const { data } = await apiClient.get<Patient>(`/patients/${id}`);
      return data;
    } catch {
      const p = MOCK_PATIENTS.find((x) => x.id === id);
      if (!p) throw new Error('Patient not found');
      return p;
    }
  },

  async registerPatient(dto: RegisterPatientDto): Promise<Patient> {
    try {
      const { data } = await apiClient.post<Patient>('/patients', dto);
      return data;
    } catch {
      const newPatient: Patient = {
        id: `p${Date.now()}`,
        mrn: `MRN-2025-${String(MOCK_PATIENTS.length + 1).padStart(5, '0')}`,
        ...dto,
        status: 'ACTIVE',
        registeredAt: new Date().toISOString(),
      };
      MOCK_PATIENTS.push(newPatient);
      return newPatient;
    }
  },

  // ─── Appointments ────────────────────────────────────────────────────────────
  async getAppointments(date?: string): Promise<Appointment[]> {
    try {
      const { data } = await apiClient.get<Appointment[]>('/appointments', { params: { date } });
      return data;
    } catch {
      return MOCK_APPOINTMENTS;
    }
  },

  async createAppointment(dto: CreateAppointmentDto): Promise<Appointment> {
    try {
      const { data } = await apiClient.post<Appointment>('/appointments', dto);
      return data;
    } catch {
      const newAppt: Appointment = {
        id: `a${Date.now()}`,
        ...dto,
        patientName: MOCK_PATIENTS.find((p) => p.id === dto.patientId)?.firstName + ' ' + MOCK_PATIENTS.find((p) => p.id === dto.patientId)?.lastName || 'Unknown',
        patientMrn: MOCK_PATIENTS.find((p) => p.id === dto.patientId)?.mrn || '',
        doctorName: `Doctor ${dto.doctorId}`,
        department: 'General',
        status: 'SCHEDULED',
        tokenNumber: MOCK_APPOINTMENTS.length + 1,
      };
      MOCK_APPOINTMENTS.push(newAppt);
      return newAppt;
    }
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<void> {
    try {
      await apiClient.patch(`/appointments/${id}/status`, { status });
    } catch {
      const a = MOCK_APPOINTMENTS.find((x) => x.id === id);
      if (a) a.status = status;
    }
  },

  // ─── IPD ─────────────────────────────────────────────────────────────────────
  async getIPDAdmissions(): Promise<IPDAdmission[]> {
    try {
      const { data } = await apiClient.get<IPDAdmission[]>('/ipd');
      return data;
    } catch {
      return MOCK_IPD;
    }
  },

  // ─── Pharmacy ────────────────────────────────────────────────────────────────
  async getPrescriptions(status?: string): Promise<Prescription[]> {
    try {
      const { data } = await apiClient.get<Prescription[]>('/pharmacy/prescriptions', { params: { status } });
      return data;
    } catch {
      if (status) return MOCK_PRESCRIPTIONS.filter((p) => p.status === status);
      return MOCK_PRESCRIPTIONS;
    }
  },

  async dispensePrescription(id: string): Promise<void> {
    try {
      await apiClient.patch(`/pharmacy/prescriptions/${id}/dispense`);
    } catch {
      const rx = MOCK_PRESCRIPTIONS.find((x) => x.id === id);
      if (rx) {
        rx.status = 'DISPENSED';
        rx.items.forEach((item) => (item.dispensedQuantity = item.quantity));
      }
    }
  },

  // ─── Lab ─────────────────────────────────────────────────────────────────────
  async getLabOrders(status?: string): Promise<LabTestOrder[]> {
    try {
      const { data } = await apiClient.get<LabTestOrder[]>('/lab/orders', { params: { status } });
      return data;
    } catch {
      if (status) return MOCK_LAB_ORDERS.filter((o) => o.status === status);
      return MOCK_LAB_ORDERS;
    }
  },

  // ─── Billing ─────────────────────────────────────────────────────────────────
  async getPatientBills(patientId?: string): Promise<PatientBill[]> {
    try {
      const { data } = await apiClient.get<PatientBill[]>('/billing/bills', { params: { patientId } });
      return data;
    } catch {
      if (patientId) return MOCK_PATIENT_BILLS.filter((b) => b.patientId === patientId);
      return MOCK_PATIENT_BILLS;
    }
  },
};