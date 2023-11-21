import { revalidateTag } from 'next/cache';
import { NextApiRequest, NextApiResponse } from 'next';

import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// Define the expected structure of your request body
interface RequestBody {
  contents: {
    new: {
      id: string;
    };
  };
}

// Extend NextApiRequest to include your custom body
interface ApiRequest extends NextApiRequest {
  body: RequestBody;
  headers: {
    'X-MICROCMS-Signature': string | string[] | undefined;
  };
}

export async function POST(req: any) {
  console.log('res', NextRequest);
  console.log('res', NextResponse);
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

    return res.status(200).send('Revalidated successfully');
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
