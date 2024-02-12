import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/articles(.*)',
    '/resources(.*)',
    '/studio(.*)',
    '/protected-route',
    '/api/revalidate',
    '/api/revalidate(.*)',
  ],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
