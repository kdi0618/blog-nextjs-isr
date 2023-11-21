import { revalidateTag } from 'next/cache';
import { NextApiRequest, NextApiResponse } from 'next';

import crypto from 'crypto';

export async function POST(req: any) {
  try {
    // const expectedSignature = crypto
    //   .createHmac('sha256', 'remove11cache')
    //   .update(req.body)
    //   .digest('hex');

    // const signature = req.headers['x-microcms-signature'] || req.headers['X-MICROCMS-Signature'];

    // if (
    //   !signature ||
    //   Array.isArray(signature) ||
    //   !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    // ) {
    //   console.log('404stop');
    //   return res.status(401).send('Invalid token');
    // }

    const contentId = req.body.contents.new.id;

    revalidateTag('blog');

    console.log('revalidate', contentId);

    return new Response('Revalidation successful', {
      status: 200,
    }).json();
  } catch {
    return new Response('Revalidation failed', {
      status: 500,
    }).json();
  }
}
