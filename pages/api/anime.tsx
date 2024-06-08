import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

type AnimeDetail = {
  title: string;
  year: string;
  image_url: string | undefined;
  description: string;
  genre: string;
  status: string;
  episodes: string | undefined;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { keyword } = req.query;

  if (!keyword || typeof keyword !== 'string') {
    return res.status(400).json({ error: 'Invalid keyword' });
  }

  try {
    const url = `https://gogoanime3.co/category/${encodeURIComponent(keyword)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('div.anime_info_body_bg h1').text();
    const year = $('p:contains(Released)').text().replace('Released: ', '');
    const image_url = $('div.anime_info_body_bg img').attr('src');
    const description = $('div.description').text().trim();
    const genre = $('p:contains(Genre)').text().replace('Genre: ', '').trim();
    const status = $('p:contains(Status)').text().replace('Status: ', '').trim();
    // const episodes = $('#episode_page').find('li:last').attr('ep_end');
    const episodes = $('#episode_page li:last a').attr('ep_end');
    const animeDetail: AnimeDetail = {
      title,
      year,
      image_url,
      description,
      genre,
      status,
      episodes
    };

    res.status(200).json(animeDetail);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    res.status(500).json({ error: 'Failed to fetch anime details' });
  }
};

export default handler;