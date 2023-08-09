'use client';

import { useOrganizationList } from '@clerk/nextjs';

export function useIsEditor() {
  const { isLoaded, organizationList } = useOrganizationList();

  if (!isLoaded) {
    return false;
  }

  return organizationList.some(
    (org) => org.membership.organization.name === 'Editors'
  );
}
