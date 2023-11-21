import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  MicroCMSContentId,
} from 'microcms-js-sdk';

// タグの型定義
export type Tag = {
  name: string;
} & MicroCMSContentId &
  MicroCMSDate;

// ライターの型定義
export type Writer = {
  name: string;
  profile: string;
  image?: MicroCMSImage;
} & MicroCMSContentId &
  MicroCMSDate;

// ブログの型定義
export type Blog = {
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
  tags?: Tag[];
  writer?: Writer;
};

export type Article = Blog & MicroCMSContentId & MicroCMSDate;

// 環境変数の確認
const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const apiKey = process.env.MICROCMS_API_KEY;

if (!serviceDomain || !apiKey) {
  throw new Error('MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY are required');
}

const headers = {
  'Content-Type': 'application/json',
  'X-API-KEY': apiKey,
};

// ブログ一覧を取得
export const getList = async (queries?: MicroCMSQueries) => {
  try {
    const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/blog`);
    if (queries) {
      Object.keys(queries).forEach((key) => url.searchParams.append(key, queries[key]));
    }

    const response = await fetch(url.toString(), {
      headers,
      next: {
        // キャッシュパージ用のキーを指定
        tags: ['blogList'],
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch list');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ブログの詳細を取得
export const getDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  try {
    const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/blog/${contentId}`);
    if (queries) {
      Object.keys(queries).forEach((key) => url.searchParams.append(key, queries[key]));
    }

    const response = await fetch(url.toString(), {
      headers,
      next: {
        tags: [contentId],
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch detail');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// タグの一覧を取得
export const getTagList = async (queries?: MicroCMSQueries) => {
  try {
    const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/tags`);
    if (queries) {
      Object.keys(queries).forEach((key) => url.searchParams.append(key, queries[key]));
    }

    const response = await fetch(url.toString(), {
      headers,
      next: {
        tags: ['tag'],
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tag list');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// タグの詳細を取得
export const getTag = async (contentId: string, queries?: MicroCMSQueries) => {
  try {
    const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/tags/${contentId}`);
    if (queries) {
      Object.keys(queries).forEach((key) => url.searchParams.append(key, queries[key]));
    }

    const response = await fetch(url.toString(), {
      headers,
      next: {
        tags: ['tag'],
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch tag');
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
