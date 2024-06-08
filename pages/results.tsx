// pages/results.tsx
import "../app/globals.css";
import { useRouter } from 'next/router';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import KNHeader from "@/pages/header";
import KNFooter from "@/pages/footer";

interface Anime {
    title: string;
    release_date: string;
    image_url: string;
    url: string;
}

const Results: React.FC = () => {
    const router = useRouter();
    const { query } = router.query;
    const [animes, setAnime] = useState<Anime[] | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const fetchSearchDetails = async () => {
            if (typeof query === 'string') {
                try {
                    const response = await axios.get(`/api/search?keyword=${encodeURIComponent(query)}`);
                    setAnime(response.data);
                } catch (e) {
                    console.error('Failed to fetch search details:', e);
                }
            }
        };
        fetchSearchDetails();
    }, [query]);

    const handleAnimeClick = (url: string) => {
        setIsTransitioning(true);
        setTimeout(() => {
            router.push(url);
        }, 500); // Match this timeout with the CSS transition duration
    };

    if (!animes) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full text-red-600" role="status">
                    <span className="visually-hidden">...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-black text-white p-8 ${isTransitioning ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'}`}>
            <KNHeader />
            <div className="min-h-screen bg-black text-white p-8">
                <h1 className="text-4xl font-bold mb-8 text-center">Anime Results</h1>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {animes.map((anime, index) => (
                        <div key={index} onClick={() => handleAnimeClick(anime.url)} className="relative cursor-pointer overflow-hidden rounded-lg transform transition duration-500 hover:scale-105">
                            <div className="relative cursor-pointer overflow-hidden rounded-lg transform transition duration-500 hover:scale-105">
                                <img
                                    src={anime.image_url}
                                    alt={anime.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                                    <h3 className="text-xl font-bold">{anime.title}</h3>
                                    <p className="text-sm">Released: {anime.release_date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {animes.length > 0 ? (
                    <h3 className="text-center mt-8">Found {animes.length} shows</h3>
                ) : (
                    <h3 className="text-center mt-8">Found no results</h3>
                )}
            </div>
            <KNFooter />
        </div>

    );
};

export default Results;
