import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB, isDBConfigured } from './db';
import AdminUser from '@/models/AdminUser';

// Default admin credentials (used to seed first admin)
const DEFAULT_ADMIN = {
  email: 'admin@thesacredtree.org',
  password: 'admin123',
  name: 'Admin',
};

async function getOrCreateDefaultAdmin() {
  if (!isDBConfigured()) {
    return null;
  }

  await connectDB();

  // Check if any admin exists
  let admin = await AdminUser.findOne({});

  if (!admin) {
    // Create default admin
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
    admin = await AdminUser.create({
      email: DEFAULT_ADMIN.email,
      password: hashedPassword,
      name: DEFAULT_ADMIN.name,
    });
  }

  return admin;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (!isDBConfigured()) {
          return null;
        }

        await connectDB();

        // Ensure default admin exists
        await getOrCreateDefaultAdmin();

        const user = await AdminUser.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
};
