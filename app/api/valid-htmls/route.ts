export async function POST(req: any, res: any) {
  try {
    const crypto = require('crypto');

    const expectedSignature = crypto
      .createHmac('sha256', 'remove11cache')
      .update(req.body)
      .digest('hex');
    const signature = req.headers['X-MICROCMS-Signature'];
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return res.status(401).send('Invalid token');
    }

    const contentId = req.body.contents.new.id;
    await res.unstable_revalidate(`/articles/${contentId}`);

    return res.status(200).send();
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
