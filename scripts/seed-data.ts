import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Models
const DonationDriveSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  description: String,
  date: Date,
  location: String,
  venue: String,
  quantity: String,
  images: [String],
  status: { type: String, enum: ['upcoming', 'completed'], default: 'completed' },
}, { timestamps: true });

const TeamMemberSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  role: String,
  bio: String,
  location: String,
  image: String,
  linkedIn: String,
  featured: Boolean,
  order: Number,
}, { timestamps: true });

const BlogPostSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  excerpt: String,
  content: String,
  featuredImage: String,
  category: String,
  author: String,
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  publishedAt: Date,
  readingTime: Number,
}, { timestamps: true });

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  name: String,
}, { timestamps: true });

const DonationDrive = mongoose.models.DonationDrive || mongoose.model('DonationDrive', DonationDriveSchema);
const TeamMember = mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

// Seed data
const donationDrives = [
  {
    title: 'Sunday Food Drive - Canciamilla Ranch',
    slug: 'canciamilla-ranch-summer-2025',
    description: 'Collected fresh produce from Canciamilla Ranch and distributed to local food banks. Partnership with local farmers to reduce food waste and support families in need.',
    date: new Date('2025-07-15'),
    location: 'Brentwood, CA',
    venue: 'Canciamilla Ranch',
    quantity: '350+ items',
    images: ['/images/drives/CanciamillaRanch1.jpg', '/images/drives/CanciamillaRanch2.jpg', '/images/drives/CanciamillaRanch3.jpg'],
    status: 'completed',
  },
  {
    title: 'Farmworker Support Drive - Hijas Del Campo',
    slug: 'hijas-del-campo-2025',
    description: 'Delivered fresh fruit to nourish farmworkers laboring in hot conditions through our partnership with Hijas Del Campo field programs.',
    date: new Date('2025-06-20'),
    location: 'Brentwood, CA',
    venue: 'Hijas Del Campo',
    quantity: '200+ items',
    images: ['/images/drives/HijasDelCampo.jpg'],
    status: 'completed',
  },
  {
    title: 'Fresh Strawberries Distribution',
    slug: 'chaos-strawberries-2025',
    description: 'Partnership with Chaos Strawberries to collect surplus strawberries and distribute them to families experiencing food insecurity.',
    date: new Date('2025-05-10'),
    location: 'Brentwood, CA',
    venue: 'Chaos Strawberries',
    quantity: '300+ items',
    images: ['/images/drives/ChaosStrawberries.jpg'],
    status: 'completed',
  },
  {
    title: 'Foster Youth Support Drive',
    slug: 'ea-family-services-2025',
    description: 'Brought fresh fruit to foster children through EA Family Services, offering healthier, comforting meals for youth in care.',
    date: new Date('2025-04-15'),
    location: 'Antioch, CA',
    venue: 'EA Family Services',
    quantity: '250+ items',
    images: ['/images/drives/EAFamilyServices.jpg'],
    status: 'completed',
  },
  {
    title: 'Church Pantry Distribution',
    slug: 'immaculate-heart-mary-2025',
    description: 'Immaculate Heart of Mary Church volunteers incorporated our donations into their pantry distributions, serving families in the local community.',
    date: new Date('2025-03-20'),
    location: 'Brentwood, CA',
    venue: 'Immaculate Heart of Mary Church',
    quantity: '200+ items',
    images: ['/images/drives/ImmaculateHeartofMaryChurch.jpg'],
    status: 'completed',
  },
];

const teamMembers = [
  {
    name: 'Vanshika Tyagi',
    slug: 'vanshika-tyagi',
    role: 'Founder',
    bio: 'A Heritage High School student and visionary leader committed to fighting food waste and hunger in the community. Vanshika founded Sacred Tree Foundation to redirect surplus produce from backyards and farms to families in need.',
    location: 'Brentwood, California',
    image: '',
    linkedIn: '',
    featured: true,
    order: 1,
  },
  {
    name: 'Siddhi',
    slug: 'siddhi',
    role: 'Coordinator',
    bio: 'Brings energy and creativity to every initiative. Siddhi coordinates volunteer efforts and helps organize our weekly donation drives.',
    location: 'California',
    image: '',
    featured: true,
    order: 2,
  },
  {
    name: 'Nada',
    slug: 'nada',
    role: 'Operations Manager',
    bio: 'Known for meticulous attention to detail, Nada ensures our operations run smoothly and efficiently, managing logistics and partnerships.',
    location: 'California',
    image: '',
    featured: true,
    order: 3,
  },
  {
    name: 'Danielle',
    slug: 'danielle',
    role: 'Community Liaison',
    bio: 'Connects with families and volunteers, building bridges between our organization and the communities we serve.',
    location: 'California',
    image: '',
    featured: true,
    order: 4,
  },
  {
    name: 'Shreyas',
    slug: 'shreyas',
    role: 'Outreach Coordinator',
    bio: 'A creative problem solver who manages our outreach programs and develops new partnerships with local organizations.',
    location: 'California',
    image: '',
    featured: true,
    order: 5,
  },
  {
    name: 'Airi',
    slug: 'airi',
    role: 'Communications Coordinator',
    bio: 'Manages volunteer coordination and outreach, ensuring our message reaches those who want to help and those who need support.',
    location: 'California',
    image: '',
    featured: true,
    order: 6,
  },
  {
    name: 'Alyna',
    slug: 'alyna',
    role: 'Community Relations',
    bio: 'Focuses on event planning and partnerships, helping to expand our reach and impact across Brentwood, Antioch, and Oakley.',
    location: 'California',
    image: '',
    featured: true,
    order: 7,
  },
  {
    name: 'Raunak Agarwal',
    slug: 'raunak-agarwal',
    role: 'International Team',
    bio: 'Dedicated to philanthropy from Singapore, Raunak brings a global perspective to our mission and helps coordinate international outreach efforts.',
    location: 'Singapore',
    image: '',
    featured: true,
    order: 8,
  },
];

const blogPosts = [
  {
    title: 'Sacred Tree Foundation Launches Summer Food Donation Drive',
    slug: 'summer-food-donation-drive-2025',
    excerpt: 'Our student-run nonprofit successfully redirected more than 1,300 pieces of fresh fruit and vegetables this summer to support families, farmworkers, and foster youth.',
    content: `<p>The Sacred Tree Foundation, a student-run nonprofit based in Brentwood, CA, successfully redirected more than 1,300 pieces of fresh fruit and vegetables this summer to support families, farmworkers, and foster youth across Brentwood and Antioch.</p>

<h2>Our Impact</h2>
<p>Through partnerships with Canciamilla Ranch and Chaos Strawberries, we collected surplus produce that would have otherwise gone to waste. This food was then distributed to multiple community organizations:</p>

<ul>
<li><strong>Hijas Del Campo</strong> - Supporting farmworkers laboring in hot conditions</li>
<li><strong>Immaculate Heart of Mary Church</strong> - Food pantry distributions</li>
<li><strong>EA Family Services</strong> - Providing healthy meals for foster children</li>
</ul>

<h2>Looking Ahead</h2>
<p>We've also raised $250 to create Halloween gifts for foster children and are planning further drives across Brentwood, Antioch, and Oakley. Join us in our mission to combat food waste and hunger!</p>`,
    featuredImage: '/images/drives/CanciamillaRanch1.jpg',
    category: 'News',
    author: 'Vanshika Tyagi',
    status: 'published',
    publishedAt: new Date('2025-09-23'),
    readingTime: 3,
  },
  {
    title: 'How Student Leadership Can Make a Difference',
    slug: 'student-leadership-making-difference',
    excerpt: 'Young people are taking charge of community initiatives, proving that age is no barrier to creating meaningful change.',
    content: `<p>At Sacred Tree Foundation, we believe that young people have the power to create meaningful change in their communities. Our organization, founded and led by high school students, has demonstrated that age is no barrier to making a real impact.</p>

<h2>The Power of Youth Initiative</h2>
<p>Every Sunday, our team of student volunteers picks up extra vegetables and fruits from farmers markets and donates them to food banks. This simple but effective approach has helped us combat food waste while addressing hunger in our community.</p>

<h2>Building Partnerships</h2>
<p>We've partnered with local farms like Canciamilla Ranch and Chaos Strawberries, as well as community organizations including churches and family services agencies. These partnerships have multiplied our impact.</p>

<h2>Get Involved</h2>
<p>Whether through volunteering, donating produce, or spreading the word, your support directly impacts the community's well-being. Contact us to learn how you can join our mission.</p>`,
    featuredImage: '/images/drives/HijasDelCampo.jpg',
    category: 'Community',
    author: 'Sacred Tree Team',
    status: 'published',
    publishedAt: new Date('2025-08-15'),
    readingTime: 4,
  },
];

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await DonationDrive.deleteMany({});
    await TeamMember.deleteMany({});
    await BlogPost.deleteMany({});
    console.log('Cleared existing data');

    // Seed donation drives
    await DonationDrive.insertMany(donationDrives);
    console.log(`Seeded ${donationDrives.length} donation drives`);

    // Seed team members
    await TeamMember.insertMany(teamMembers);
    console.log(`Seeded ${teamMembers.length} team members`);

    // Seed blog posts
    await BlogPost.insertMany(blogPosts);
    console.log(`Seeded ${blogPosts.length} blog posts`);

    // Create default admin if not exists
    const existingAdmin = await AdminUser.findOne({ email: 'admin@thesacredtree.org' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await AdminUser.create({
        email: 'admin@thesacredtree.org',
        password: hashedPassword,
        name: 'Admin',
      });
      console.log('Created default admin user');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
