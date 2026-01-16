import mongoose, { Document, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
  publishedAt: Date;
  readingTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    category: { type: String, default: 'News' },
    tags: [{ type: String }],
    author: { type: String, default: 'Sacred Tree Foundation' },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    publishedAt: { type: Date },
    readingTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.BlogPost ||
  mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
