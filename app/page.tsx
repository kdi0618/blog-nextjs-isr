import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';
import { Suspense } from 'react';

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <ArticleList articles={data.contents} />
        <Pagination totalCount={data.totalCount} />
      </Suspense>
    </>
  );
}
