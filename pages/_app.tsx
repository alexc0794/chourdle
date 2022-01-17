import '../styles/globals.css'
import { ReactElement } from 'react';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from "../theme";
import NavBar from '../components/NavBar';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
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