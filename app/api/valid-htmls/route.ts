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
    console.log('request.json', requestJson);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.MICROCMS_WEBHOOK_SIGNATURE)
      .update(request.body)
      .digest('hex');

    console.log('expectedSignature', expectedSignature);

    if (
      !signature ||
      Array.isArray(signature) ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      return new Response('Invalid token', {
        status: 401,
      });
    }

    console.log('req.body', request.body);
    console.log('req', request);

    const contentId = request.body.contents.new.id;

    revalidateTag('blogList');
    revalidateTag(contentId);
    revalidateTag('tag');

    return new Response('Revalidation successful', {
      status: 200,
    });
  } catch {
    return new Response('Revalidation failed', {
      status: 500,
    });
  }
}
