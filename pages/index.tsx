import { useState } from 'react';
import Router from 'next/router';
import "../app/globals.css";

const Home: React.FC = () => {
    const [query, setQuery] = useState<string>('');

    const handleSearch = () => {
        Router.push(`/results?query=${encodeURIComponent(query)}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="text-white text-4xl font-bold mb-8">
                <h1>KNAnime</h1>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-xl">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search videos"
                    className="p-3 text-lg border-2 border-gray-300 focus:border-purple-500 rounded outline-none mb-4 transition text-black duration-300 ease-in-out"
                />
                <button
                    onClick={handleSearch}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default Home;
