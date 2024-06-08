import "../../../app/globals.css";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import KNHeader from "@/pages/header";
import KNFooter from "@/pages/footer";

interface EpisodeLinks {
    title: string;
    mirrors: string[];
    hasNext: boolean;
    hasPrevious: boolean;
}

const EpisodePage = () => {
    const router = useRouter();
    const { id, ep } = router.query;
    const [episodeData, setEpisodeData] = useState<EpisodeLinks | null>(null);
    const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchVideoData = async () => {
            if (!id || !ep) return;

            try {
                // @ts-ignore
                const response = await axios.get(`/api/episode?anime=${encodeURIComponent(id)}&episode=${encodeURIComponent(ep)}`);
                console.log(response.data)
                if (response.data.mirrors && response.data.mirrors.length > 0) {
                    setEpisodeData(response.data);
                    setCurrentVideoUrl(response.data.mirrors[0]);  // Set the first video URL by default
                }
                setIsLoading(false);
            } catch (err) {
                console.error('Failed to fetch video:', err);
                setError('Failed to load video data');
                setIsLoading(false);
            }
        };

        fetchVideoData();
    }, [id, ep]);

    const handleMirrorLinkClick = (url: string) => {
        setCurrentVideoUrl(url);
    };

    const handleNextEpisode = () => {
        if (episodeData && episodeData.hasNext) {
            router.push(`/category/${id}/${parseInt(ep as string) + 1}`);
        }
    };

    const handlePreviousEpisode = () => {
        if (episodeData && episodeData.hasPrevious) {
            router.push(`/category/${id}/${parseInt(ep as string) - 1}`);
        }
    };

    const handleBackToAnimePage = () => {
        router.push(`/category/${id}`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full text-red-600" role="status">
                    <span className="visually-hidden">...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div>
            <KNHeader />
            <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleBackToAnimePage}
                    className="mb-5 top-4 left-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2"
                >
                    {/*<FontAwesomeIcon icon={faArrowLeft} />*/}
                    <span>Back to Anime Page</span>
                </button>
                <h1 className="text-3xl font-bold mb-4">{episodeData?.title}</h1>
                <h2 className="text-2xl font-semibold mb-4">Episode Number: {ep}</h2>
                <div className="relative mb-8">
                    {currentVideoUrl && (
                        <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                src={currentVideoUrl}
                                allowFullScreen
                                className="rounded-lg shadow-lg border-none"
                                style={{ overflow: 'hidden' }}
                                width={886}
                                height={550}
                            ></iframe>
                        </div>
                    )}
                </div>
                <div className="flex justify-between m-8">
                    {episodeData?.hasPrevious && (
                        <button
                            onClick={handlePreviousEpisode}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                        >
                            Previous Episode
                        </button>
                    )}
                    {episodeData?.hasNext && (
                        <button
                            onClick={handleNextEpisode}
                            className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                        >
                            Next Episode
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
                    {episodeData?.mirrors.map((url, index) => (
                        <button
                            key={index}
                            onClick={() => handleMirrorLinkClick(url)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                        >
                            Mirror Link {index + 1}
                        </button>
                    ))}
                </div>

            </div>
        </div>
            <KNFooter />
        </div>

    );
};

export default EpisodePage;
