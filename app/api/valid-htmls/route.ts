import { revalidateTag } from 'next/cache';
import { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: any, res: NextApiResponse) {
  console.log('start')
  try {
    const crypto = require('crypto');

    const expectedSignature = crypto
      .createHmac('sha256', 'remove11cache')
      .update(req.body)
      .digest('hex');
    const signature = req.headers['X-MICROCMS-Signature'];
    if (
      !signature ||
      Array.isArray(signature) ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) {
      console.log('404stop')
      return res.status(401).send('Invalid token');
    }

    const contentId = req.body.contents.new.id;
    revalidateTag('blog')
    console.log('revalidate', contentId);
    return res.status(200).send('Revalidated successfully');
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
