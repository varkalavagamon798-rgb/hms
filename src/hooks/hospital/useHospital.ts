import { useState, useEffect, useCallback } from 'react';
import type { HospitalStats, Patient, Appointment, IPDAdmission, Prescription, LabTestOrder, PatientBill } from '@/src/types/hospitals';
import { hospitalService } from '@/src/services/hospital/hospital.service';

// ─── Stats ────────────────────────────────────────────────────────────────────
export function useHospitalStats() {
  const [stats, setStats] = useState<HospitalStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalService.getStats().then((s) => { setStats(s); setLoading(false); });
  }, []);

  return { stats, loading };
}

// ─── Patients ─────────────────────────────────────────────────────────────────
export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPatients = useCallback(async (q?: string) => {
    setLoading(true);
    const data = await hospitalService.getPatients(q);
    setPatients(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    fetchPatients(q);
  }, [fetchPatients]);

  const registerPatient = useCallback(async (dto: Parameters<typeof hospitalService.registerPatient>[0]) => {
    const p = await hospitalService.registerPatient(dto);
    setPatients((prev) => [p, ...prev]);
    return p;
  }, []);

  return { patients, loading, search, handleSearch, registerPatient };
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export function useAppointments(date?: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const data = await hospitalService.getAppointments(date);
    setAppointments(data);
    setLoading(false);
  }, [date]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateStatus = useCallback(async (id: string, status: Appointment['status']) => {
    await hospitalService.updateAppointmentStatus(id, status);
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }, []);

  return { appointments, loading, updateStatus, refresh: fetch };
}

// ─── IPD ─────────────────────────────────────────────────────────────────────
export function useIPD() {
  const [admissions, setAdmissions] = useState<IPDAdmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalService.getIPDAdmissions().then((d) => { setAdmissions(d); setLoading(false); });
  }, []);

  return { admissions, loading };
}

// ─── Pharmacy ─────────────────────────────────────────────────────────────────
export function usePrescriptions(statusFilter?: string) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalService.getPrescriptions(statusFilter).then((d) => { setPrescriptions(d); setLoading(false); });
  }, [statusFilter]);

  const dispense = useCallback(async (id: string) => {
    await hospitalService.dispensePrescription(id);
    setPrescriptions((prev) => prev.map((rx) => rx.id === id ? { ...rx, status: 'DISPENSED' as const } : rx));
  }, []);

  return { prescriptions, loading, dispense };
}

// ─── Lab ─────────────────────────────────────────────────────────────────────
export function useLabOrders(statusFilter?: string) {
  const [orders, setOrders] = useState<LabTestOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalService.getLabOrders(statusFilter).then((d) => { setOrders(d); setLoading(false); });
  }, [statusFilter]);

  return { orders, loading };
}

// ─── Billing ─────────────────────────────────────────────────────────────────
export function usePatientBills(patientId?: string) {
  const [bills, setBills] = useState<PatientBill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hospitalService.getPatientBills(patientId).then((d) => { setBills(d); setLoading(false); });
  }, [patientId]);

  return { bills, loading };
}