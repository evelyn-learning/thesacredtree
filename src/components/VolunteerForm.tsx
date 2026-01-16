'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const volunteerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  communityServiceActivities: z.string().min(10, 'Please describe your community service experience'),
  totalVolunteerHours: z.string().min(1, 'Please enter your total volunteer hours'),
  agreedToTerms: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
});

type VolunteerFormData = z.infer<typeof volunteerSchema>;

export default function VolunteerForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerSchema),
  });

  const onSubmit = async (data: VolunteerFormData) => {
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      setStatus('success');
      reset();
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-green-800 mb-2">Thank You!</h3>
        <p className="text-green-700 mb-4">
          Your volunteer application has been submitted. We&apos;ll be in touch soon!
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{errorMessage}</p>
        </div>
      )}

      <div>
        <label htmlFor="name" className="label">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className="input"
          placeholder="Your full name"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className="input"
          placeholder="you@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="communityServiceActivities" className="label">
          Community Service Activities *
        </label>
        <textarea
          id="communityServiceActivities"
          rows={4}
          {...register('communityServiceActivities')}
          className="input"
          placeholder="Describe any volunteering or community service work you've completed previously"
        />
        {errors.communityServiceActivities && (
          <p className="text-red-500 text-sm mt-1">{errors.communityServiceActivities.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="totalVolunteerHours" className="label">
          Total Volunteer Hours *
        </label>
        <input
          type="text"
          id="totalVolunteerHours"
          {...register('totalVolunteerHours')}
          className="input"
          placeholder="e.g., 50 hours"
        />
        {errors.totalVolunteerHours && (
          <p className="text-red-500 text-sm mt-1">{errors.totalVolunteerHours.message}</p>
        )}
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="agreedToTerms"
          {...register('agreedToTerms')}
          className="mt-1 w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="agreedToTerms" className="text-sm text-gray-600">
          I confirm that the information provided is accurate and I agree that the Sacred Tree
          Foundation may contact me via the provided email to confirm my participation. *
        </label>
      </div>
      {errors.agreedToTerms && (
        <p className="text-red-500 text-sm">{errors.agreedToTerms.message}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          'Submit Application'
        )}
      </button>
    </form>
  );
}
