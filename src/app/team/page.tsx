import { Metadata } from 'next';
import Image from 'next/image';
import { connectDB, isDBConfigured } from '@/lib/db';
import TeamMember from '@/models/TeamMember';
import { getInitials } from '@/lib/utils';
import { Linkedin, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the dedicated volunteers and leaders behind the Sacred Tree Foundation.',
};

async function getTeamMembers() {
  if (!isDBConfigured()) {
    return [];
  }
  try {
    await connectDB();
    const members = await TeamMember.find({}).sort({ order: 1, name: 1 }).lean();
    return JSON.parse(JSON.stringify(members));
  } catch {
    return [];
  }
}

// Fallback team data when database is not configured
const fallbackTeam = [
  { name: 'Vanshika Tyagi', role: 'Founder', bio: 'A visionary leader committed to fighting food waste and hunger.', location: 'California' },
  { name: 'Siddhi', role: 'Coordinator', bio: 'Brings energy and creativity to every initiative.', location: 'California' },
  { name: 'Nada', role: 'Operations Manager', bio: 'Known for meticulous attention to detail.', location: 'California' },
  { name: 'Danielle', role: 'Community Liaison', bio: 'Connects with families and volunteers.', location: 'California' },
  { name: 'Shreyas', role: 'Outreach Coordinator', bio: 'A creative problem solver.', location: 'California' },
  { name: 'Airi', role: 'Communications Coordinator', bio: 'Manages volunteer coordination and outreach.', location: 'California' },
  { name: 'Alyna', role: 'Community Relations', bio: 'Focuses on event planning and partnerships.', location: 'California' },
  { name: 'Raunak Agarwal', role: 'International Team', bio: 'Dedicated to philanthropy from Singapore.', location: 'Singapore' },
];

export default async function TeamPage() {
  let teamMembers = await getTeamMembers();

  if (teamMembers.length === 0) {
    teamMembers = fallbackTeam;
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="heading-1 text-gray-900 mb-6">Our Team</h1>
            <p className="text-xl text-gray-600">
              Meet the dedicated volunteers and leaders who make our mission possible.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member: { _id?: string; name: string; role: string; bio: string; location: string; image?: string; linkedIn?: string }) => (
              <div key={member._id || member.name} className="card p-6 text-center">
                {/* Avatar */}
                {member.image ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {getInitials(member.name)}
                  </div>
                )}

                {/* Info */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-500 font-medium text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm mb-3">{member.bio}</p>

                {/* Location & Social */}
                <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {member.location}
                  </span>
                  {member.linkedIn && (
                    <a
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-500 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="section-padding bg-gray-50">
        <div className="container-wide text-center">
          <h2 className="heading-2 text-gray-900 mb-6">Want to Join Our Team?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for passionate individuals who want to make a difference
            in our community.
          </p>
          <a href="/volunteer" className="btn-primary">
            Become a Volunteer
          </a>
        </div>
      </section>
    </>
  );
}
