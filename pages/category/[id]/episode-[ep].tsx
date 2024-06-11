import "../../../app/globals.css";
import "./player.css"
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import KNHeader from "@/pages/header";
import KNFooter from "@/pages/footer";
import '@vidstack/react/player/styles/base.css';


interface EpisodeLinks {
    title: string;
    hasNext: boolean;
    hasPrevious: boolean;
}

const ServerStates = {
  GOGOCDN: 'gogocdn',
  STREAMSB: 'streamsb',
  VIDSTREAMING: 'vidstreaming'
};

const EpisodePage = () => {
    const API_URI = 'https://knanime-api.vercel.app/'
    const router = useRouter();
    const { id, ep } = router.query;
    const [episodeData, setEpisodeData] = useState<EpisodeLinks | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [ hlsSource, setHlsSource] = useState('')

    useEffect(() => {
        const fetchVideoData = async () => {
            if (!id || !ep) return;

            try {
                // @ts-ignore
                const response = await axios.get(`/api/episode?anime=${encodeURIComponent(id)}&episode=${encodeURIComponent(ep)}`);
                if (response.data) {
                    setEpisodeData(response.data);
                }
            } catch (err) {
                console.error('Failed to fetch video:', err);
                setError('Failed to load video data');
                setIsLoading(false);
            }
        };

        fetchVideoData();
    }, [id, ep]);

    useEffect(() => {
         // @ts-ignore
        const url = `https://knanime-api.vercel.app/anime/gogoanime/watch/${encodeURIComponent(id)}-episode-${encodeURIComponent(ep)}`;
        const fetchStreamData = async () => {
            try {
                const { data } = await axios.get(url, { params: { server: "gogocdn" } });
                const sources = data['sources'];
                const defaultSource = sources.find((source => source.quality === 'default'));
                setHlsSource(defaultSource['url']);
                setIsLoading(false);
            } catch (err) {
                console.log(err)
            }
        };
        fetchStreamData();
    }, [id, ep]);


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
                        className="mb-5 top-4 left-4 bg-black hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Back to Anime Page</span>
                    </button>
                    <h1 className="text-3xl font-bold mb-4">{episodeData?.title}</h1>
                    <h2 className="text-2xl font-semibold mb-4">Episode {ep}</h2>
                    <div className="relative mb-8">
                        <div>
                            <MediaPlayer
                                title={episodeData?.title}
                                src={hlsSource}
                                autoPlay
                                onEnded={handleNextEpisode}
                            >
                                <MediaProvider/>
                                <PlyrLayout
                                    icons={plyrLayoutIcons}
                                />
                            </MediaPlayer>
                        </div>
                    </div>
                    <div className="flex justify-between m-8">
                        {episodeData?.hasPrevious && (
                            <button
                                onClick={handlePreviousEpisode}
                                className="bg-black outline outline-offset-2 hover:outline-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out  sm:py-1 sm:px-2 sm:text-sm"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                                &nbsp;Previous Episode
                            </button>
                        )}
                        {episodeData?.hasNext && (
                            <button
                                onClick={handleNextEpisode}
                                className={`bg-black outline outline-offset-2 hover:outline-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out  sm:py-1 sm:px-2 sm:text-sm ${!episodeData?.hasPrevious ? 'ml-auto' : ''}`}
                            >
                                Next Episode&nbsp;
                                <FontAwesomeIcon icon={faArrowRight} />
                            </button>
                        )}
                    </div>

                </div>
            </div>
            <KNFooter/>
        </div>

    );
};

export default EpisodePage;
