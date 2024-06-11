import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
        <Head>
            <title>KNAnime</title>
            <meta property="og:title" content="Anime for the normies and otakus" key="title" />
            {/* Favicon for general browsers */}
            <link rel="icon" href="/favicon.ico" />

            {/* Apple Touch Icon */}
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

            {/* Android Chrome Icon */}
            <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png" />
            <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png" />

            {/* Microsoft Tiles */}
            <meta name="msapplication-TileColor" content="#ffffff" />
            <meta name="msapplication-TileImage" content="/mstile-144x144.png" />

            {/* Favicon for different sizes */}
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

            {/* Manifest file */}
            <link rel="manifest" href="/site.webmanifest" />
        </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}