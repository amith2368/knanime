import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios';
import * as cheerio from 'cheerio';
import {type} from "os";

interface AnimeSearchResult  {
    id: string;
    malId: number;
    title: {
        romaji: string;
        english: string;
        native: string;
        userPreferred: string;
    }
    status: string;
    image: string;
    imageHash: string;
    cover: string;
    coverHash: string;
    popularity: number;
    description: string;
    rating: number;
    genres: string[];
    color: string;
    totalEpisodes: number;
    currentEpisodeCount: number;
    type: string;
    releaseDate: number;
}


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { keyword } =  req.query

    if (!keyword || typeof keyword !== 'string') {
        return res.status(400).json({error: 'Invalid Keyword'})
    }

    try {

        // New API
        const url = `https://knanime-api.vercel-dev.app/meta/anilist/advanced-search?query=${encodeURIComponent(keyword)}&page=1&perPage=5`
        const { data } = await axios.get(url);
        const animes: AnimeSearchResult[] = data.results;
        // Filter and remove the animes from the list which doesnt have attribute malId as null
        const filterAnimes = animes.filter((anime: AnimeSearchResult) => {
            return anime.malId !== null
        })

        res.status(200).json(filterAnimes);

    } catch (error) {
        console.error('Error fetching search results:', error);
        res.status(500).json({ error: 'Failed to fetch search results' });
    }
};

export default handler;