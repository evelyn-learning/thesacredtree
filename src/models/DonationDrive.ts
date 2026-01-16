import mongoose, { Document, Schema } from 'mongoose';

export interface IDonationDrive extends Document {
  title: string;
  slug: string;
  description: string;
  date: Date;
  location: string;
  venue: string;
  quantity: string;
  images: string[];
  status: 'upcoming' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const DonationDriveSchema = new Schema<IDonationDrive>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    venue: { type: String, required: true },
    quantity: { type: String },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ['upcoming', 'completed'],
      default: 'upcoming',
    },
  },
  { timestamps: true }
);

DonationDriveSchema.index({ status: 1, date: -1 });
DonationDriveSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.DonationDrive ||
  mongoose.model<IDonationDrive>('DonationDrive', DonationDriveSchema);
