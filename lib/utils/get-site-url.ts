import { env } from '@/env.mjs';

export function getSiteUrl() {
  return env.SITE_URL || `https://${env.VERCEL_URL}`;
}
