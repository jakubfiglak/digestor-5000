import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

import { env } from '@/env.mjs';
import { generateRssFeed } from '@/lib/utils/generate-rss-feed';
import { cacheTags as articlesCacheTags } from '@/modules/articles/api';
import { cacheTags as resourcesCacheTags } from '@/modules/resources/api';

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      slug?: string;
    }>(req, env.SANITY_WEBHOOK_SECRET);

    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 });
    }

    if (!body || !body?._type) {
      return new Response('Invalid body', { status: 400 });
    }

    if (body._type === 'article') {
      revalidateTag(articlesCacheTags.detailsList);
      revalidateTag(articlesCacheTags.list);
      if (body.slug) {
        revalidateTag(articlesCacheTags.details(body.slug));
      }
      await generateRssFeed();
    }

    if (body._type === 'resource') {
      revalidateTag(resourcesCacheTags.list);
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    });
  } catch (error) {
    console.error(error);
    return new Response(
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : 'Something went wrong',
      { status: 500 }
    );
  }
}
