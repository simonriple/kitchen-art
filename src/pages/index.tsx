import { Center } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import useSWR from 'swr'
import { fetcher } from '../components/fetcher'
import { IArt } from '../model/Art'

const Home: NextPage = () => {
  // const {data: images} = useSWR<IArt[]>('/api/art', fetcher)
  return <Image src='https://kitchenartstorage.blob.core.windows.net/blob-container/a870b9c01c214c21a3712d458b2a59b0.jpg' height='516px' width='516px'/>
  // (
    // <Center>{images && images.map(image => (<Image key={image._id} src={image.artUrl} height='516px' width='516px' />))}</Center>
  // )
}

export default Home
