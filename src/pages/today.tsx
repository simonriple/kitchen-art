import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  Modal,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Image from 'next/image'
import useSWR from 'swr'
import { fetcher } from '../components/fetcher'
import { IArt } from '../model/Art'

const Home: NextPage = () => {
  const { data: image } = useSWR<IArt>('/api/art/today', fetcher, {
    refreshInterval: 3600000,
  })
  return (
    <Box
      paddingLeft={10}
      paddingRight={10}
      paddingTop={4}
      paddingBottom={4}
      height='100vh'
      display='flex'
      flexDirection='column'
      alignItems='center'
      backgroundColor={
        image?.averageColor ? `${image.averageColor}e6` : 'inherit'
      }
    >
      {image && (
        <>
          <Box flex={'0 1 0'}>
            <Heading textAlign='center'>{image.artDescription}</Heading>
          </Box>
          <Box flex={'1 1 0'} maxHeight='100%' padding={6}>
            <Image
              src={image.artUrl}
              height='900px'
              width='900px'
              // layout='responsive'
              alt={image.artDescription ?? 'art'}
            />
          </Box>
        </>
      )}
      <Divider />
      <Box flex={'0 1 0'}>
        <Text textAlign='center'>
          Go to https://riple.art/vote to decice tomorrows AI generated art
        </Text>
      </Box>
    </Box>
  )
}

export default Home
