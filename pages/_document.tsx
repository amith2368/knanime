import { Html, Head, Main, NextScript } from 'next/document'
import PrelineScript from "@/components/PrelineScript";
import { ColorSchemeScript } from '@mantine/core';

export default function Document() {
  return (
    <Html>
        <Head>
            <ColorSchemeScript defaultColorScheme="auto" />
        </Head>
      <body>
        <Main />

        <NextScript />
        <PrelineScript />
      </body>
    </Html>
  )
}