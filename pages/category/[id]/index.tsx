// pages/[id].tsx
import "../../../app/globals.css";
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import KNHeader from "@/pages/header";
import KNFooter from "@/pages/footer";

interface AnimeDetails {
    title: string;
    year: string;
    image_url: string;
    description: string;
    genre: string;
    status: string;
    episodes: number;
}

const AnimePage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const [details, setDetails] = useState<AnimeDetails | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [currentRange, setCurrentRange] = useState<[number, number] | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const maxLength = 200; // Number of characters to show initially

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (typeof id === 'string') {
                try {
                    const response = await axios.get(`/api/anime?keyword=${encodeURIComponent(id)}`);
                    setDetails(response.data);
                } catch (e) {
                    console.error('Failed to fetch anime details:', e);
                }
            }
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
        <div className={`min-h-screen bg-black text-white p-8 ${isTransitioning ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'}`}>
            <KNHeader />
            <div className="min-h-screen bg-black text-white p-8 flex flex-col lg:flex-row items-center lg:items-start">
            <div className="flex-1 lg:pr-8">
                <h1 className="text-4xl font-bold mb-4">{details.title}</h1>
                <p className="text-lg mb-4">
                    {isExpanded ? details.description : `${details.description.slice(0, maxLength)}...`}
                    {details.description.length > maxLength && (
                        <button
                            onClick={toggleDescription}
                            className="text-blue-500 hover:text-blue-700 focus:outline-none ml-2"
                        >
                            {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                    )}
                </p>
                <p className="text-md mb-2">Released: {details.year}</p>
                <p className="text-md mb-2">Genre: {details.genre}</p>
                <p className="text-md mb-2">Status: {details.status}</p>
                <p className="text-md mb-4">Episodes: {details.episodes}</p>
                <div className="mb-8">
                    {episodeRanges(details.episodes).map((range, index) => (
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
                    {currentRange &&
                        Array.from({ length: currentRange[1] - currentRange[0] + 1 }, (_, i) => i + currentRange[0]).map((episode) => (
                            <button
                                key={episode}
                                onClick={() =>  handleAnimeClick(`${id}/${episode}`)}
                                className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                            >
                                Ep {episode}
                            </button>
                        ))}
                </div>
            </div>
            <div className="lg:w-1/3 w-full mt-8 lg:mt-0">
                    <div className="relative">
                        <img
                            src={details.image_url}
                            alt={details.title}
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
