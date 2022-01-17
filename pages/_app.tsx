import '../styles/globals.css'
import { ReactElement } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from "../theme";
import { store } from '../store';
import NavBar from '../components/NavBar';


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider theme={theme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </ReduxProvider>
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