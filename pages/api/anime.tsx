import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface AnimeDetail {
    id: string,
    title: string[],
    malId: number,
    trailer: {
      id: string,
      site: string,
      thumbnail: string
    },
    image: string,
    popularity: number,
    color: string,
    description: string,
    status: string,
    releaseDate: number,
    startDate: {
      year: number,
      month: number,
      day: number
    },
    endDate: {
      year: number,
      month: number,
      day: number
      },
    rating: number,
    genres: string[],
    season: string,
    studios: string[],
    type: string,
    recommendations: {
      id: string,
      malId: string,
      title: string[],
      status: string,
      episodes: number,
      image: string,
      cover: string,
      rating: number,
      type: string,
    },
    characters: {
      id: string,
      role: string,
      name: string[],
      image: string,
    },
    relations: {
      id: number,
      relationType: string,
      malId: number,
      title: string[],
      status: string,
      episodes: number,
      image: string,
      color: string,
      type: string,
      cover: string,
      rating: number,
    },
    episodes: {
      id: string,
      title: string,
      episode: string,
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid keyword' });
  }

  try {
    // const url = `https://gogoanime3.co/category/${encodeURIComponent(keyword)}`;
    // const { data } = await axios.get(url);

    // const $ = cheerio.load(data);
    //
    // const title = $('div.anime_info_body_bg h1').text();
    // const year = $('p:contains(Released)').text().replace('Released: ', '');
    // const image_url = $('div.anime_info_body_bg img').attr('src');
    // const description = $('div.description').text().trim();
    // const genre = $('p:contains(Genre)').text().replace('Genre: ', '').trim();
    // const status = $('p:contains(Status)').text().replace('Status: ', '').trim();
    // // const episodes = $('#episode_page').find('li:last').attr('ep_end');
    // const episodes = $('#episode_page li:last a').attr('ep_end');
    // const animeDetail: AnimeDetail = {
    //   title,
    //   year,
    //   image_url,
    //   description,
    //   genre,
    //   status,
    //   episodes
    // };

    // NEW API
    const url = `https://knanime-api.vercel.app/meta/anilist/info/${encodeURIComponent(id)}`;
    const { data } = await axios.get(url);
    const anime: AnimeDetail = data;
    res.status(200).json(anime);
  } catch (error) {
    console.error('Error fetching anime details:', error);
    res.status(500).json({ error: 'Failed to fetch anime details' });
  }
};

export default handler;