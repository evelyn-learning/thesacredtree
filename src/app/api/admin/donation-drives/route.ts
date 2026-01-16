import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { DonationDrive } from '@/models';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const drives = await DonationDrive.find().sort({ date: -1 });
    return NextResponse.json(drives);
  } catch (error) {
    console.error('Error fetching donation drives:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    if (!data.title || !data.description || !data.date || !data.location || !data.venue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const slug = generateSlug(data.title);

    const existingDrive = await DonationDrive.findOne({ slug });
    if (existingDrive) {
      return NextResponse.json({ error: 'A donation drive with this title already exists' }, { status: 400 });
    }

    const drive = await DonationDrive.create({
      ...data,
      slug,
      date: new Date(data.date),
    });

    return NextResponse.json(drive, { status: 201 });
  } catch (error) {
    console.error('Error creating donation drive:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
