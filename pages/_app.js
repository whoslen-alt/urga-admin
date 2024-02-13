import { useState } from 'react';
import NextApp from 'next/app';

import { getCookie, setCookie } from 'cookies-next';
import Head from 'next/head';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';
import DefaultLayout from '../components/Layouts/DefaultLayout';

export default function App({ Component, pageProps, isAuth, ...props }) {
  const [queryClient] = useState(() => new QueryClient());

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

      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={pageProps.dehydratedState}>
          <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider
              theme={{ colorScheme, focusRing: 'always' }}
              withGlobalStyles
              withNormalizeCSS
            >
              <ModalsProvider>
                <Notifications />
                <DefaultLayout isAuth={isAuth}>
                  <Component {...pageProps} />
                </DefaultLayout>
              </ModalsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </HydrationBoundary>
      </QueryClientProvider>
    </>
  );
}

App.getInitialProps = async (appContext) => {
  const appProps = await NextApp.getInitialProps(appContext);
  return {
    ...appProps,
    isAuth: appContext.ctx.req.cookies?.urga_admin_user_jwt,
    colorScheme: getCookie('mantine-color-scheme', appContext.ctx) || 'dark',
  };
};
