import { Center, Text, VStack } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import useSWR from 'swr'
import { fetcher } from '../components/fetcher'
import { IArt } from '../model/Art'

const Home: NextPage = () => {
  const { data: images } = useSWR<IArt[]>('/api/art', fetcher)
  return (
    <Center>
      {images &&
        images.map((image) => (
          <VStack key={image._id}>
            <Image
              src={image.artUrl}
              height='516px'
              width='516px'
              alt={image.artDescription ?? 'art'}
            />
            {image.artDescription && <Text>{image.artDescription}</Text>}
          </VStack>
        ))}
    </Center>
  )
}

export default Home
