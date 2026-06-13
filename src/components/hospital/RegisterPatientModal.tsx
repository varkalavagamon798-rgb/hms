'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, UserPlus, ChevronRight, ChevronLeft } from 'lucide-react';
import type { RegisterPatientDto } from '@/src/types/hospitals';

const step1Schema = z.object({
  firstName: z.string().min(2, 'At least 2 characters'),
  lastName: z.string().min(1, 'Required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
});

const step2Schema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile number'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  address: z.string().min(5, 'Enter full address'),
  city: z.string().min(2, 'Required'),
  emergencyContactName: z.string().min(2, 'Required'),
  emergencyContactPhone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit number'),
});

const fullSchema = step1Schema.merge(step2Schema);
type FormData = z.infer<typeof fullSchema>;

interface Props {
  onClose: () => void;
  onSubmit: (data: RegisterPatientDto) => Promise<void>;
}

const STEP_LABELS = ['Personal Info', 'Contact Details'];

export function RegisterPatientModal({ onClose, onSubmit }: Props) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(fullSchema), mode: 'onBlur' });

  const step1Fields: (keyof FormData)[] = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'bloodGroup'];
  const step2Fields: (keyof FormData)[] = ['phone', 'email', 'address', 'city', 'emergencyContactName', 'emergencyContactPhone'];

  const nextStep = async () => {
    const valid = await trigger(step === 0 ? step1Fields : step2Fields);
    if (valid) setStep(step + 1);
  };

  const submit = async (data: FormData) => {
    setLoading(true);
    try {
      await onSubmit(data as RegisterPatientDto);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" style={{ color: 'var(--color-primary, #33ABC3)' }} />
            <h2 className="font-semibold text-gray-900">Register New Patient</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="flex gap-1 px-6 pt-4">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? '' : 'bg-gray-100'}`}
                style={i <= step ? { backgroundColor: 'var(--color-primary, #33ABC3)' } : undefined} />
              <p className={`mt-1.5 text-xs ${i === step ? 'font-medium text-gray-700' : 'text-gray-400'}`}>{label}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submit)} className="px-6 py-4 space-y-4">
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">First Name *</label>
                  <input {...register('firstName')} className="input-field" placeholder="e.g. Arjun" />
                  {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Last Name *</label>
                  <input {...register('lastName')} className="input-field" placeholder="e.g. Kumar" />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input {...register('dateOfBirth')} type="date" className="input-field" max={new Date().toISOString().split('T')[0]} />
                {errors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{errors.dateOfBirth.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gender *</label>
                  <select {...register('gender')} className="input-field">
                    <option value="">Select...</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Blood Group</label>
                  <select {...register('bloodGroup')} className="input-field">
                    <option value="">Unknown</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number *</label>
                  <input {...register('phone')} type="tel" className="input-field" placeholder="9876543210" />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input {...register('email')} type="email" className="input-field" placeholder="optional" />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Address *</label>
                <input {...register('address')} className="input-field" placeholder="House no., street, locality" />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                <input {...register('city')} className="input-field" placeholder="Chennai" />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Emergency Contact Name *</label>
                  <input {...register('emergencyContactName')} className="input-field" placeholder="Relative name" />
                  {errors.emergencyContactName && <p className="mt-1 text-xs text-red-500">{errors.emergencyContactName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Emergency Contact Phone *</label>
                  <input {...register('emergencyContactPhone')} type="tel" className="input-field" placeholder="9876543210" />
                  {errors.emergencyContactPhone && <p className="mt-1 text-xs text-red-500">{errors.emergencyContactPhone.message}</p>}
                </div>
              </div>
            </>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={step === 0 ? onClose : () => setStep(step - 1)}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            {step > 0 && <ChevronLeft className="h-4 w-4" />}
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < STEP_LABELS.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: 'var(--color-primary, #33ABC3)' }}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit(submit)}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-primary, #33ABC3)' }}
            >
              {loading ? 'Registering...' : 'Register Patient'}
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input-field:focus {
          border-color: var(--color-primary, #33ABC3);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary, #33ABC3) 15%, transparent);
        }
      `}</style>
    </div>
  );
}