import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB, isDBConfigured } from '@/lib/db';
import VolunteerSubmission from '@/models/VolunteerSubmission';

const volunteerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  communityServiceActivities: z.string().min(10),
  totalVolunteerHours: z.string().min(1),
  agreedToTerms: z.boolean().refine((val) => val === true),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = volunteerSchema.parse(body);

    if (!isDBConfigured()) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    await connectDB();

    // Create volunteer submission
    const submission = await VolunteerSubmission.create({
      ...validatedData,
      status: 'new',
    });

    return NextResponse.json(
      { success: true, id: submission._id },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Volunteer submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit volunteer application' },
      { status: 500 }
    );
  }
}
