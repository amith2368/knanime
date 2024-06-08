import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

type EpisodeLinks = {
  mirrors: string[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { anime, episode } = req.query;

  if (!anime || !episode || typeof anime !== 'string' || typeof episode !== 'string') {
    return res.status(400).json({ error: 'Invalid anime name or episode number' });
  }

  try {
      const url = `https://gogoanime3.co/${encodeURIComponent(anime)}-episode-${encodeURIComponent(episode)}`;
      const {data} = await axios.get(url);
      const $ = cheerio.load(data);

      const mirrors: string[] = [];

      $('div.anime_muti_link ul li').each((index, element) => {
          const mirrorUrl = $(element).find('a').attr('data-video');
          if (mirrorUrl) {
              mirrors.push(mirrorUrl);
          }
      });

      const episodeLinks: EpisodeLinks = {
          mirrors,
      };

       res.status(200).json(episodeLinks);
  } catch (error) {
    console.error('Error fetching episode details:', error);
    res.status(500).json({ error: 'Failed to fetch anime episode details' });
  }
}

export default handler;