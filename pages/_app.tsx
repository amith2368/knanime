import type { AppProps } from 'next/app'

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import '@mantine/carousel/styles.css';
import Layout from '../components/Layout';
import '@mantine/core/styles.css';
import { createTheme, MantineProvider } from '@mantine/core';
import { Analytics } from '@vercel/analytics/react';

const theme = createTheme({
  /** Put your mantine theme override here */
});

import '@/lib/fontawesome';
import Head from "next/head";
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return (<>
      <Head>
          <title>KNAnime</title>
          <meta name="viewport" content="width=device-width,initial-scale=1"/>
          <meta name="description" content="KNANime PWA App"/>
          <link rel="shortcut icon" href="/favicon.ico"/>
          <link rel="mask-icon" href="/favicon.ico" color="#FFFFFF"/>
          <meta name="theme-color" content="#ffffff"/>
          <meta name="google-adsense-account" content="ca-pub-1497909257443794"/>
          {/* Favicon for general browsers */}
          <link rel="icon" href="/favicon.ico"/>

          {/* Apple Touch Icon */}
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>

          {/* Android Chrome Icon */}
          <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png"/>
          <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png"/>

          {/* Microsoft Tiles */}
          <meta name="msapplication-TileColor" content="#ffffff"/>
          <meta name="msapplication-TileImage" content="/mstile-144x144.png"/>

          {/* Favicon for different sizes */}
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>

          {/*PWA Related*/}
          <link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
          <link
              rel="apple-touch-icon"
              sizes="152x152"
              href="/apple-touch-icon.png"
          />
          <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
          />
          <link
              rel="apple-touch-icon"
              sizes="167x167"
              href="/apple-touch-icon.png"
          />
          <link rel="manifest" href="/manifest.json"/>
          <meta name="twitter:card" content="summary"/>
          <meta name="twitter:title" content="KNAnime"/>
          <meta name="twitter:url" content="https://knanime.netlify.com"/>
          <meta name="twitter:description" content="KNAnime PWA for Anroid Support"/>
          <meta name="twitter:image" content="/logo.png"/>
          <meta name="twitter:creator" content="@velvetvine"/>
          <meta property="og:type" content="website"/>
          <meta property="og:title" content="KNAnime"/>
          <meta property="og:description" content="KNAnime PWA for Anroid Support!"/>
          <meta property="og:site_name" content="KNAnime"/>
          <meta property="og:url" content="https://knanime.netlify.com"/>
          <meta property="og:image" content="/logo.png"/>
          {/* Manifest file */}
          <link rel="manifest" href="/manifest.json"/>
      </Head>
      <MantineProvider theme={theme}>
          <Layout>
          <Component {...pageProps} />
              <Analytics/>
          </Layout>
      </MantineProvider>

  </>);
}
