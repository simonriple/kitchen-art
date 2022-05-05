import { UserProvider } from '@auth0/nextjs-auth0'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: '#dedcd6',
        color: 'gray.600',
        // borderColor: 'gray.700',
      },
    },
  },
  components: {
    Divider: {
      baseStyle: {
        borderColor: 'gray.600',
      },
    },
  },
})
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </UserProvider>
  )
}

export default MyApp
