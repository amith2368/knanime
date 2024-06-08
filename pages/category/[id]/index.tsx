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
    const [displayedEpisodes, setDisplayedEpisodes] = useState<number[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (typeof id === 'string') {
                try {
                    const response = await axios.get(`/api/anime?keyword=${encodeURIComponent(id)}`);
                    setDetails(response.data);
                    setDisplayedEpisodes(Array.from({ length: Math.min(100, response.data.episodes) }, (_, i) => i + 1));
                    setHasMore(response.data.episodes > 100);
                } catch (e) {
                    console.error('Failed to fetch anime details:', e);
                }
            }
        };

        fetchDetails();
    }, [id]);

    const fetchMoreEpisodes = () => {
        if (details) {
            const newEpisodes = Array.from(
                { length: Math.min(20, details.episodes - displayedEpisodes.length) },
                (_, i) => i + 1 + displayedEpisodes.length
            );
            setDisplayedEpisodes(prevEpisodes => [...prevEpisodes, ...newEpisodes]);
            setHasMore(displayedEpisodes.length + newEpisodes.length < details.episodes);
        }
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
                    <span className="visually-hidden">Loading...</span>
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
                <p className="text-lg mb-4">{details.description}</p>
                <p className="text-md mb-2">Released: {details.year}</p>
                <p className="text-md mb-2">Genre: {details.genre}</p>
                <p className="text-md mb-2">Status: {details.status}</p>
                <p className="text-md mb-4">Episodes: {details.episodes}</p>
                <div>
                    <InfiniteScroll
                        dataLength={displayedEpisodes.length}
                        next={fetchMoreEpisodes}
                        hasMore={hasMore}
                        loader={<h4>Loading more episodes...</h4>}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                    >
                        {displayedEpisodes.map(episode => (
                            <button
                                key={episode}
                                onClick={() => handleAnimeClick(`${id}/${episode}`)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition transform duration-300 ease-in-out"
                            >
                                Ep {episode}
                            </button>
                        ))}
                    </InfiniteScroll>
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
