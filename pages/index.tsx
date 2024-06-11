import React, { useState } from 'react';
import Router from 'next/router';
import "../app/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Home: React.FC = () => {
    const [query, setQuery] = useState<string>('');

    const handleSearch = () => {
        Router.push(`/results?query=${encodeURIComponent(query)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="animate-in fade-in duration-400 relative flex flex-col items-center justify-center min-h-screen bg-black">
            <SpeedInsights />
            <div className="absolute inset-0 bg-cover bg-center opacity-50"
                 style={{ backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/142/751/831/landscape-anime-digital-art-fantasy-art-wallpaper-preview.jpg')" }}>
            </div>
            <div className="relative z-10 text-white text-6xl font-bold mb-16">
                <h1 className="text-red-600">KNAnime</h1>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-gray-800 bg-opacity-80 rounded-lg shadow-2xl">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search Anime..."
                    className="w-80 p-3 text-lg border-2 border-gray-600 focus:border-red-600 rounded outline-none mb-6 transition text-black duration-300 ease-in-out"
                />
                <button
                    onClick={handleSearch}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 ease-in-out"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default Home;
