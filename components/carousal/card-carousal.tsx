import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import {Paper, Text, Title, Button, useMantineTheme, rem, Transition} from '@mantine/core';
import classes from './card-carousal.module.css';
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState} from "react";


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
interface CardProps {
  image: string;
  title: string;
  category: string;
}



function Card({ id, image, title, type }: CarouselItem) {
  const router = useRouter();
  const handleAnimeClick = (url: string) => {
      router.push('/category/'+url);
    };

  return (

    <Paper
      shadow="md"
      p="xl"
      radius="md"
      style={{ background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${image})` }}
      className={classes.card}
    >
      <div>
        <Text className={classes.category} size="xs">
          {type}
        </Text>
        <Title order={3} className={classes.title}>
          {title.english}
        </Title>
      </div>
      <Button className={classes.button} onClick={() => handleAnimeClick(id)} color="dark">
         <FontAwesomeIcon icon={faPlay} /> &nbsp; Watch
      </Button>
    </Paper>
  );
}


const CardCarousel: React.FC<CardCarouselProps> = ({ items, title}) => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const count = Array(10).fill(0);

  const slides = items.map((item) => (
    <Carousel.Slide key={item.id}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  const slideSkeleton = count.map((_, index) =>(
    <Carousel.Slide key={index}>
      <div className = "skeleton h-64 w-60 rounded" />
    </Carousel.Slide>
  ))

  return (
    <>
        <Title order={1} className="mt-10 mb-5">
            {title}
        </Title>

        <Carousel
          slideSize={{ base: '100%', sm: '30%', md: '20%' }}
          slideGap={{ base: rem(3), sm: 'xl' }}
          align="start"
          slidesToScroll={mobile ? 1 : 2}
        >
            {items.length > 0 ? slides : slideSkeleton}
        </Carousel>
    </>
  );
}

export default CardCarousel;
