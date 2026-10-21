export interface DbOrganizerMember {
  _id?: string;
  name: string;
  title?: string;
  role: string;
  linkedin?: string;
  instagram?: string;
  profile_image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HierarchySectionConfig {
  id: string;
  title: string;
  matchRoles: string[];
  size: 'lg' | 'md';
}

/**
 * 8-tier hierarchy requested by the user:
 * 1. Chief Patron
 * 2. Patron
 * 3. Convener
 * 4. Advisory Board
 * 5. Organizing Faculty
 * 6. Board Members
 * 7. Tech Team
 * 8. Coordinators
 */
export const ORGANIZER_HIERARCHY: HierarchySectionConfig[] = [
  {
    id: 'chief-patron',
    title: 'Chief Patron',
    matchRoles: ['chief patron'],
    size: 'lg',
  },
  {
    id: 'patron',
    title: 'Patron',
    matchRoles: ['patron'],
    size: 'lg',
  },
  {
    id: 'convener',
    title: 'Convener',
    matchRoles: ['convener', 'co-patron', 'co-patrons'],
    size: 'lg',
  },
  {
    id: 'advisory-board',
    title: 'Advisory Board',
    matchRoles: ['advisory board', 'advisory'],
    size: 'md',
  },
  {
    id: 'organizing-faculty',
    title: 'Organizing Faculty',
    matchRoles: [
      'organizing faculty',
      'faculty',
      'faculty org',
      'faculty organizers',
      'faculty member',
    ],
    size: 'md',
  },
  {
    id: 'board-members',
    title: 'Board Members',
    matchRoles: ['board members', 'board member', 'board-members', 'board'],
    size: 'md',
  },
  {
    id: 'tech-team',
    title: 'Tech Team',
    matchRoles: ['tech team', 'tech-team', 'tech'],
    size: 'md',
  },
  {
    id: 'coordinators',
    title: 'Coordinators',
    matchRoles: ['coordinators', 'coordinator', 'student coordinator'],
    size: 'md',
  },
];

export interface GroupedHierarchySection {
  section: HierarchySectionConfig;
  members: DbOrganizerMember[];
}

/**
 * Groups DB members by the 8-tier hierarchy.
 * Cleans up leading/trailing whitespace in roles (e.g. " Chief Patron" -> "chief patron").
 */
export function groupMembersByHierarchy(
  members: DbOrganizerMember[] = []
): GroupedHierarchySection[] {
  const result: GroupedHierarchySection[] = [];
  const assignedIds = new Set<string>();

  ORGANIZER_HIERARCHY.forEach((section) => {
    const matched = members.filter((m) => {
      const id = m._id || m.name;
      if (assignedIds.has(id)) return false;

      const rawRole = (m.role || '').trim().toLowerCase();
      const rawTitle = (m.title || '').trim().toLowerCase();

      const isMatch = section.matchRoles.some((target) => {
        return (
          rawRole === target ||
          rawRole.startsWith(target) ||
          rawRole.endsWith(target) ||
          (rawRole === '' && rawTitle.includes(target))
        );
      });

      if (isMatch) {
        assignedIds.add(id);
        return true;
      }
      return false;
    });

    if (matched.length > 0) {
      result.push({ section, members: matched });
    }
  });

  // Collect any remaining members whose role was not in the 8 predefined buckets
  const unassigned = members.filter((m) => !assignedIds.has(m._id || m.name));
  if (unassigned.length > 0) {
    result.push({
      section: {
        id: 'other',
        title: 'Organizers',
        matchRoles: [],
        size: 'md',
      },
      members: unassigned,
    });
  }

  return result;
}

// Legacy type exports for backward compatibility
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
