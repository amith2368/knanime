import "../../../app/globals.css";
import "./player.css"
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/plyr/theme.css';
import {
    isHLSProvider,
    MediaPlayer,
    MediaPlayerInstance,
    MediaProvider,
    MediaProviderAdapter,
    MediaProviderChangeEvent
} from '@vidstack/react';
import {PlyrLayout, plyrLayoutIcons} from '@vidstack/react/player/layouts/plyr';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {useRouter} from 'next/router';
import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import KNHeader from "@/pages/header";
import KNFooter from "@/pages/footer";
import Episode from "@/pages/api/episode";


interface AnimeDetails {
  id: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  malId: number;
  synonyms: string[];
  isLicensed: boolean;
  isAdult: boolean;
  countryOfOrigin: string;
  trailer: {
    id: string;
    site: string;
    thumbnail: string;
    thumbnailHash: string;
  };
  image: string;
  imageHash: string;
  popularity: number;
  color: string;
  cover: string;
  coverHash: string;
  description: string;
  status: string;
  releaseDate: number;
  startDate: {
    year: number;
    month: number;
    day: number;
  };
  endDate: {
    year: number;
    month: number;
    day: number;
  };
  totalEpisodes: number;
  currentEpisode: number;
  rating: number;
  duration: number;
  genres: string[];
  season: string;
  studios: string[];
  subOrDub: string;
  type: string;
  recommendations: Recommendation[];
  characters: Character[];
  relations: Relation[];
  mappings: Mapping[];
  artwork: Artwork[];
  episodes: any;
}

interface Recommendation {
  id: number;
  malId: number;
  title: {
    romaji: string;
    english: string;
    native: string;
    userPreferred: string;
  };
  status: string;
  episodes: number;
  image: string;
  imageHash: string;
  cover: string;
  coverHash: string;
  rating: number;
  type: string;
}

interface Character {
  id: number;
  role: string;
  name: {
    first: string;
    last?: string;
    full: string;
    native: string;
    userPreferred: string;
  };
  image: string;
  imageHash: string;
  voiceActors: VoiceActor[];
}

interface VoiceActor {
  id: number;
  language: string;
  name: {
    first: string;
    last?: string;
    full: string;
    native?: string;
    userPreferred: string;
  };
  image: string;
  imageHash: string;
}

interface Relation {
  id: number;
  relationType: string;
  malId: number;
  title: {
    romaji: string;
    english?: string;
    native: string;
    userPreferred: string;
  };
  status: string;
  episodes?: number;
  image: string;
  imageHash: string;
  color: string;
  type: string;
  cover: string;
  coverHash: string;
  rating: number;
}

interface Mapping {
  id: string;
  providerId: string;
  similarity: number;
  providerType: string;
}

interface Artwork {
  img: string;
  type: string;
  providerId: string;
}

interface Episode {
    id: string,
    title: string,
    image: string,
    imageHash: string,
    number: number,
    createdAt: string,
    description: string | null;
    url: string;
}


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
    const API_URI = 'https://knanime-api.vercel.app'
    const router = useRouter();
    const player = useRef<MediaPlayerInstance>(null);
    const { id, ep } = router.query;
    const [animeData, setAnimeData] = useState<AnimeDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [ hlsSource, setHlsSource] = useState('')
    const [ autoPlay, setAutoPlay] = useState<boolean>(true);
    const [ autoSkip, setAutoSkip ] = useState<boolean>(false);
    const [ autoNext, setAutoNext] = useState<boolean>(true);
    const [ skipTimes, setSkipTimes ] = useState<SkipTime[]>([]);

    const toggleAutoSkip = () => setAutoSkip(!autoSkip);
    const toggleAutoPlay = () => setAutoSkip(!autoPlay);

    const toggleAutoNext = () => setAutoNext(!autoNext);

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
                const response = await axios.get(`/api/anime?id=${encodeURIComponent(id)}`);
                if (response.data) {
                    const fetchedAnimeData = response.data as AnimeDetails;
                    setAnimeData(fetchedAnimeData);
                    // console.log(fetchedAnimeData);
                    // const provider = fetchedAnimeData.episodes.find((episode) => episode.number === parseInt(ep as string));
                    const episodes = await fetchEpisodes(fetchedAnimeData.id);
                    const currentEpisode = episodes?.find(e => e.number === parseInt(ep as string));
                    // @ts-ignore
                    await fetchStreamData(currentEpisode.id);
                }
            } catch (err) {
                console.error('Failed to fetch video:', err);
                setError('Failed to load video data');
                setIsLoading(false);
            }
        };

        fetchVideoData();
    }, [id, ep]);

    async function fetchEpisodes (id: string | undefined,
                                  dub: boolean = false,
                                  provider: string = 'gogoanime'
    ) {
        if (id === undefined) return;

        const params = new URLSearchParams({ provider, dub: dub ? 'true' : 'false' });
        const url = `${API_URI}/meta/anilist/episodes/${encodeURIComponent(id)}?${params.toString()}`;

        const { data } = await axios.get(url);
        return data as Episode[];
    }

    async function fetchStreamData (id: string) {
        if (id === undefined) return;

        const url = `${API_URI}/anime/gogoanime/watch/${encodeURIComponent(id)}`;
        try {
                const { data } = await axios.get(url, { params: { server: "gogocdn" } });
                const sources = data['sources'];
                const defaultSource = sources.find(((source: { quality: string; }) => source.quality === 'default'));
                setHlsSource(defaultSource['url']);
                setIsLoading(false);
            } catch (err) {
                console.log(err)
            }

    }

    // useEffect(() => {
    //      // @ts-ignore
    //     const url = `https://knanime-api.vercel.app/anime/gogoanime/watch/${encodeURIComponent(id)}-episode-${encodeURIComponent(ep)}`;
    //     const fetchStreamData = async () => {
    //         try {
    //             const { data } = await axios.get(url, { params: { server: "gogocdn" } });
    //             const sources = data['sources'];
    //             const defaultSource = sources.find(((source: { quality: string; }) => source.quality === 'default'));
    //             setHlsSource(defaultSource['url']);
    //             setIsLoading(false);
    //         } catch (err) {
    //             console.log(err)
    //         }
    //     };
    //     fetchStreamData();
    // }, [id, ep]);


    useEffect(() => {
    const fetchSkipTimes = async () => {
      try {
        console.log(animeData?.malId)
        const response = await axios.get('/api/aniskip', {
          params: {
            malId: animeData?.malId,
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
  }, [ep, animeData]);


    const handleNextEpisode = () => {
        if (animeData && animeData.totalEpisodes > (parseInt(ep as string) + 1)) {
            router.push(`/category/${id}/${parseInt(ep as string) + 1}`);
        }
    };


    const handlePreviousEpisode = () => {
        if (animeData && (parseInt(ep as string) - 1) >= 1) {
            router.push(`/category/${id}/${parseInt(ep as string) - 1}`);
        }
    };

    const handleEpisodeEnded = () => {
        if (autoNext) {
            handleNextEpisode();
        }
    }

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

    // @ts-ignore
    return (
        <div>
            <KNHeader />
            {animeData &&
                <div className="min-h-screen bg-black text-white pl-4 pr-4">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={handleBackToAnimePage}
                            className="mb-5 top-4 left-4 bg-black hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center space-x-2"
                        >
                            <FontAwesomeIcon icon={faArrowLeft}/>
                            <span>Back to Anime Page</span>
                        </button>
                        <h1 className="text-3xl font-bold mb-4">{animeData?.title.english} <span
                            className="text-2xl font-semibold mb-4">Episode {ep}</span></h1>

                        <div className="relative mb-8">
                            <div>
                                <MediaPlayer
                                    className='player'
                                    title={animeData?.title.english}
                                    src={hlsSource}
                                    autoPlay={autoPlay}
                                    ref={player}
                                    onTimeUpdate={onTimeUpdate}
                                    onProviderChange={onProviderChange}
                                    keyTarget='player'
                                    onEnded={handleEpisodeEnded}
                                >
                                    <MediaProvider/>
                                    <PlyrLayout
                                        icons={plyrLayoutIcons}
                                    />
                                </MediaPlayer>
                            </div>
                        </div>

                        {/*PLAYBACK OPTIONS */}
                        <div className="grid sm:grid-cols-2 gap-2">
                            <label htmlFor="hs-checkbox-in-form"
                                   className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-red-600 focus:ring-red-600 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
                                <input type="checkbox"
                                       className="shrink-0 mt-0.5 border-gray-200 rounded text-red-600 focus:ring-red-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-red-600 dark:checked:border-red-600 dark:focus:ring-offset-gray-800"
                                       id="hs-checkbox-in-form"
                                       checked={autoNext}
                                       onChange={toggleAutoNext}
                                />
                                <span className="text-sm text-gray-500 ms-3 dark:text-neutral-400">AutoNext</span>
                            </label>

                            <label htmlFor="hs-checkbox-checked-in-form"
                                   className="flex p-3 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-red-600 focus:ring-red-600 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400">
                                <input type="checkbox"
                                       className="shrink-0 mt-0.5 border-gray-200 rounded text-red-600 focus:ring-red-600 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-red-600 dark:checked:border-red-600 dark:focus:ring-offset-gray-800"
                                       checked={autoSkip}
                                       onChange={toggleAutoSkip}
                                       id="hs-checkbox-checked-in-form"/>
                                <span className="text-sm text-gray-500 ms-3 dark:text-neutral-400">AutoSkip</span>
                            </label>
                        </div>

                        {/*NEXT/PREV Options*/}

                        <div className="flex justify-between m-8">
                            {animeData.totalEpisodes > (parseInt(ep as string) + 1) && (
                                <button
                                    onClick={handlePreviousEpisode}
                                    className="bg-black outline outline-offset-2 hover:outline-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out  sm:py-1 sm:px-2 sm:text-sm"
                                >
                                    <FontAwesomeIcon icon={faArrowLeft}/>
                                    &nbsp;Previous Episode
                                </button>
                            )}
                            {(parseInt(ep as string) - 1) >= 1 && (
                                <button
                                    onClick={handleNextEpisode}
                                    className={`bg-black outline outline-offset-2 hover:outline-red-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out  sm:py-1 sm:px-2 sm:text-sm ${!((parseInt(ep as string) - 1) >= 1) ? 'ml-auto' : ''}`}
                                >
                                    Next Episode&nbsp;
                                    <FontAwesomeIcon icon={faArrowRight}/>
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            }
            <KNFooter/>
        </div>

    );
};

export default EpisodePage;
