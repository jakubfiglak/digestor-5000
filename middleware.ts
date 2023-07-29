import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/articles(.*)',
    '/resources',
    '/resources/tags(.*)',
    '/studio(.*)',
    '/protected-route',
  ],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
