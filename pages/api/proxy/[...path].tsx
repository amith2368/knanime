import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';

// Function to handle API requests
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query; // Extract the dynamic path from the request
  const url = `${(path as string[]).join('/')}`;

  // Only allow GET requests for video stream proxying
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Only GET method is allowed' });
    return;
  }

  try {
    // Fetch the resource (video stream, HLS, etc.) from the external API
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl', // HLS-specific content type
        // Include additional headers if required by the external API
      },
    });

    if (!response.ok) {
      res.status(response.status).json({ message: 'Error fetching from external API' });
      return;
    }

    // Forward the video stream (HLS content) to the client
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Handle CORS

    // Stream the data back to the client
    response.body?.pipe(res);
  } catch (error) {
    console.error('Error in proxy API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
