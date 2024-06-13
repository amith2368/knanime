import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type SkipTime = {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: string;
};

type FetchSkipTimesResponse = {
  results: SkipTime[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<FetchSkipTimesResponse | { message: string }>) {
  const { malId, episodeNumber, episodeLength } = req.query;

  if (!malId || !episodeNumber || !episodeLength) {
    return res.status(400).json({ message: 'malId, episodeNumber, and episodeLength are required' });
  }

  const types = ['ed', 'mixed-ed', 'mixed-op', 'op', 'recap'];
  const baseUrl = 'https://api.aniskip.com/v2/skip-times';
  const url = new URL(`${baseUrl}/${malId}/${episodeNumber}`);
  url.searchParams.append('episodeLength', episodeLength as string);
  types.forEach((type) => url.searchParams.append('types[]', type));

  try {
    const response = await axios.get(url.toString());
    const data = response.data;

    if (data.found) {
      res.status(200).json({ results: data.results });
    } else {
      res.status(404).json({ message: 'Skip times not found' });
    }
  } catch (error) {
    console.error('Error fetching skip times:', error);
    res.status(500).json({ message: 'Failed to fetch skip times' });
  }
}
