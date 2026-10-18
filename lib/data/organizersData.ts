export interface OrganizerMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  department?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
  };
}

export interface OrganizerSectionConfig {
  id: string;
  number: string;
  title: string;
  size: 'lg' | 'md' | 'sm';
  members: OrganizerMember[];
}

export const patrons: OrganizerMember[] = [
  {
    id: 'patron-01',
    name: 'Mr. Salman Ahmed',
    role: 'Chairman',
    imageUrl: '/organizers/patron-01.jpg',
  },
  {
    id: 'patron-02',
    name: 'Dr. Mohammed Masood',
    role: 'Principal',
    imageUrl: '/organizers/patron-02.jpg',
  },
];

export const coPatrons: OrganizerMember[] = [
  {
    id: 'copatron-01',
    name: 'Profile 03',
    role: 'Co-Patron',
    imageUrl: '/organizers/member-03.jpg',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'copatron-02',
    name: 'Profile 04',
    role: 'Co-Patron',
    imageUrl: '/organizers/member-04.jpg',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
];

export const boardMembers: OrganizerMember[] = [
  {
    id: 'board-01',
    name: 'Profile 05',
    role: 'Board Member',
  },
  {
    id: 'board-02',
    name: 'Profile 06',
    role: 'Board Member',
  },
  {
    id: 'board-03',
    name: 'Profile 07',
    role: 'Board Member',
  },
  {
    id: 'board-04',
    name: 'Profile 08',
    role: 'Board Member',
  },
  {
    id: 'board-05',
    name: 'Profile 09',
    role: 'Board Member',
  },
  {
    id: 'board-06',
    name: 'Profile 10',
    role: 'Board Member',
  },
  {
    id: 'board-07',
    name: 'Profile 11',
    role: 'Board Member',
  },
  {
    id: 'board-08',
    name: 'Profile 12',
    role: 'Board Member',
  },
  {
    id: 'board-09',
    name: 'Profile 13',
    role: 'Board Member',
  },
];

export const techTeam: OrganizerMember[] = [
  {
    id: 'tech-01',
    name: 'Profile 14',
    role: 'Tech Team',
    imageUrl: '/organizers/member-12.jpg',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'tech-02',
    name: 'Profile 15',
    role: 'Tech Team',
    imageUrl: '/organizers/member-01.jpg',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'tech-03',
    name: 'Profile 16',
    role: 'Tech Team',
    imageUrl: '/organizers/member-02.jpg',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'tech-04',
    name: 'Profile 17',
    role: 'Tech Team',
    imageUrl: '/organizers/member-03.jpg',
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  },
];

export const coordinators: OrganizerMember[] = Array.from({ length: 24 }, (_, i) => {
  const index = i + 18;
  const formattedIndex = String(index).padStart(2, '0');
  const imgNum = String((i % 12) + 1).padStart(2, '0');
  return {
    id: `coordinator-${formattedIndex}`,
    name: `Profile ${formattedIndex}`,
    role: 'Coordinator',
    imageUrl: `/organizers/member-${imgNum}.jpg`,
    socials: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
    },
  };
});

export const organizerSections: OrganizerSectionConfig[] = [
  {
    id: 'patrons',
    number: '01',
    title: 'PATRONS',
    size: 'md',
    members: patrons,
  },
  {
    id: 'co-patrons',
    number: '02',
    title: 'CO-PATRONS',
    size: 'md',
    members: coPatrons,
  },
  {
    id: 'board-members',
    number: '03',
    title: 'BOARD MEMBERS',
    size: 'md',
    members: boardMembers,
  },
  {
    id: 'tech-team',
    number: '04',
    title: 'TECH TEAM',
    size: 'md',
    members: techTeam,
  },
  {
    id: 'coordinators',
    number: '05',
    title: 'COORDINATORS',
    size: 'md',
    members: coordinators,
  },
];
