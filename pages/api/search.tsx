import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import * as cheerio from 'cheerio';
import {type} from "os";

type AnimeSearchResult = {
    title: string;
    release_date: string;
    image_url: string | undefined;
    url: string | undefined;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { keyword } =  req.query

    if (!keyword || typeof keyword !== 'string') {
        return res.status(400).json({error: 'Invalid Keyword'})
    }

    try {
        const url = `https://gogoanime3.co/search.html?keyword=${encodeURIComponent(keyword)}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const results: AnimeSearchResult[] = [];

        $('div.last_episodes ul.items li').each((index, element) => {
            const title = $(element).find('p.name a').text();
            const release_date = $(element).find('p.released').text().replace('Released: ', '');
            const image_url = $(element).find('div.img a img').attr('src');
            const url = $(element).find('p.name a').attr('href');
            results.push({ title, release_date, image_url, url})
        });

        res.status(200).json(results);

    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
};

export default handler;