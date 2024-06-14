import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';


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
}

const Carousel:React.FC<CardCarouselProps> = ({items}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const handleNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + items.length) % items.length);
  };

  return (
    <div className="px-4 lg:px-6 py-10">
      <div className="relative">
        <div className="relative overflow-hidden w-full h-[20rem] md:h-[calc(100vh-106px)] bg-gray-100 rounded-2xl dark:bg-neutral-800">
          <div className="absolute top-0 bottom-0 left-0 flex transition-transform duration-700" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {items.map((slide, index) => (
              <div key={index} className="flex-shrink-0 w-full">
                <div className={`h-[30rem] md:h-[calc(100vh-106px)] flex flex-col bg-cover bg-center bg-no-repeat`} style={{ backgroundImage: `url(${slide.cover})`}}>
                  <div className="bg-black bg-opacity-60 rounded-tr-2xl p-5 mt-auto w-2/3 md:max-w-lg ps-5 pb-5 md:ps-10 md:pb-10">
                    <span className="block text-white">{slide.genres[0]}</span>
                    <span className="block text-white font-bold text-xl md:text-3xl">{slide.title.english}</span>
                    <div className="mt-5">
                      <a className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl bg-white border border-transparent text-black hover:bg-gray-100" href={`/category/${slide.id}`}>
                        Watch Anime
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handlePrev} type="button" className="absolute inset-y-0 left-0 inline-flex justify-center items-center w-12 h-full text-black hover:bg-white/20 rounded-s-2xl focus:outline-none focus:bg-white/20">
          <span className="text-2xl" aria-hidden="true">
            <svg className="flex-shrink-0 size-3.5 md:size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"></path>
            </svg>
          </span>
          <span className="sr-only">Previous</span>
        </button>

        <button onClick={handleNext} type="button" className="absolute inset-y-0 right-0 inline-flex justify-center items-center w-12 h-full text-black hover:bg-white/20 rounded-e-2xl focus:outline-none focus:bg-white/20">
          <span className="sr-only">Next</span>
          <span className="text-2xl" aria-hidden="true">
            <svg className="flex-shrink-0 size-3.5 md:size-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
