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
    >
      <Box flex={'0 1 0'}>
        <Heading textAlign='center'>AI generated art</Heading>
        <Text textAlign='center'>
          Art generated from user-submitted text description using VQGAN+CLIP
          algorithm
        </Text>
      </Box>
      <Divider />
      {image && (
        <Box flex={'1 1 0'} maxHeight='100%' padding={6}>
          <Image
            src={image.artUrl}
            height='1000px'
            width='1000px'
            // layout='responsive'
            alt={image.artDescription ?? 'art'}
          />
          {image.artDescription && (
            <Text textAlign='center'>{image.artDescription}</Text>
          )}
        </Box>
      )}
      <Divider />
      <Box flex={'0 1 0'}>
        <Text textAlign='center'>
          Go to https://riple.art/vote to submit options for tomorrows art or
          vote for your favourite option
        </Text>
      </Box>
    </Box>
  )
}

export default Home
