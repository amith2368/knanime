import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { Button, Container, Text, Title } from '@mantine/core';

export default function HeroSection() {
  return (
    <div className="relative h-[100vh] overflow-hidden -mt-[80px]">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 h-[100vh]">
        <MediaPlayer autoPlay={true} src="youtube/FaHY74-6UYs">
          <MediaProvider/>
          <DefaultVideoLayout icons={defaultLayoutIcons}/>
        </MediaPlayer>
        {/* Overlay for darkening video */}
        <div className="absolute z-50 inset-0 bg-gradient-to-b from-transparent to-black"></div>
      </div>

      {/* Content on top of video */}
      <Container className="relative z-10 flex flex-col items-start justify-center h-[100vh] text-white">
        <Title className="text-4xl font-bold">Chainsaw Man</Title>
        <Text className="mt-2 text-lg">
          Denji has a simple dream — to live a happy and peaceful life, spending time with a girl.
        </Text>
        <div className="mt-4 space-x-4">
          <Button variant="white" className="text-black">
            Learn More
          </Button>
          <Button variant="outline" className="text-white border-white">
            To Watch
          </Button>
        </div>
      </Container>
    </div>
  );
}
