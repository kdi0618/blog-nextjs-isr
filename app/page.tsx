import { getList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Pagination from '@/components/Pagination';
import ArticleList from '@/components/ArticleList';

export default async function Page() {
  const data = await getList({
    limit: LIMIT,
  });
  return (
    <main>
      <ArticleList articles={data.contents} />
      <Pagination totalCount={data.totalCount} />
    </main>
  );
}
