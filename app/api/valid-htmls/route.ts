import { revalidateTag, revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

import crypto from 'crypto';

type Request = NextRequest & {
  body: {
    contents: {
      old: {
        id: string;
      };
      new: {
        id: string;
      };
    };
  };
};

export async function POST(request: Request) {
  try {
    const headersList = headers();
    const signature =
      headersList.get('x-microcms-signature') || headersList.get('X-MICROCMS-Signature');

    const requestJson = await request.json();

    const expectedSignature = crypto
      .createHmac('sha256', process.env.MICROCMS_WEBHOOK_SIGNATURE)
      .update(JSON.stringify(requestJson))
      .digest('hex');

    if (
      !signature ||
      Array.isArray(signature) ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return new Response('Invalid token', {
        status: 401,
      });
    }

    console.log('Revalidation Start');
    const contentId = requestJson.contents?.old?.id;

    if (requestJson.api === 'blog') {
      // 元から存在するページの場合、対象ページとTOPを再生成
      if (Boolean(requestJson.contents?.old?.id)) {
        revalidatePath('/', 'page');
        revalidatePath(`/articles/${contentId}`, 'page');
      } else {
        // 新規ページの場合はTOPを再生成
        revalidatePath('/', 'page');
      }
    } else if (requestJson.api === 'tags') {
      // タグ変更の場合は全ページ再生成
      revalidatePath('/', 'layout');
    }

    console.log('Revalidation successful');
    return new Response('Revalidation successful', {
      status: 200,
    });
  } catch {
    console.log('Revalidation Process Error');
    return new Response('Revalidation failed', {
      status: 500,
    });
  }
}
