/**
 * Hospital Management Service
 * Typed API calls for Platform Admin dashboard
 * All endpoints require Platform Admin JWT token in Authorization header
 */

import apiClient from './api';
import {
  Hospital,
  TenantConfig,
  TenantModule,
  ModuleCode,
  PaginatedResponse,
  AuditLog,
} from '../types/hospital.types';

/**
 * TENANT MANAGEMENT ENDPOINTS
 */

/**
 * Onboard a new hospital tenant
 * POST /platform/hospitals
 */
export const createHospital = async (payload: Omit<Hospital, 'hospital_id' | 'created_at' | 'updated_at'>): Promise<Hospital> => {
  const response = await apiClient.post<Hospital>('/platform/hospitals', payload);
  return response.data;
};

/**
 * Get all hospitals with optional filters and pagination
 * GET /platform/hospitals
 */
export interface GetHospitalsParams {
  page?: number;
  limit?: number;
  is_active?: boolean;
  subscription_plan?: 'BASIC' | 'PRO' | 'ENTERPRISE';
  city?: string;
  state?: string;
  search?: string; // Search by hospital_name, hospital_code, or primary_email
}

export const getHospitals = async (
  params?: GetHospitalsParams
): Promise<PaginatedResponse<Hospital>> => {
  const response = await apiClient.get<PaginatedResponse<Hospital>>('/platform/hospitals', {
    params,
  });
  return response.data;
};

/**
 * Get a single hospital's full details
 * GET /platform/hospitals/:id
 */
export const getHospitalById = async (hospitalId: string): Promise<Hospital> => {
  const response = await apiClient.get<Hospital>(`/platform/hospitals/${hospitalId}`);
  return response.data;
};

/**
 * Update hospital metadata
 * PUT /platform/hospitals/:id
 */
export const updateHospital = async (
  hospitalId: string,
  payload: Partial<Hospital>
): Promise<Hospital> => {
  const response = await apiClient.put<Hospital>(`/platform/hospitals/${hospitalId}`, payload);
  return response.data;
};

/**
 * Suspend or reactivate a hospital tenant
 * PATCH /platform/hospitals/:id/suspend
 */
export interface SuspendPayload {
  is_active: boolean;
}

export const suspendOrReactivateHospital = async (
  hospitalId: string,
  is_active: boolean
): Promise<Hospital> => {
  const response = await apiClient.patch<Hospital>(`/platform/hospitals/${hospitalId}/suspend`, {
    is_active,
  });
  return response.data;
};

/**
 * BRANDING & CONFIG ENDPOINTS
 */

/**
 * Get hospital branding configuration
 * GET /platform/hospitals/:id/config
 */
export const getHospitalConfig = async (hospitalId: string): Promise<TenantConfig> => {
  const response = await apiClient.get<TenantConfig>(`/platform/hospitals/${hospitalId}/config`);
  return response.data;
};

/**
 * Update hospital branding configuration
 * PUT /platform/hospitals/:id/config
 */
export const updateHospitalConfig = async (
  hospitalId: string,
  payload: Partial<TenantConfig>
): Promise<TenantConfig> => {
  const response = await apiClient.put<TenantConfig>(
    `/platform/hospitals/${hospitalId}/config`,
    payload
  );
  return response.data;
};

/**
 * MODULE MANAGEMENT ENDPOINTS
 */

/**
 * Get all modules for a hospital
 * GET /platform/hospitals/:id/modules
 */
export const getHospitalModules = async (hospitalId: string): Promise<TenantModule[]> => {
  const response = await apiClient.get<TenantModule[]>(`/platform/hospitals/${hospitalId}/modules`);
  return response.data;
};

/**
 * Enable or disable a specific module for a hospital
 * PATCH /platform/hospitals/:id/modules/:code
 */
export interface ModuleTogglePayload {
  is_enabled: boolean;
  config_json?: Record<string, unknown>;
}

export const toggleHospitalModule = async (
  hospitalId: string,
  moduleCode: ModuleCode,
  payload: ModuleTogglePayload
): Promise<TenantModule> => {
  const response = await apiClient.patch<TenantModule>(
    `/platform/hospitals/${hospitalId}/modules/${moduleCode}`,
    payload
  );
  return response.data;
};

/**
 * DOMAIN MANAGEMENT ENDPOINTS
 */

/**
 * Add a subdomain or custom CNAME for a hospital
 * POST /platform/hospitals/:id/domains
 */
export interface DomainPayload {
  domain_name: string;
  domain_type: 'SUBDOMAIN' | 'CUSTOM_CNAME';
  is_primary?: boolean;
}

export interface Domain extends DomainPayload {
  domain_id: string;
  hospital_id: string;
  is_verified: boolean;
  verification_token?: string;
  created_at: string;
}

export const addHospitalDomain = async (
  hospitalId: string,
  payload: DomainPayload
): Promise<Domain> => {
  const response = await apiClient.post<Domain>(`/platform/hospitals/${hospitalId}/domains`, payload);
  return response.data;
};

/**
 * Get all domains for a hospital
 * GET /platform/hospitals/:id/domains
 */
export const getHospitalDomains = async (hospitalId: string): Promise<Domain[]> => {
  const response = await apiClient.get<Domain[]>(`/platform/hospitals/${hospitalId}/domains`);
  return response.data;
};

/**
 * AUDIT & ANALYTICS ENDPOINTS
 */

/**
 * Get audit logs (cross-tenant)
 * GET /platform/audit-logs
 */
export interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  hospital_id?: string;
  start_date?: string; // ISO timestamp
  end_date?: string;   // ISO timestamp
  action?: string;
}

export const getAuditLogs = async (
  params?: GetAuditLogsParams
): Promise<PaginatedResponse<AuditLog>> => {
  const response = await apiClient.get<PaginatedResponse<AuditLog>>('/platform/audit-logs', {
    params,
  });
  return response.data;
};

/**
 * Get dashboard metrics and KPIs
 * GET /platform/metrics
 */
export interface DashboardMetricsResponse {
  totalHospitals: number;
  activeHospitals: number;
  suspendedHospitals: number;
  expiringSubscriptions: number;
  planCounts: {
    BASIC: number;
    PRO: number;
    ENTERPRISE: number;
  };
  newHospitalsThisMonth: number;
  averageModulesPerHospital: number;
}

export const getDashboardMetrics = async (): Promise<DashboardMetricsResponse> => {
  const response = await apiClient.get<DashboardMetricsResponse>('/platform/metrics');
  return response.data;
};

/**
 * Get hospital onboarding trend (new hospitals by month for the past 12 months)
 * GET /platform/analytics/onboarding-trend
 */
export interface OnboardingTrend {
  month: string; // e.g., '2025-06'
  count: number;
}

export const getOnboardingTrend = async (): Promise<OnboardingTrend[]> => {
  const response = await apiClient.get<OnboardingTrend[]>('/platform/analytics/onboarding-trend');
  return response.data;
};

/**
 * Get hospital distribution by subscription plan
 * GET /platform/analytics/plan-distribution
 */
export interface PlanDistribution {
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  count: number;
  percentage: number;
}

export const getPlanDistribution = async (): Promise<PlanDistribution[]> => {
  const response = await apiClient.get<PlanDistribution[]>(
    '/platform/analytics/plan-distribution'
  );
  return response.data;
};

/**
 * BULK OPERATIONS
 */

/**
 * Bulk extend subscription expiry for multiple hospitals
 * PATCH /platform/hospitals/bulk/extend-subscription
 */
export interface BulkExtendSubscriptionPayload {
  hospital_ids: string[];
  days: number; // 30, 90, 180
}

export const bulkExtendSubscription = async (
  payload: BulkExtendSubscriptionPayload
): Promise<{ updated_count: number }> => {
  const response = await apiClient.patch<{ updated_count: number }>(
    '/platform/hospitals/bulk/extend-subscription',
    payload
  );
  return response.data;
};

/**
 * Export hospitals to CSV
 * GET /platform/hospitals/export/csv
 */
export const exportHospitalsToCsv = async (params?: GetHospitalsParams): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/platform/hospitals/export/csv', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export audit logs to CSV
 * GET /platform/audit-logs/export/csv
 */
export const exportAuditLogsToCsv = async (params?: GetAuditLogsParams): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/platform/audit-logs/export/csv', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Export audit logs to JSON
 * GET /platform/audit-logs/export/json
 */
export const exportAuditLogsToJson = async (params?: GetAuditLogsParams): Promise<Blob> => {
  const response = await apiClient.get<Blob>('/platform/audit-logs/export/json', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

/**
 * HELPER FUNCTIONS
 */

/**
 * Download a blob as a file
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Check if subscription is expiring soon (within 30 days)
 */
export const isSubscriptionExpiringSoon = (expiresAt: string | null | undefined): boolean => {
  if (!expiresAt) return false;

  const expiryDate = new Date(expiresAt);
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  return expiryDate <= thirtyDaysFromNow && expiryDate > today;
};

/**
 * Check if subscription is already expired
 */
export const isSubscriptionExpired = (expiresAt: string | null | undefined): boolean => {
  if (!expiresAt) return false;

  const expiryDate = new Date(expiresAt);
  const today = new Date();

  return expiryDate < today;
};

/**
 * Format currency based on hospital's currency setting
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
};
