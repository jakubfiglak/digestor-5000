import { clerkClient } from '@clerk/nextjs';

import { editorsOrgId } from '../constants';

export async function checkIsEditor(userId: string) {
  const memberships =
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: editorsOrgId,
    });

  return memberships.some(
    (membership) => membership.publicUserData?.userId === userId
  );
}
