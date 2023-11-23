import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

import crypto from 'crypto';

type Request = NextRequest & {
  body: {
    contents: {
      new: {
        id: string;
      };
    };
  };
};

export async function POST(request: any) {
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

    if (requestJson.api === 'blog') {
      requestJson.contents?.new?.id
        ? revalidateTag(requestJson.contents.new.id)
        : revalidateTag('blogList');
    } else if (requestJson.api === 'tags') {
      revalidateTag('tag');
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
