import '../styles/globals.css'
import 'antd/dist/antd.css';
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ManagedUIContext } from '@components/ui/context';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
   // Use the layout defined at the page level, if available
   const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ManagedUIContext pageProps={pageProps}>
      {getLayout(<Component {...pageProps} />)}
    </ManagedUIContext>
  )
}

export default MyApp
