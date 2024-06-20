import React, { useState, useRef } from 'react';

import Autoplay from 'embla-carousel-autoplay';
import { Carousel } from '@mantine/carousel';
import 'tailwindcss/tailwind.css';
import styles from './carousal.module.css';
import { Button } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import {useRouter} from "next/router";
import parse from "html-react-parser";

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

const MainCarousel:React.FC<CardCarouselProps> = ({items}) => {
  const router = useRouter();
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  const handleClick = (sublink: string) => {
      router.push('/category/' + sublink)
  }

  return (
    <Carousel withIndicators
              plugins={[autoplay.current]}
              onMouseEnter={autoplay.current.stop}
              onMouseLeave={autoplay.current.reset}
              height={400}>
        { items.map((item, index) => (
            <Carousel.Slide key={index} className={styles.slide} style={{background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${item.cover})`}}>
                {/*<img src={item.cover} alt="cover" className={styles.image} />*/}
                <div className={styles.content}>
                    <h2 className={styles.title}>{item.title.english}</h2>
                    <p className={styles.description}>{parse(item.description.slice(0, 100) + '...')}</p>
                    <div className={styles.buttons}>
                        <Button className={styles.button} onClick={() => handleClick(`${item.id}/1`)} variant="white">
                            <FontAwesomeIcon icon={faPlay} /> &nbsp; Play
                        </Button>
                        <Button className={styles.button} onClick={() => handleClick(`${item.id}/1`)} variant="white">
                            <FontAwesomeIcon icon={faInfoCircle}/> &nbsp; More Info
                        </Button>
                    </div>
                </div>
            </Carousel.Slide>
        ))
        }
    </Carousel>
  );
};

export default MainCarousel;
