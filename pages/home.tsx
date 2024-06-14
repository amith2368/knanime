import React, {useEffect, useState} from 'react';
import Router from 'next/router';
import "../app/globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import KNHeader from "@/pages/header";
import KNFooter from "@/pages/footer";
import Carousel from "@/components/carousal/main-carousal";
import CardCarousel from "@/components/carousal/card-carousal";
import axios from "axios";



const Home: React.FC = () => {
    const API_URI = 'https://knanime-api.vercel.app';
    const [query, setQuery] = useState<string>('');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [topAnime, setTopAnime ] = useState<any[]>([]);
    const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
    const [recentAnime, setRecentAnime] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            await fetchTrendingAnime();
            await fetchTopAnime();

        }

        // await fetchRecentAnime();

        fetchDetails();
    }, []);

    async function fetchTopAnime() {
        const url = `${API_URI}/meta/anilist/popular?perPage=25`;
        try {
                const { data } = await axios.get(url);
                const animeResults = data['results'];
                setTopAnime(animeResults);
            } catch (err) {
                console.log(err)
            }
    }

    async function fetchTrendingAnime() {
        const url = `${API_URI}/meta/anilist/trending?perPage=25`;
        try {
                const { data } = await axios.get(url);
                const animeResults = data['results'];
                setTrendingAnime(animeResults);
            } catch (err) {
                console.log(err)
            }
    }

    const handleSearch = () => {
        setIsTransitioning(true);
        Router.push(`/results?query=${encodeURIComponent(query)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsTransitioning(true);
            handleSearch();
        }
    };


    return (

        <div
            className={`animate-in fade-in min-h-screen bg-black text-white ${isTransitioning ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'}`}>
            <SpeedInsights/>
            <KNHeader />

            <div className={`container w-11/12 mx-auto`}>
                {trendingAnime && <Carousel items={trendingAnime.slice(0, 5)}/>}
                {
                    topAnime && <CardCarousel items={topAnime} title="Top Anime"/>
                }
                {
                    trendingAnime && <CardCarousel items={trendingAnime} title="Trending Anime"/>
                }
            </div>

            <KNFooter/>
        </div>
    );
};

export default Home;
