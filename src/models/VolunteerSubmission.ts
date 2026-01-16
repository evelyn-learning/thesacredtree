import mongoose, { Document, Schema } from 'mongoose';

export interface IVolunteerSubmission extends Document {
  name: string;
  email: string;
  communityServiceActivities: string;
  totalVolunteerHours: string;
  agreedToTerms: boolean;
  status: 'new' | 'contacted' | 'active' | 'inactive';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSubmissionSchema = new Schema<IVolunteerSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    communityServiceActivities: { type: String, required: true },
    totalVolunteerHours: { type: String, required: true },
    agreedToTerms: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'active', 'inactive'],
      default: 'new',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

VolunteerSubmissionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.VolunteerSubmission ||
  mongoose.model<IVolunteerSubmission>('VolunteerSubmission', VolunteerSubmissionSchema);
