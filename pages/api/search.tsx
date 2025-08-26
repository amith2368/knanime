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

// {
//     "id": "269",
//     "malId": 269,
//     "title": {
//       "romaji": "BLEACH",
//       "english": "Bleach",
//       "native": "BLEACH",
//       "userPreferred": "BLEACH"
//     },
//     "status": "Completed",
//     "image": "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx269-wc062RMqud8B.png",
//     "imageHash": "hash",
//     "cover": "https://s4.anilist.co/file/anilistcdn/media/anime/banner/269-08ar2HJOUAuL.jpg",
//     "coverHash": "hash",
//     "popularity": 345525,
//     "description": "Ichigo Kurosaki is a rather normal high school student apart from the fact he has the ability to see ghosts. This ability never impacted his life in a major way until the day he encounters the Shinigami Kuchiki Rukia, who saves him and his family's lives from a Hollow, a corrupt spirit that devours human souls. \n\u003Cbr\u003E\u003Cbr\u003E\nWounded during the fight against the Hollow, Rukia chooses the only option available to defeat the monster and passes her Shinigami powers to Ichigo. Now forced to act as a substitute until Rukia recovers, Ichigo hunts down the Hollows that plague his town. \n\n\n",
//     "rating": 78,
//     "genres": [
//       "Action",
//       "Adventure",
//       "Supernatural"
//     ],
//     "color": "#f1a150",
//     "totalEpisodes": 366,
//     "currentEpisodeCount": 366,
//     "type": "TV",
//     "releaseDate": 2004
//   }

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { keyword } =  req.query

    if (!keyword || typeof keyword !== 'string') {
        return res.status(400).json({error: 'Invalid Keyword'})
    }

    try {

        // New API
        const url = `https://knanime-api.vercel-dev.app/meta/anilist/${encodeURIComponent(keyword)}`;
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