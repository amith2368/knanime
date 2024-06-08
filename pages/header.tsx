import Link from 'next/link';
import {useState} from "react";
import Router from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const KNHeader: React.FC = () => {
    const [ query, setQuery ] = useState<string>('');

    const handleSearch = () => {
        if (query.trim()) {
            Router.push(`/results?query=${encodeURIComponent(query)}`);
        }
    }
    return (
        <header className="bg-black text-white p-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-red-600">
                    <Link href="/">
                        <p>KNAnime</p>
                    </Link>
                </h1>
                <nav className="hidden md:flex space-x-4">
                    <Link href="/">
                        <p className="hover:text-red-500">Home</p>
                    </Link>
                    <Link href="https://github.com/amith2368">
                        <p className="hover:text-red-500">Contact</p>
                    </Link>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search"
                        className="p-2 bg-gray-800 text-white rounded-full pl-8 focus:outline-none"
                    />
                    <FontAwesomeIcon
                        icon="search"
                        className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        onClick={handleSearch}
                    />
                </div>
                <div className="md:hidden">
                    {/* Mobile Menu Button (optional) */}
                </div>
            </div>
        </header>
    );
};

export default KNHeader;