import Link from 'next/link';

const KNFooter: React.FC = () => {
    return (
        <footer className="bg-black text-white p-4 text-center shadow-inner">
            <nav className="flex justify-center space-x-4 mb-4">
                <Link href="/">
                        <p className="hover:text-red-500">Home</p>
                </Link>
                <Link href="/">
                        <p className="hover:text-red-500">About</p>
                </Link>
            </nav>
            <p>&copy; 2024 KNAnime. All rights reserved. KNAnime does not retain any files on its server. Rather, it solely provides links to media content hosted by third-party services.</p>
        </footer>
    );
};

export default KNFooter;