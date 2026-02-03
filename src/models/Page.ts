import mongoose, { Document, Schema } from 'mongoose';

export interface IPageButton {
  id: string;
  text: string;
  link: string;
  variant?: 'primary' | 'secondary';
}

export interface IPageSection {
  id: string;
  type: 'hero' | 'content' | 'cta' | 'features' | 'gallery' | 'custom';
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  buttons?: IPageButton[];
  items?: Array<{
    title: string;
    description: string;
    icon?: string;
    image?: string;
  }>;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  description: string;
  sections: IPageSection[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageSectionSchema = new Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['hero', 'content', 'cta', 'features', 'gallery', 'custom'],
    required: true,
  },
  title: { type: String },
  subtitle: { type: String },
  content: { type: String },
  image: { type: String },
  buttonText: { type: String },
  buttonLink: { type: String },
  buttons: [{
    id: { type: String },
    text: { type: String },
    link: { type: String },
    variant: { type: String, enum: ['primary', 'secondary'], default: 'primary' },
    _id: false,
  }],
  items: [{
    title: { type: String },
    description: { type: String },
    icon: { type: String },
    image: { type: String },
  }],
}, { _id: false });

const PageSchema = new Schema<IPage>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    sections: [PageSectionSchema],
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PageSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
