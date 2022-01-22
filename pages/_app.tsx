import '@/styles/globals.css'
import { Component } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import theme from "src/chakra/theme";
import { wrapper } from 'src/store';


class MyApp extends Component<AppProps> {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <title>Meetup</title>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Cobyo Meetup web app" />
          <link rel="icon" href="/image/favicon.ico" />
        </Head>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </>
    );
  }
}

export default wrapper.withRedux(MyApp);
