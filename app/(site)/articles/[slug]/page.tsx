import {
  PortableText,
  PortableTextTypeComponentProps,
} from '@portabletext/react';
import { getImageDimensions } from '@sanity/asset-utils';
import { NextPage } from 'next';
import Image from 'next/image';
import { groq } from 'next-sanity';
import { z } from 'zod';

import { client } from '@/sanity/client';

const articleQuery = groq`*[_type == "article" && slug.current == $slug][0] {
  "id": _id,
  title,
  "slug": slug.current,
  coverImage {
    ...
  },
  excerpt,
  content[] {
    ...,
    markDefs[] {
      ...,
      _type == 'resourceLink' => {
        "url": @.reference->url
      }
    }
  }
}`;

const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  coverImage: z
    .object({
      alt: z.string(),
      caption: z.string().optional().nullable(),
      asset: z.object({
        _ref: z.string(),
        _type: z.string(),
      }),
    })
    .optional()
    .nullable(),
  excerpt: z.string().optional().nullable(),
  slug: z.string(),
  content: z.any(),
});

async function getArticle(slug: string) {
  const data = await client.fetch(articleQuery, { slug });
  return articleSchema.parse(data);
}

const CustomImage = ({ value }: PortableTextTypeComponentProps<any>) => {
  const { width, height } = getImageDimensions(value);

  return (
    <figure className="my-6">
      <Image
        src={client.imageUrlBuilder.image(value).url()}
        alt={value.alt}
        width={width}
        height={height}
      />
      {value.caption && (
        <figcaption className="text-center text-sm text-slate-600">
          {value.caption}
        </figcaption>
      )}
    </figure>
  );
};

type ArticlePageProps = {
  params: { slug: string };
};

const ArticlePage: NextPage<ArticlePageProps> = async ({
  params: { slug },
}) => {
  const article = await getArticle(slug);

  return (
    <>
      <article className="mx-auto max-w-3xl">
        {article.coverImage && (
          <figure className="my-6">
            <Image
              src={client.imageUrlBuilder.image(article.coverImage).url()}
              alt={article.coverImage.alt}
              width={getImageDimensions(article.coverImage).width}
              height={getImageDimensions(article.coverImage).height}
            />
            {article.coverImage.caption && (
              <figcaption className="text-center text-sm text-slate-600">
                {article.coverImage.caption}
              </figcaption>
            )}
          </figure>
        )}
        <h2 className="my-6 text-center text-4xl font-bold">{article.title}</h2>
        {article.excerpt && <p>{article.excerpt}</p>}
        <PortableText
          value={article.content}
          components={{
            block: {
              h2: ({ children }) => (
                <h2 className="my-6 text-2xl font-bold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="my-4 text-xl font-bold">{children}</h3>
              ),
            },
            list: {
              bullet: ({ children }) => (
                <ul className="my-4 list-inside list-disc">{children}</ul>
              ),
            },
            marks: {
              resourceLink: ({ value, children }) => {
                return (
                  <a href={value.url} className="text-yellow-700 underline">
                    {children}
                  </a>
                );
              },
            },
            types: { image: CustomImage },
          }}
        />
      </article>
    </>
  );
};

export default ArticlePage;
