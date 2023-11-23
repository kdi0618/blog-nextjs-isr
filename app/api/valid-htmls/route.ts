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

export function POST(request: any) {
  try {
    const headersList = headers();
    const signature =
      headersList.get('x-microcms-signature') || headersList.get('X-MICROCMS-Signature');
    console.log('signature', signature);

    console.log('request.json', request.json());

    const expectedSignature = crypto
      .createHmac('sha256', 'remove11cache')
      .update(request.body)
      .digest('hex');

    // console.log('expectedSignature', expectedSignature);

    // if (
    //   !signature ||
    //   Array.isArray(signature) ||
    //   !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    // ) {
    //   return new Response('Invalid token', {
    //     status: 401,
    //   });
    // }

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
