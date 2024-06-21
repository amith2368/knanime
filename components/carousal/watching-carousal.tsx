import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Paper, Text, Title, Button, useMantineTheme, rem } from '@mantine/core';
import classes from './card-carousal.module.css';
import {useRouter} from "next/router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface CarouselItem  {
    id: string;
    current_time: string;
    ep: string;
    image: string;
    title: string;
}

interface CardCarouselProps {
  items: CarouselItem[];
  title: string;
}




function Card({ id, image, title, ep }: CarouselItem) {
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
      className={classes.watchcard}
    >
      <div>
        <Title order={3} className={classes.title}>
          {title}
        </Title>
        <Text className={classes.episode} size="xs">
          Episode {ep}
        </Text>
      </div>
      <Button className={classes.button} onClick={() => handleAnimeClick(`${id}/${ep}`)} color="dark">
        <FontAwesomeIcon icon={faPlay} /> &nbsp; Watch Episode
      </Button>
    </Paper>
  );
}


const WatchCarousel: React.FC<CardCarouselProps> = ({ items, title}) => {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const slides = items.map((item) => (
    <Carousel.Slide key={item.id}>
      <Card {...item} />
    </Carousel.Slide>
  ));

  return (
    <>
        <Title order={1} className="mt-10 mb-5">
            {title}
        </Title>
        <Carousel
          slideSize={{ base: '100%', sm: '30%', md: '40%' }}
          slideGap={{ base: rem(3), sm: 'xl' }}
          align="start"
          slidesToScroll={mobile ? 1 : 2}
        >
          {slides}
        </Carousel>
    </>

  );
}

export default WatchCarousel;
