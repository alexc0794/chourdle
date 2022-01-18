import '@/styles/globals.css'
import { Component, ReactElement } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createWrapper } from 'next-redux-wrapper';
import { ChakraProvider } from '@chakra-ui/react';
import theme from "../theme";
import { store } from '../store';
import NavBar from '@/components/NavBar';


class MyApp extends Component<AppProps> {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Cobyo Meetup web app" />
          <link rel="icon" href="/image/favicon.ico" />
        </Head>
        <ChakraProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </>
    );
  }

}


const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <div>
      {children}
      <NavBar />
    </div>
  );
}

const makeStore = () => store;
const wrapper = createWrapper(makeStore);

export default wrapper.withRedux(MyApp);