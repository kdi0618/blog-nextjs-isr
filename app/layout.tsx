import { getTagList } from '@/libs/microcms';
import { LIMIT } from '@/constants';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import './globals.css';
import styles from './layout.module.css';
import { Suspense } from 'react';

export const metadata = {
  metadataBase: new URL(process.env.BASE_URL || 'http://localhost:3000'),
  title: 'kode Blog of lifestyle',
  description: 'kode lifestyle blog with Next.js, microCMS, and Vercel.',
  openGraph: {
    title: 'kode Blog',
    description: 'kode lifestyle blog with Next.js, microCMS, and Vercel.',
    images: '/ogp.png', // TODO: 最新記事のサムネを反映する
  },
  alternates: {
    canonical: '/',
  },
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const tags = await getTagList({
    limit: LIMIT,
  });
  return (
    <html lang="ja">
      <body>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Nav tags={tags.contents} />
          <main className={styles.main}>{children}</main>
        </Suspense>
        <Footer />
      </body>
    </html>
  );
}
