import React, { useState } from 'react';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import { useSwipeable } from 'react-swipeable';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";

interface CarouselItem  {
    id: string;
    malId: number;
    title: {
        romaji: string;
        english: string;
        native: string;
        userPreferred: string;
    }
    status: string;
    image: string;
    imageHash: string;
    cover: string;
    coverHash: string;
    popularity: number;
    description: string;
    rating: number;
    genres: string[];
    color: string;
    totalEpisodes: number;
    currentEpisodeCount: number;
    type: string;
    releaseDate: number;
}

interface CardCarouselProps {
  items: CarouselItem[];
  title: string;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ items, title}) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSwipeLeft = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
    trackMouse: true,
  });

  const handleAnimeClick = (url: string) => {
        setTimeout(() => {
            setIsTransitioning(true);
            router.push('/category/'+url);
        }, 500); // Match this timeout with the CSS transition duration
    };

  return (
      <div className={`animate-in fade-in min-h-screen bg-black text-white ${isTransitioning ? 'opacity-0 transition-opacity duration-500' : 'opacity-100'}`}>
          <div {...handlers} className="relative w-full overflow-hidden">
              <h1 className="text-4xl font-bold mb-4">{title}</h1>
              <div className="flex transition-transform duration-500 ease-out gap-4"
                   style={{transform: `translateX(-${currentIndex * 100}%)`}}>
                  {items.map((item, index) => (
                      <div key={index} onClick={() => handleAnimeClick(item.id)}
                           className="flex-shrink-0 w-full md:w-1/3 lg:w-1/4 p-2 cursor-pointer overflow-hidden rounded-lg transform transition duration-500 hover:scale-105">
                          <div
                              className="relative cursor-pointer overflow-hidden rounded-lg transform transition duration-500 hover:scale-105">
                              <img
                                  src={item.image}
                                  alt={item.title.english || item.title.userPreferred}
                                  className="w-full h-full object-cover"
                              />
                              <div
                                  className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                                  <h3 className="text-xl font-bold">{item.title.english || item.title.userPreferred}</h3>
                                  <p className="text-sm">Released: {item.releaseDate}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
              <button
                  onClick={handleSwipeRight}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-black rounded-full shadow-md ${currentIndex === 0 ? 'hidden' : ''}`}
              >
                  <FontAwesomeIcon icon={faArrowLeft}/>
              </button>
              <button
                  onClick={handleSwipeLeft}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-black rounded-full shadow-md ${currentIndex === items.length - 1 ? 'hidden' : ''}`}
              >
                  <FontAwesomeIcon icon={faArrowRight}/>
              </button>
          </div>
      </div>

  );
};

export default CardCarousel;
