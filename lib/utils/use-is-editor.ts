'use client';

import { useOrganizationList } from '@clerk/nextjs';

import { editorsOrgId } from '../constants';

export function useIsEditor() {
  const { isLoaded, organizationList } = useOrganizationList();

  if (!isLoaded) {
    return false;
  }

  return organizationList.some(
    (org) => org.membership.organization.id === editorsOrgId
  );
}
