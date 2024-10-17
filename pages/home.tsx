'use client'

import "../app/globals.css";
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay } from 'swiper/modules'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faPlay, faFilm, faTv } from '@fortawesome/free-solid-svg-icons'
import KNHeader from "@/pages/header"
import KNFooter from "@/pages/footer"
import DOMPurify from "isomorphic-dompurify";
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

const API_URI = 'https://knanime-api.vercel.app'

const Home: React.FC = () => {
  const router = useRouter()
  const [topAnime, setTopAnime] = useState<any[]>([])
  const [trendingAnime, setTrendingAnime] = useState<any[]>([])
  const [recentAnime, setRecentAnime] = useState<any[]>([])
  const [showNewest, setShowNewest] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)
      await lastWatchingAnime()
      await fetchTrendingAnime()
      await fetchTopAnime()
      setLoading(false)
    }

    fetchDetails()
  }, [])

  async function fetchTopAnime() {
    const url = `${API_URI}/meta/anilist/popular?perPage=25`
    try {
      const { data } = await axios.get(url)
      const animeResults = data['results']
      setTopAnime(animeResults)
    } catch (err) {
      console.log(err)
    }
  }

  async function fetchTrendingAnime() {
    const url = `${API_URI}/meta/anilist/trending?perPage=25`
    try {
      const { data } = await axios.get(url)
      const animeResults = data['results']
      setTrendingAnime(animeResults)
    } catch (err) {
      console.log(err)
    }
  }

  async function lastWatchingAnime() {
    const allPlaybackInfo = JSON.parse(localStorage.getItem('all_episode_times') || '{}')
    const lastWatchedAnime = []

    for (const id in allPlaybackInfo) {
      if (allPlaybackInfo.hasOwnProperty(id)) {
        const playbackInfo = allPlaybackInfo[id]
        if (id == 'undefined' || !playbackInfo['ep']) {
          continue
        }
        lastWatchedAnime.push({
          id: id,
          ...playbackInfo
        })
      }
    }
    console.log(lastWatchedAnime);
    setRecentAnime(lastWatchedAnime)
  }

  const HeroCarousel = () => (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000 }}
      loop={true}
      className="w-full h-[60vh] rounded-xl overflow-hidden"
    >
      {loading ? (
        <SwiperSlide>
          <div className="w-full h-full bg-gray-800 animate-pulse"></div>
        </SwiperSlide>
      ) : (
        trendingAnime.slice(0, 5).map((anime, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={anime.cover}
                alt={anime.title.english || anime.title.romaji}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <h2 className="text-4xl font-bold mb-2">{anime.title.english || anime.title.romaji}</h2>
                <p className="text-lg mb-4 line-clamp-2"
                   dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(anime.description)}}/>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1"/>
                    {anime.rating / 10}
                  </span>
                  <span>{anime.type}</span>
                  <span>{anime.totalEpisodes} episodes</span>
                </div>
                <div className="flex space-x-6 mt-5">
                  <button
                      className="bg-red-600 text-white px-8 py-3 rounded-md font-semibold flex items-center transition-transform transform hover:scale-105"
                      onClick={() => router.push(`/category/${anime.id}/episode?id=${anime.id}`)}
                  >
                    <FontAwesomeIcon icon={faPlay} className="mr-2"/>
                    Watch Now
                  </button>
                  <button
                      className="bg-gray-700 text-white px-8 py-3 rounded-md font-semibold transition-transform transform hover:scale-105"
                      onClick={() => router.push(`/category/${anime.id}`)}
                  >
                    More Info
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))
      )}
    </Swiper>
  )

  const ContinueWatchingCarousel = () => (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Continue Watching</h2>
        <Swiper
            slidesPerView={1}
            spaceBetween={20}
            breakpoints={{
              640: {slidesPerView: 2},
              768: {slidesPerView: 3},
              1024: {slidesPerView: 4},
            }}
            className="w-full"
        >
          {loading ? (
              Array(4).fill(0).map((_, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full aspect-video bg-gray-800 rounded-lg animate-pulse"></div>
                  </SwiperSlide>
              ))
          ) : (
              recentAnime.map((anime, index) => (
                  <SwiperSlide key={index}>
              <div className="relative group cursor-pointer h-[30vh]" onClick={() => router.push(`/category/${anime.id}/episode?id=${anime.id}&ep=${anime.ep}`)}>
                <Image
                  src={anime.image || '/placeholder.svg'}
                  alt={anime.title}
                  layout="fill"
                  className="rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FontAwesomeIcon icon={faPlay} className="text-4xl" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                  <h3 className="font-semibold truncate text-sm">{anime.title}</h3>
                  <p className="text-xs text-gray-300">Episode {anime.ep}</p>
                </div>
                <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-xs px-2 py-1 rounded">
                  {formatTime(anime.current_time)} / {formatTime(anime.duration)}
                </div>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  )

  const TrendingAnimeList = () => (
    <div className="mt-12 bg-gray-900 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Top Trending Anime</h2>
      <div className="space-y-4">
        {loading ? (
          Array(10).fill(0).map((_, index) => (
            <div key={index} className="flex items-center space-x-4 animate-pulse">
              <div className="w-20 h-28 bg-gray-800 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : (
          trendingAnime.slice(0, 10).map((anime, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 hover:bg-gray-800 p-2 rounded-lg transition-colors cursor-pointer"
              onClick={() => router.push(`/category/${anime.id}`)}
            >
              <Image
                src={anime.image}
                alt={anime.title.english || anime.title.romaji}
                width={80}
                height={120}
                className="rounded-lg"
              />
              <div>
                <h3 className="font-semibold">{anime.title.english || anime.title.romaji}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                    {anime.rating / 10}
                  </span>
                  <span>{anime.type}</span>
                  <span>{anime.totalEpisodes} episodes</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

const AnimeGrid = () => (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="pt-4 mb-3 text-2xl font-bold">{showNewest ? 'Newest Anime' : 'Top Anime'}</h2>
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded-full ${showNewest ? 'bg-red-600 text-white' : 'bg-gray-700'}`}
            onClick={() => setShowNewest(true)}
          >
            Newest
          </button>
          <button
            className={`px-4 py-2 rounded-full ${!showNewest ? 'bg-red-600 text-white' : 'bg-gray-700'}`}
            onClick={() => setShowNewest(false)}
          >
            Top
          </button>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={showNewest ? 'newest' : 'top'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        >
          {loading ? (
            Array(20).fill(0).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
              </div>
            ))
          ) : (
            (showNewest ? trendingAnime : topAnime).map((anime, index) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-pointer"
                onClick={() => router.push(`/category/${anime.id}`)}
              >
                <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                  <Image
                      src={anime.image}
                      alt={anime.title.english || anime.title.romaji}
                      layout="fill"
                      objectFit="cover"
                      className="group-hover:scale-105 transition-transform duration-300"
                  />
                  <div
                      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FontAwesomeIcon icon={faPlay} className="text-4xl"/>
                  </div>
                  <div
                      className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="font-semibold text-sm mb-2 truncate">{anime.title.english || anime.title.romaji}</h3>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400 mr-1" />
                    {anime.rating / 10}
                  </span>
                  <span>
                    <FontAwesomeIcon icon={anime.type === 'TV' ? faTv : faFilm} className="mr-1" />
                    {anime.type}
                  </span>
                  <span>{anime.totalEpisodes} ep</span>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <KNHeader />
      <main className="container mx-auto px-4 py-8">
        <HeroCarousel />
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <div className="lg:w-3/4">
            {recentAnime.length > 0 && <ContinueWatchingCarousel />}
            <AnimeGrid />
          </div>
          <div className="lg:w-1/4 mt-12 lg:mt-0">
            <TrendingAnimeList />
          </div>
        </div>
      </main>
      <KNFooter />
    </div>
  )
}

export default Home