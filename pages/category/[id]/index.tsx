// pages/[id].tsx
import "../../../app/globals.css";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import KNHeader from "@/pages/header";
import KNFooter from "@/pages/footer";
import parse from 'html-react-parser';

interface AnimeDetails {
  id: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  malId: number;
  synonyms: string[];
  isLicensed: boolean;
  isAdult: boolean;
  countryOfOrigin: string;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
    thumbnailHash: string;
  };
  image: string;
  imageHash: string;
  popularity: number;
  color: string;
  cover: string;
  coverHash: string;
  description: string;
  status: string;
  releaseDate: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  totalEpisodes: number;
  currentEpisode: number;
  rating: number;
  duration: number;
  genres: string[];
  season: string;
  studios: string[];
  subOrDub: string;
  type: string;
  recommendations: Recommendation[];
  characters: Character[];
  relations: Relation[];
  mappings: Mapping[];
  artwork: Artwork[];
}

interface Recommendation {
  id: number;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  status: string;
  episodes: number;
  image: string;
  imageHash: string;
  cover: string;
  coverHash: string;
  rating: number;
  type: string;
}

interface Character {
  id: number;
  role: string;
  name: {
    first: string;
    last?: string;
    full: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  imageHash: string;
  voiceActors: VoiceActor[];
}

interface VoiceActor {
  id: number;
  language: string;
  name: {
    first: string;
    last?: string;
    full: string;
    native?: string;
    userPreferred: string;
  };
  image: string;
  imageHash: string;
}

interface Relation {
  id: number;
  relationType: string;
  malId: number;
  title: {
    romaji: string;
    english?: string;
    native: string;
    userPreferred: string;
  };
  status: string;
  episodes?: number;
  image: string;
  imageHash: string;
  color: string;
  type: string;
  cover: string;
  coverHash: string;
  rating: number;
}

interface Mapping {
  id: string;
  providerId: string;
  similarity: number;
  providerType: string;
}

interface Artwork {
  img: string;
  type: string;
  providerId: string;
}


const AnimePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [details, setDetails] = useState<AnimeDetails | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentRange, setCurrentRange] = useState<[number, number] | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [watchedEpisodes, setWatchedEpisodes] = useState<any[]>([]);

    const maxLength = 200; // Number of characters to show initially

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (typeof id === 'string') {
                try {
                    const response = await axios.get(`/api/anime?id=${encodeURIComponent(id)}`);
                    const watched = getEpisodesWatched(id);
                    setWatchedEpisodes(watched);
                    setDetails(response.data);
                } catch (e) {
                    console.error('Failed to fetch anime details:', e);
                }
            }
        };

        const getEpisodesWatched = (id: string) => {
            // Retrieve the all_episodes_watched item from localStorage
            const allEpisodesWatched = JSON.parse(localStorage.getItem('all_episodes_watched') || '{}');
            // Return the list of episodes watched for the specific id, or an empty array if the id does not exist
            return allEpisodesWatched[id as string] || [];
        };

        fetchDetails();
    }, [id]);

    const episodeRanges = (totalEpisodes: number, rangeSize: number = 30): [number, number][] => {
        const ranges: [number, number][] = [];
        for (let i = 1; i <= totalEpisodes; i += rangeSize) {
            ranges.push([i, Math.min(i + rangeSize - 1, totalEpisodes)]);
        }
        return ranges;
    };

    const handleRangeClick = (range: [number, number]) => {
        setCurrentRange(range);
    };

    const handleAnimeClick = (url: string) => {
        setIsTransitioning(true);
        setTimeout(() => {
            router.push(url);
        }, 500); // Match this timeout with the CSS transition duration
    };

    if (!details) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full text-red-600" role="status">
                    <span className="visually-hidden">...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-black text-white ${isTransitioning ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'}`}>
            <KNHeader />
            <div className="min-h-screen bg-black text-white p-8 flex flex-col lg:flex-row items-center lg:items-start">
            <div className="flex-1 lg:pr-8">
                <h1 className="text-4xl font-bold mb-4">{details.title.english}</h1>
                <p className="text-lg mb-4">
                    {isExpanded ? parse(details.description) : parse(`${details.description.slice(0, maxLength)}...`)}
                    {details.description.length > maxLength && (
                        <button
                            onClick={toggleDescription}
                            className="text-blue-500 hover:text-blue-700 focus:outline-none ml-2"
                        >
                            {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    )}
                </p>
                <p className="text-md mb-2"><b>Released:</b> {details.releaseDate}</p>
                <p className="text-md mb-2"><b>Genre:</b> {details.genres.map(genre => genre + ', ')}</p>
                <p className="text-md mb-2"><b>Status:</b> {details.status}</p>
                {details.type !== "MOVIE" && <p className="text-md mb-4"><b>Episodes:</b> {details.totalEpisodes}</p>}

                <div className="mb-8">
                {details.type !== 'MOVIE' && episodeRanges(details.totalEpisodes).map((range, index) => (
                        <button
                            key={index}
                            onClick={() => handleRangeClick(range)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out mr-2 mb-2"
                        >
                            {range[0]}-{range[1]}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {details.type !== 'MOVIE' && currentRange &&
                        Array.from({ length: currentRange[1] - currentRange[0] + 1 }, (_, i) => i + currentRange[0]).map((episode) => (
                            <button
                                key={episode}
                                onClick={() =>  handleAnimeClick(`/category/${details?.id}/episode?id=${details?.id}&ep=${episode}`)}
                                className={`bg-gray-700 hover:bg-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out ${watchedEpisodes.includes(episode.toString()) ? 'bg-gray-700' : 'bg-red-600'}`}
                            >
                                {details.type === 'MOVIE' ? 'Movie' : 'EP ' + episode}
                            </button>
                        ))}
                    {details.type === 'MOVIE' &&
                        <button
                            key={1}
                            onClick={() => handleAnimeClick(`/category/${details?.id}/episode?id=${details?.id}&ep=1`)}
                            className={`bg-gray-700 hover:bg-gray-800 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out ${watchedEpisodes.includes('1') ? 'bg-gray-700' : 'bg-red-600'}`}
                        >
                            Movie
                        </button>
                    }
                </div>
            </div>
                <div className="lg:w-1/3 w-full mt-8 lg:mt-0">
                    <div className="relative">
                        <img
                            src={details.image}
                            alt={details.title.english}
                            className="w-full h-auto rounded-lg shadow-lg"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black rounded-lg"></div>
                    </div>
                </div>
            </div>
            <KNFooter />
        </div>
    );
};

export default AnimePage;
