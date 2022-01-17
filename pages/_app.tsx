import '../styles/globals.css'
import { ReactElement } from 'react';
import type { AppProps } from 'next/app'
import NavBar from '../components/NavBar';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}


const Layout = ({ children }: { children: ReactElement }) => {
  return (
    <div className="content">
      {children}
      <NavBar />
    </div>
  );
}