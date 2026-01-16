import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectDB, isDBConfigured } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import AdminUser from '@/models/AdminUser';

export const dynamic = 'force-dynamic';

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1),
}).refine((data: { newPassword: string; confirmPassword: string }) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!isDBConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    const body = await request.json();
    const validatedData = passwordSchema.parse(body);

    await connectDB();

    const user = await AdminUser.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify current password
    const isValid = await bcrypt.compare(validatedData.currentPassword, user.password);

    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);
    await AdminUser.updateOne(
      { email: session.user.email },
      { password: hashedPassword }
    );

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      const zodError = err as z.ZodError;
      return NextResponse.json(
        { error: 'Validation failed', details: zodError.issues },
        { status: 400 }
      );
    }

    console.error('Password update error:', err);
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    );
  }
}
