import mongoose, { Document, Schema } from 'mongoose';

export interface IContactSubmission extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'read', 'responded'],
      default: 'new',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

ContactSubmissionSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>('ContactSubmission', ContactSubmissionSchema);
