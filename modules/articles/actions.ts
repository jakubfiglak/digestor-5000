'use server';

import { auth } from '@clerk/nextjs';
import { revalidateTag } from 'next/cache';
import slugify from 'slugify';

import { checkIsEditor } from '@/lib/utils/check-is-editor';
import {
  buildHeading,
  buildParagraph,
  buildResourceListItem,
} from '@/lib/utils/portable-text';
import { getResourcesListForArticleScaffold } from '@/modules/resources/api';
import { client } from '@/sanity/client';

import { cacheTags, getArticlesListBySlug } from './api';

async function generateArticleContent() {
  const resources = await getResourcesListForArticleScaffold();

  const thoughtProvoking = resources.filter(
    (resource) =>
      resource.articles?.length === 0 && resource.type !== 'whatchamacallit'
  );
  const whatchamacallits = resources.filter(
    (resource) =>
      resource.articles?.length === 0 && resource.type === 'whatchamacallit'
  );

  return [
    buildHeading('💎 Highlight of the Week'),
    buildParagraph(
      'Highlight of the Week placeholder paragraph. Please edit this before publishing.'
    ),
    buildHeading('📎 Thought-Provoking Bits'),
    ...thoughtProvoking.map(buildResourceListItem),
    buildHeading('📦 Useful Whatchamacallits'),
    ...whatchamacallits.map(buildResourceListItem),
    buildHeading('🤠 Weekly Meme'),
  ];
}

type ScaffoldArticleArgs = {
  title: string;
};

export async function scaffoldArticle({ title }: ScaffoldArticleArgs) {
  const { userId } = auth();

  if (!userId) {
    return {
      success: false,
      message: 'You must be logged in to scaffold an article',
    };
  }

  const isEditor = await checkIsEditor(userId);

  if (!isEditor) {
    return {
      success: false,
      message: 'You must be an editor to scaffold an article',
    };
  }

  // Generate slug and check if resource with the given slug already exists
  let slug = slugify(title, { lower: true });

  const existingArticlesBySlug = await getArticlesListBySlug(slug);

  // If resource with the given slug already exists, append a number to the slug
  if (existingArticlesBySlug.length > 0) {
    slug = `${slug}-${existingArticlesBySlug.length}`;
  }

  // Generate article content
  const content = await generateArticleContent();

  try {
    const article = await client.create({
      _type: 'article',
      /**
       * This ensures that an article is created as a draft
       * https://www.sanity.io/docs/js-client#creating-documents
       */
      _id: 'drafts.',
      title,
      slug: { current: slug },
      content,
    });

    revalidateTag(cacheTags.list);
    revalidateTag(cacheTags.detailsList);

    return {
      success: true,
      message: 'Article scaffolded successfully!',
      data: article,
    };
  } catch (error) {
    return {
      success: false,
      message:
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
          ? error.message
          : 'Something went wrong, please try again later',
    };
  }
}
