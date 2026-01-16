import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB, isDBConfigured } from '@/lib/db';
import ContactSubmission from '@/models/ContactSubmission';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(3),
  message: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = contactSchema.parse(body);

    if (!isDBConfigured()) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      );
    }

    await connectDB();

    // Create contact submission
    const submission = await ContactSubmission.create({
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

    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' },
      { status: 500 }
    );
  }
}
