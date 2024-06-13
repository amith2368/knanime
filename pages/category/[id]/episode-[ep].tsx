import "../../../app/globals.css";
import "./player.css"
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import {
    isHLSProvider,
    MediaPlayer, MediaPlayerInstance,
    MediaProvider,
    MediaProviderAdapter,
    MediaProviderChangeEvent
} from '@vidstack/react';
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
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

type SkipTime = {
  interval: {
    startTime: number;
    endTime: number;
  };
  skipType: string;
};

type FetchSkipTimesResponse = {
    results: SkipTime[];
};

const EpisodePage = () => {
    const API_URI = 'https://knanime-api.vercel.app/'
    const router = useRouter();
    const player = useRef<MediaPlayerInstance>(null);
    const { id, ep } = router.query;
    const [episodeData, setEpisodeData] = useState<EpisodeLinks | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [ hlsSource, setHlsSource] = useState('')
    const [ autoPlay, setAutoPlay] = useState<boolean>(true);
    const [ autoSkip, setAutoSkip ] = useState<boolean>(false);
    const [ skipTimes, setSkipTimes ] = useState<SkipTime[]>([]);

    function onProviderChange(
        provider: MediaProviderAdapter | null,
        _nativeEvent: MediaProviderChangeEvent,
      ) {
        if (isHLSProvider(provider)) {
          provider.config = {};
        }
      }

    function onTimeUpdate() {
        if (player.current) {
            const current_time = player.current.currentTime;
            const duration = player.current.duration || 1;
            const playbackPercentage = (current_time / duration);
            if (autoSkip && skipTimes.length > 0) {
                const skipInterval = skipTimes.find(
                  ({ interval }) =>
                    current_time >= interval.startTime && current_time < interval.endTime,
                );
                if (skipInterval) {
                  player.current.currentTime = skipInterval.interval.endTime;
                }
            }
        }
    }

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
                const defaultSource = sources.find(((source: { quality: string; }) => source.quality === 'default'));
                setHlsSource(defaultSource['url']);
                setIsLoading(false);
            } catch (err) {
                console.log(err)
            }
        };
        fetchStreamData();
    }, [id, ep]);


    useEffect(() => {
    const fetchSkipTimes = async () => {
      try {
        const response = await axios.get('/api/aniskip', {
          params: {
            malId: 269,
            episodeNumber: ep,
            episodeLength: 0,
          },
        });
        const st: FetchSkipTimesResponse = response.data;
        const filteredSkipTimes = st.results.filter(
          ({ skipType }) => skipType === 'op' || skipType === 'ed',
        );
        setSkipTimes(filteredSkipTimes)

      } catch (error) {
        console.error('Error fetching skip times:', error);
      }
    };

    fetchSkipTimes();
  }, [ep]);


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
            <div className="min-h-screen bg-black text-white pl-4 pr-4">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={handleBackToAnimePage}
                        className="mb-5 top-4 left-4 bg-black hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>Back to Anime Page</span>
                    </button>
                    <h1 className="text-3xl font-bold mb-4">{episodeData?.title} <span
                        className="text-2xl font-semibold mb-4">Episode {ep}</span></h1>

                    <div className="relative mb-8">
                        <div>
                            <MediaPlayer
                                className='player'
                                title={episodeData?.title}
                                src={hlsSource}
                                autoPlay={autoPlay}
                                ref={player}
                                onTimeUpdate={onTimeUpdate}
                                onProviderChange={onProviderChange}
                                keyTarget='player'
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
