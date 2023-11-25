import supertest from 'supertest';
import { createServer } from 'http';
 // @ts-ignore
import { apiResolver } from 'next/dist/server/api-utils/node';
import { NextApiRequest, NextApiResponse } from 'next';

import { POST as postHandler } from '../../../app/api/valid-htmls/route';

const request = (handler: any) => {
  const server = createServer((req, res) =>
    apiResolver(req, res, undefined, handler, {
      previewModeEncryptionKey: '',
      previewModeId: '',
      previewModeSigningKey: '',
    }, false)
  );
  return supertest(server);
};

describe('POST API Route', () => {
  it('responds to valid request', async () => {
    const response = await request(postHandler).post('/').send({
      contents: {
        new: {
          id: 1432143214,
        }
      }
    });
    expect(response.statusCode).toBe(200); // Or other expected status code
    // Additional assertions...
  });

  // Add more test cases as needed
});
