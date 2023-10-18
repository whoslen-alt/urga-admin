import { useState } from 'react';
import NextApp from 'next/app';
import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import { Notifications } from '@mantine/notifications';
import Auth from '../components/HOCs/Auth';
import DefaultLayout from '../components/Layouts/DefaultLayout';

export default function App(props) {
  const { Component, pageProps } = props;
  const [colorScheme, setColorScheme] = useState(props.colorScheme);

  const toggleColorScheme = (value) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    setCookie('mantine-color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <>
      <Head>
        <title>Ургамал Таримал ХХК</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/logo.png" />
      </Head>

      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider
          theme={{ colorScheme, focusRing: 'always' }}
          withGlobalStyles
          withNormalizeCSS
        >
          {' '}
          <ModalsProvider>
            <Notifications />
            {/* <Auth> */}
            <DefaultLayout>
              <Component {...pageProps} />
            </DefaultLayout>

            {/* </Auth> */}
          </ModalsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}

App.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};
