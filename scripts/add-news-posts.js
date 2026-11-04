// One-off, idempotent content seeding for the press feature and White Pony Express
// partnership blog posts. Upserts by slug so re-running (e.g. on every deploy) never
// creates duplicates and never touches any other blog posts.
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return;
  const contents = fs.readFileSync(envPath, 'utf8');
  for (const line of contents.split('\n')) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
}

if (!process.env.MONGODB_URI) {
  loadEnvLocal();
}

const MONGODB_URI = process.env.MONGODB_URI;

const BlogPostSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    excerpt: String,
    content: String,
    featuredImage: String,
    category: String,
    tags: [String],
    author: String,
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: Date,
    readingTime: Number,
  },
  { timestamps: true }
);

const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

function readingTimeFor(content) {
  const wordCount = content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

const posts = [
  {
    slug: 'sacred-tree-featured-in-the-press',
    title: 'Sacred Tree Featured in The Press',
    excerpt:
      "The Press sat down with our founder Vanshika Tyagi to talk about food waste, our volunteers, and how one backyard tree started it all. Read the story and watch the interview.",
    content: `<p>We're excited to share that Sacred Tree was recently featured in <strong>The Press</strong>, Brentwood's local news, in a story about our work collecting surplus produce and getting it to families who need it.</p>

<p>The article, published July 3, 2026, tells the story of how Sacred Tree got started, and how our 10-member student team has now donated over 2,000 pounds of fresh produce to organizations across Brentwood and Antioch, including Immaculate Heart of Mary Church, EA Family Services, and the Food Bank of Contra Costa &amp; Solano.</p>

<blockquote>"The Sacred Tree is built around the idea that helping can be simple. If we work together as neighbors, farms, students, and local organizations, we can reduce food waste and get more fresh food to people who need it." &mdash; Vanshika Tyagi, Founder</blockquote>

<h2>Watch the Interview</h2>
<p>We also sat down for a video interview about why we started Sacred Tree and what keeps us going. Take a look:</p>
<div style="position:relative;width:100%;aspect-ratio:16/9;border-radius:0.75rem;overflow:hidden;margin-bottom:1.5rem;">
<iframe src="https://www.youtube.com/embed/JRERKSziXgE" title="Sacred Tree video interview" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>
</div>

<p><a href="https://www.thepress.net/features/high-school-senior-s-non-profit-helps-those-in-need/article_0235d982-4972-48bb-bc15-44f0a6d840c8.html" target="_blank" rel="noopener noreferrer">Read the full article on The Press &rarr;</a></p>

<p>Thank you to Sean Tongson and The Press for telling our story, and to everyone who has donated produce, volunteered, or spread the word. Coverage like this helps us reach more neighbors, more farms, and more families who need fresh food.</p>`,
    featuredImage: '/images/press-clipping-the-press.jpeg',
    category: 'Press',
    tags: ['press', 'media', 'The Press', 'video'],
    author: 'Vanshika Tyagi',
    status: 'published',
    publishedAt: new Date('2026-07-23T10:00:00-07:00'),
  },
  {
    slug: 'partnering-with-white-pony-express',
    title: 'Sacred Tree Partners with White Pony Express',
    excerpt:
      'We donated 500 pounds of potatoes and 300 pounds of blackberries to White Pony Express, and they made it easy, sending their own truck to pick everything up.',
    content: `<p>We're glad to share a new partnership with <a href="https://whiteponyexpress.org/" target="_blank" rel="noopener noreferrer">White Pony Express</a>, an organization that rescues fresh food and gets it into the hands of people who need it.</p>

<p>So far, we've donated 500 pounds of potatoes and 300 pounds of blackberries through White Pony Express. From the very first call, they were welcoming and easy to work with. They sent their own trucks to pick up the produce from us, which made the whole process simple on our end.</p>

<h2>Always Ready to Help</h2>
<p>One thing that stood out to us: White Pony Express keeps an emergency line open for fresh produce. If we, or anyone else, have surplus food that needs to move quickly before it spoils, there's always someone to call.</p>

<h2>Where the Produce Goes</h2>
<p>Once produce reaches their warehouse, their team sorts, cleans, and organizes everything before redistributing it to their network of partner nonprofits, so the fresh food we collect ends up reaching even more families than we could reach on our own.</p>

<p>We're grateful for partners like White Pony Express who make it easier to get surplus produce to people who need it, faster. If you'd like to learn more about their work, visit <a href="https://whiteponyexpress.org/" target="_blank" rel="noopener noreferrer">whiteponyexpress.org</a>.</p>`,
    featuredImage: '/images/drives/produce-collection.jpg',
    category: 'Partnerships',
    tags: ['partnership', 'White Pony Express', 'food rescue'],
    author: 'Vanshika Tyagi',
    status: 'published',
    publishedAt: new Date('2026-07-22T10:00:00-07:00'),
  },
];

async function run() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set - skipping blog post seeding.');
    process.exit(0);
  }

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');

  for (const post of posts) {
    const readingTime = readingTimeFor(post.content);
    const result = await BlogPost.findOneAndUpdate(
      { slug: post.slug },
      { $set: { ...post, readingTime } },
      { upsert: true, new: true }
    );
    console.log(`Upserted blog post: ${result.slug}`);
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error('Failed to seed blog posts:', err);
  process.exit(1);
});
