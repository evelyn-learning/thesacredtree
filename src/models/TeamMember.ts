import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  slug: string;
  role: string;
  bio: string;
  location: string;
  image: string;
  linkedIn: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, default: 'California' },
    image: { type: String },
    linkedIn: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

TeamMemberSchema.index({ order: 1, name: 1 });
TeamMemberSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.TeamMember ||
  mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
