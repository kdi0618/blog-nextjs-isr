import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';

import crypto from 'crypto';

// type Request = NextRequest & {
//   body: {
//     contents: {
//       new: {
//         id: string;
//       };
//     };
//   };
// };

export async function POST(request: any) {
  try {
    const signature =
      request.headers['x-microcms-signature'].value ||
      request.headers['X-MICROCMS-Signature'].value;
    console.log('signature', signature);

    console.log('request.body', request.body);

    const expectedSignature = crypto
      .createHmac('sha256', 'remove11cache')
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
