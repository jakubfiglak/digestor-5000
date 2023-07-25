import {
  PortableText,
  PortableTextTypeComponentProps,
} from '@portabletext/react';
import { getImageDimensions } from '@sanity/asset-utils';
import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getArticle, getArticleSlugsList } from '@/modules/articles/api';
import { client } from '@/sanity/client';

export const dynamic = 'force-static';

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

export async function generateStaticParams() {
  const articles = await getArticleSlugsList();

  return articles.map((article) => ({
    slug: article.slug,
  }));
}

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
              internalLink: ({ value, children }) => {
                return (
                  <Link
                    href={`/articles/${value.slug}`}
                    className="text-yellow-700 underline"
                  >
                    {children}
                  </Link>
                );
              },
              link: ({ value, children }) => {
                const { blank, href } = value;
                return (
                  <a
                    href={href}
                    target={blank ? '_blank' : undefined}
                    rel={blank ? 'noopener' : undefined}
                    className="text-yellow-700 underline"
                  >
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
