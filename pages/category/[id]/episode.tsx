import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Switch } from '@mantine/core';
import { faArrowLeft, faArrowRight, faClosedCaptioning, faVolumeHigh } from '@fortawesome/free-solid-svg-icons'
import {
    isHLSProvider,
    MediaPlayer, MediaPlayerInstance,
    MediaProvider,
    MediaProviderAdapter,
    MediaProviderChangeEvent,
    Track, VTTContent
} from '@vidstack/react'
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default'
import KNHeader from "@/pages/header"
import KNFooter from "@/pages/footer"

import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'
import "../../../app/globals.css";
import {Button, ListItem} from "@mantine/core";
import { DiscussionEmbed } from 'disqus-react';
import {usePathname} from "next/navigation";

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
  episodes: Episode[];
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

interface Source {
    domain: string,
    dub: boolean
}


const EpisodePage = () => {
    const API_URI = 'https://knanime-api.vercel.app'
    const router = useRouter();
    const player = useRef<MediaPlayerInstance>(null);
    let { id } = router.query;
    const pathname = usePathname();
    const [ep, setEp] = useState<number>(0);
    const [animeData, setAnimeData] = useState<AnimeDetails | null>(null);
    const [allEpisodes, setAllEpisodes] = useState<Episode[]>([]);
    const [episodeData, setEpisodeData] = useState<Episode | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [ hlsSource, setHlsSource] = useState('');
    const [ subtitles, setSubtitles] = useState<string>('');
    const [ thumbnails, setThumbnails] = useState<string>();
    const [ autoPlay, setAutoPlay] = useState<boolean>(true);
    const [ autoSkip, setAutoSkip ] = useState<boolean>(false);
    const [ autoNext, setAutoNext] = useState<boolean>(true);
    const [ skipTimes, setSkipTimes ] = useState<VTTContent>({
        cues: [
            { startTime: 0, endTime: 5, text: '...' }
        ],
    });
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [currentEpisodeRange, setCurrentEpisodeRange] = useState<number>(0)
    const [selectedSource, setSelectedSource] = useState<Source>({
      domain: 'gogoanime',
      dub: false
    });

    const toggleAutoSkip = () => {
        const newAutoSkip = !autoSkip;
        setAutoSkip(newAutoSkip);
        localStorage.setItem('autoSkip', JSON.stringify(newAutoSkip));
    }
    const toggleAutoPlay = () => {
        const newAutoPlay = !autoPlay;
        setAutoSkip(newAutoPlay);
        localStorage.setItem('autoPlay', JSON.stringify(newAutoPlay));
    }

    const toggleAutoNext = () => {
        const newAutoNext = !autoNext;
        setAutoNext(!autoNext);
         localStorage.setItem('autoNext', JSON.stringify(newAutoNext));
    }

    const getSettings = () => {
        const storedAutoSkip: string | null = localStorage.getItem('autoSkip');
        const storedAutoNext: string | null = localStorage.getItem('autoNext');

        if (storedAutoSkip !== null) {
            setAutoSkip(JSON.parse(storedAutoSkip));
        }

        if (storedAutoNext !== null) {
            setAutoNext(JSON.parse(storedAutoNext));
        }
    }

    // UseEffect to get the current watched time and settings
    useEffect(() => {
        updateEpisodesWatched();
        getCurrentTimeFromLocal();
        getSettings();
        if (player.current && currentTime) {
          player.current.currentTime = currentTime;

        }
      }, [currentTime]);

    // UseEffect to get play the video automatically and tracking
    useEffect(() => {
        if (autoPlay && player.current) {
          player.current
            .play()
            .catch((e) =>
              console.log('Playback failed to start automatically:', e),
            );
        }
      }, [autoPlay, hlsSource]);


    function onProviderChange(
        provider: MediaProviderAdapter | null,
        _nativeEvent: MediaProviderChangeEvent,
      ) {
        /**
         * Updates the configuration of the provided HLS provider.
         *
         * @param {MediaProviderAdapter | null} provider - The HLS provider to update.
         * @param {MediaProviderChangeEvent} _nativeEvent - The native event associated with the provider change.
         * @return {void} This function does not return anything.
         */
        if (isHLSProvider(provider)) {
          provider.config = {

          };
        }
      }

    function onTimeUpdate() {
        if (player.current) {
            const current_time = player.current.currentTime;
            const duration = player.current.duration || 1;
            const playbackPercentage = (current_time / duration);

            if (episodeData && animeData) {
                const image = episodeData.image;
                const title = animeData.title.english;
                const playbackInfo = {
                    current_time,
                    duration,
                    ep,
                    image,
                    title
                };
                const allPlaybackInfo = JSON.parse(
                    localStorage.getItem('all_episode_times') || '{}',
                );
                allPlaybackInfo[id as string] = playbackInfo;
                localStorage.setItem(
                    'all_episode_times',
                    JSON.stringify(allPlaybackInfo),
                );
            }

            if (autoSkip && skipTimes) {
                const skipInterval = skipTimes.cues?.find(
                  ({ startTime, endTime }) =>
                    current_time >= startTime && current_time < endTime,
                );
                if (skipInterval) {
                  player.current.currentTime = skipInterval.endTime;
                }
            }
        }
    }

    const fetchVideoData = async () => {
        if (!id || !ep) return

        try {
          setIsLoading(true)
          // const local_allEpisodes = JSON.parse(localStorage.getItem('current_episodes_data') || '{}')
          // const local_animeData = JSON.parse(localStorage.getItem('current_anime_data') || '{}')
          console.log("Episode watching", ep);
          const response = await axios.get(`/api/anime?id=${encodeURIComponent(id as string)}`)
          if (response.data) {
              const fetchedAnimeData = response.data as AnimeDetails
              setAnimeData(fetchedAnimeData)
              const episodes = await fetchEpisodes(fetchedAnimeData.id)
              if (episodes) {
                console.log(episodes)
                setAllEpisodes(episodes)
                const currentEpisode = episodes.find(e => e.number === ep)
                if (currentEpisode) {
                  setEpisodeData(currentEpisode)
                  await fetchStreamData(currentEpisode.id)
                  localStorage.setItem('current_anime_data', JSON.stringify(fetchedAnimeData))
                  localStorage.setItem('current_episodes_data', JSON.stringify(episodes))
                }
              }
            }
          setIsLoading(false)
        } catch (err) {
          console.error('Failed to fetch video:', err)
          setError('Failed to load video data')
          setIsLoading(false)
        }
    }

    async function fetchEpisodes(id: string | undefined) {
            if (id === undefined) return;
            try {
                const params = new URLSearchParams({ provider: selectedSource.domain, dub: selectedSource.dub ? 'true' : 'false' });
                const altUrl = `${API_URI}/meta/anilist/episodes/${encodeURIComponent(id)}?${params.toString()}`;
                const { data } = await axios.get(altUrl);
                const episodes = data;
                return episodes as Episode[];
            } catch (err) {
                console.log("Fetching Episode Error", err);
                return [];
            }

    }

    // Get the Anime Data
    useEffect(() => {
        if (router.isReady) {
            const initialEp = parseInt(router.query.ep as string) || 1
            console.log("Initial ep: ", initialEp)
            setEp(initialEp)
        }
    }, [router.isReady, router.query.ep])

    useEffect(() => {
        console.log("repeat");
        if(ep > 0) {
            fetchVideoData();
        }
    }, [id, ep, selectedSource])


    async function fetchStreamData (id: string) {
        if (id === undefined) return;

        const url = `${API_URI}/meta/anilist/watch/${encodeURIComponent(id)}`;
        try {
                const { data } = await axios.get(url, { params: { provider: selectedSource.domain } });
                const {sources, subtitles, intro, outro } = data;
                let defaultSource = {
                    url: ''
                };
                let defaultSubtitle = {
                    url: ''
                };
                let defaultThumbnail = {
                    url: ''
                };
                if (selectedSource.domain === 'zoro') {
                    defaultSource = sources.find(((source: { type: string; }) => source.type === 'hls'));
                    defaultSubtitle = subtitles.find(((subtitle: { lang: string; }) => subtitle.lang === 'English'));
                    defaultThumbnail = subtitles.find(((subtitle: { lang: string; }) => subtitle.lang === 'Thumbnails'));
                    let skipCues = [
                        { startTime: intro.start, endTime: intro.end, text: 'Intro' },
                        { startTime: outro.start, endTime: outro.end, text: 'Outro' },
                    ];
                    setSkipTimes({
                        cues: skipCues
                    });
                } else {
                    defaultSource = sources.find(((source: { quality: string; }) => source.quality === 'default'));
                }
                setHlsSource(`/api/proxy/${defaultSource['url']}`);
                if (defaultSubtitle) setSubtitles(defaultSubtitle['url']);
                if (defaultThumbnail) setThumbnails(defaultThumbnail['url']);

                setIsLoading(false);
            } catch (err) {
                console.log(err)
            }

    }

    // Function to get current_time for a specific id
    function getCurrentTimeFromLocal() {
        // Retrieve the all_episode_times item from localStorage
        const allPlaybackInfo = JSON.parse(localStorage.getItem('all_episode_times') || '{}');

        // Check if the id exists in the allPlaybackInfo
        if (allPlaybackInfo[id as string]) {
            // Extract the playbackInfo for the specific id
            const playbackInfo = allPlaybackInfo[id as string];
            // Return the current_time
            setCurrentTime(playbackInfo.current_time);
        }
    }

    function updateEpisodesWatched() {
        // Retrieve the all_episodes_watched item from localStorage
        const allEpisodesWatched = JSON.parse(localStorage.getItem('all_episodes_watched') || '{}');
        const animeId = id as string;
        // Check if the id exists in the allEpisodesWatched
        if (allEpisodesWatched[animeId]) {
            // If the id exists, add the episode to the list if it's not already present
            if (!allEpisodesWatched[animeId].includes(ep)) {
                allEpisodesWatched[animeId].push(ep);
            }
        } else {
            // If the id does not exist, create a new list with the episode
            allEpisodesWatched[animeId] = [ep];
        }

        // Store the updated allEpisodesWatched back to localStorage
        localStorage.setItem('all_episodes_watched', JSON.stringify(allEpisodesWatched));
    }


    const getEpisodeByNumber = (episodes: Episode[], number: number) => {
        return episodes.find(e => e.number === number);
    };

    const handleNextEpisode = () => {
        if (animeData && ep < animeData.totalEpisodes) {
          setEp(prevEp => prevEp + 1);
          const currentUrl = new URL(window.location.href);
          currentUrl.searchParams.set('ep', String(ep + 1));
          window.history.pushState({}, '', currentUrl);
        }
    }

    const handlePreviousEpisode = () => {
        if (ep > 1) {
            setEp(prevEp => prevEp - 1);
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('ep', String(ep - 1));
            window.history.pushState({}, '', currentUrl);
        }
    }

    const handleSelectEpisode = (selectedEp: number) => {
        setEp(selectedEp);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('ep', String(selectedEp));
        window.history.pushState({}, '', currentUrl);
    }

    const handleEpisodeEnded = () => {
        if (autoNext) {
            handleNextEpisode();
        }
    }

    const handleBackToAnimePage = () => {
        router.push(`/category/${id}`);
    };

    const getEpisodeRanges = () => {
        if (!animeData) return []
        const totalEpisodes = animeData.totalEpisodes
        const ranges = []
        for (let i = 0; i < totalEpisodes; i += 30) {
          ranges.push(`${i + 1}-${Math.min(i + 30, totalEpisodes)}`)
        }
        return ranges
    }

    const formatDescription = (description: string) => {
        return description
            // Line breaks
            .replace(/<br\s*\/?>/g, '\n')
            // Bold tags (<b> or <strong>)
            .replace(/<\/?b>/g, '**')
            .replace(/<\/?strong>/g, '**')
            // Italic tags (<i> or <em>)
            .replace(/<\/?i>/g, '_')
            .replace(/<\/?em>/g, '_')
            // Underline tags (<u>)
            .replace(/<\/?u>/g, '__')
            // Strikethrough tags (<s> or <del>)
            .replace(/<\/?s>/g, '~~')
            .replace(/<\/?del>/g, '~~')
            // Remove any other HTML tags (this is optional and can be omitted if needed)
            .replace(/<\/?[^>]+(>|$)/g, '');
    };

    // if (isLoading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen bg-black text-white">
    //             <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full text-red-600" role="status">
    //                 <span className="visually-hidden">...</span>
    //             </div>
    //         </div>
    //     );
    // }

   if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <p className="text-xl mb-4">Error: {error}</p>
        <button
          onClick={handleBackToAnimePage}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Go Back to Anime Info
        </button>
      </div>
    )
  }

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      <div className="h-[60vh] bg-gray-700 rounded w-full mb-4"></div>
      <div className="aspect-w-16 aspect-h-9 bg-gray-700 rounded-lg mb-6"></div>
      <div className="flex justify-between mb-8">
        <div className="h-10 bg-gray-700 rounded w-1/4"></div>
        <div className="h-10 bg-gray-700 rounded w-1/4"></div>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-24 h-16 bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const AnimeInfoSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="w-full h-64 bg-gray-700 rounded-lg mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="h-4 bg-gray-700 rounded w-full mt-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mt-2"></div>
        <div className="h-4 bg-gray-700 rounded w-3/4 mt-2"></div>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="h-6 bg-gray-700 rounded w-2/3 mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-12 h-16 bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

    // @ts-ignore
    return (
        <div className="min-h-screen bg-black text-white">
            <KNHeader/>
            <main className="container mx-auto px-4 py-2">
                {isLoading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <SkeletonLoader />
                    </div>
                    <div className="lg:col-span-1">
                      <AnimeInfoSkeleton />
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                    <p className="text-xl mb-4">Error: {error}</p>
                    <button
                      onClick={() => router.push('/')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Go Back to Home
                    </button>
                  </div>
                ) : ''}

                {animeData && (
                    <>
                        <h1 className="text-3xl font-bold mb-4">
                            {animeData.title.english} <span className="text-2xl font-semibold">Episode {ep}</span>
                        </h1>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="relative mb-8">
                                    <MediaPlayer
                                        className="player"
                                        title={animeData.title.english}
                                        src={hlsSource}
                                        autoPlay={autoPlay}
                                        ref={player}
                                        onTimeUpdate={onTimeUpdate}
                                        onProviderChange={onProviderChange}
                                        aspectRatio="16/9"
                                        onEnded={handleEpisodeEnded}
                                    >
                                        <MediaProvider/>
                                        <DefaultVideoLayout thumbnails={thumbnails} icons={defaultLayoutIcons}/>
                                        <Track src={subtitles} kind="subtitles" label="English" lang="en-US" default/>
                                        <Track content={skipTimes} kind="chapters" label="English" lang="en-US"
                                               default/>
                                    </MediaPlayer>
                                </div>

                                <div className="flex mb-8 gap-2">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-lg font-semibold">AutoNext:</span>
                                        <Switch
                                            checked={autoNext}
                                            color={"red"}
                                            onChange={(event) => setAutoNext(event.currentTarget.checked)}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-lg font-semibold">AutoSkip:</span>
                                        <Switch
                                            checked={autoSkip}
                                            color={"red"}
                                            onChange={(event) => setAutoSkip(event.currentTarget.checked)}
                                        />
                                    </div>
                                </div>
                                {/*<SourceSelection />*/}
                                <div className="flex justify-between mb-8">
                                    {ep > 1 && (
                                        <button
                                            onClick={handlePreviousEpisode}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                                        >
                                            <FontAwesomeIcon icon={faArrowLeft}/> Previous Episode
                                        </button>
                                    )}
                                    {ep < animeData.totalEpisodes && (
                                        <button
                                            onClick={handleNextEpisode}
                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                                        >
                                            Next Episode <FontAwesomeIcon icon={faArrowRight}/>
                                        </button>
                                    )}
                                </div>

                                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                                    <h2 className="text-2xl font-bold mb-4">Source Selection</h2>
                                    <p className={'text-white my-2'}>If the episode does not work then choose another
                                        source</p>
                                    <div className="flex space-x-4">
                                        <Button
                                            className={`btn ${selectedSource.domain === 'gogoanime' ? 'btn-primary' : 'btn-outline'}`}
                                            onClick={() => setSelectedSource({
                                                domain: 'gogoanime',
                                                dub: false
                                            })}
                                        >
                                            GogoAnime
                                        </Button>
                                        <Button
                                            className={`btn ${selectedSource.domain === 'zoro' ? 'btn-primary' : 'btn-outline'}`}
                                            onClick={() => setSelectedSource({
                                                domain: 'zoro',
                                                dub: false
                                            })}
                                        >
                                            Zoro
                                        </Button>
                                    </div>
                                </div>
                                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                                    <h2 className="text-2xl font-bold mb-4">Episode List</h2>
                                    {animeData.totalEpisodes > 30 && (
                                        <div className="mb-4">
                                            <select
                                                className="select select-bordered w-full max-w-xs"
                                                value={currentEpisodeRange}
                                                onChange={(e) => setCurrentEpisodeRange(parseInt(e.target.value))}
                                            >
                                                {getEpisodeRanges().map((range, index) => (
                                                    <option key={index} value={index * 30}>
                                                        Episodes {range}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <div className="space-y-4 h-[70vh] overflow-y-auto pr-4">
                                        {allEpisodes.slice(currentEpisodeRange, currentEpisodeRange + 30).map((episode) => (
                                            <div
                                                key={episode.id}
                                                onClick={() => handleSelectEpisode(episode.number)}
                                                className={`block p-4 rounded hover:cursor-pointer ${
                                                    episode.number === ep
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-gray-700 hover:bg-gray-600'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <Image
                                                        src={episode.image}
                                                        alt={`Episode ${episode.number}`}
                                                        width={100}
                                                        height={56}
                                                        className="rounded"
                                                    />
                                                    <div>
                                                        <h3 className="font-semibold">Episode {episode.number}: {episode.title}</h3>
                                                        <p className="text-sm text-gray-300 line-clamp-2">{episode.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <DiscussionEmbed
                                    shortname='knanime'
                                    config={
                                        {
                                            url: 'https://knanime.vercel.app' + pathname,
                                            identifier: id + '-' + ep,
                                            title: animeData.title.english || animeData.title.romaji || 'KNAnime',

                                        }
                                    }
                                />
                            </div>


                            <div className="lg:col-span-1">
                                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                                    <h2 className="text-2xl font-bold mb-4">Anime Info</h2>
                                    <Image
                                        src={animeData.image}
                                        alt={animeData.title.english}
                                        width={300}
                                        height={450}
                                        className="rounded-lg mb-4"
                                    />
                                    <p className="mb-2"><strong>Status:</strong> {animeData.status}</p>
                                    <p className="mb-2"><strong>Episodes:</strong> {animeData.currentEpisode}</p>
                                    <p className="mb-2"><strong>Genre:</strong> {animeData.genres.join(', ')}</p>
                                    <div className="text-sm text-gray-300 whitespace-pre-wrap">
                                        {formatDescription(animeData.description).split('**').map((text, index) =>
                                            index % 2 === 0 ? text : <strong key={index}>{text}</strong>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                                    <h2 className="text-2xl font-bold mb-4">Recommended Anime</h2>
                                    <div className="space-y-4">
                                        {animeData.recommendations.slice(0, 5).map((rec) => (
                                            <Link key={rec.id} href={`/category/${rec.id}`}
                                                  className="flex items-center space-x-4 hover:bg-gray-700 p-2 rounded">
                                                <Image
                                                    src={rec.image}
                                                    alt={rec.title.english}
                                                    width={50}
                                                    height={75}
                                                    className="rounded"
                                                />
                                                <div>
                                                    <p className="font-semibold">{rec.title.english}</p>
                                                    <p className="text-sm text-gray-400">{rec.type}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <KNFooter/>
        </div>

    );
};

export default EpisodePage;
