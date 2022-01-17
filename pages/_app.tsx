import '@/styles/globals.css'
import { ReactElement } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import theme from "../theme";
import { store } from '../store';
import NavBar from '@/components/NavBar';


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Cobyo Meetup web app" />
        <link rel="icon" href="/image/favicon.ico" />
      </Head>
      <ReduxProvider store={store}>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </ReduxProvider>
    </>
  );
}


const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <div>
      {children}
      <NavBar />
    </div>
  );
}