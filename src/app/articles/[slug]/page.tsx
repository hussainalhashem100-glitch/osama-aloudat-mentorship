import { ARTICLES } from '@/data/content';
import ArticleDetailClient from '@/components/ArticleDetailClient';

export function generateStaticParams() {
  return ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  return <ArticleDetailClient slug={resolvedParams.slug} />;
}
