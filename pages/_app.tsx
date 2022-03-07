/* los estilos para material-tailwind deben ser los primeros */
import '@material-tailwind/react/tailwind.css'
import '../styles/globals.css'

import { Provider } from 'next-auth/client'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
        <Head>
          {/* Material Icons Link */}
          <link
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
            rel="stylesheet"
          />
        </Head>
      <Provider session={session}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default MyApp
