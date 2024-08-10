import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid URL parameter' });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');

    if (!response.ok || !contentType) {
      return res.status(response.status).json({ error: 'Failed to fetch the HLS stream' });
    }

    const data = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.status(200).send(Buffer.from(data));
  } catch (error) {
    console.error('Error fetching the HLS stream:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
