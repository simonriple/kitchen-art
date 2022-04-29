import {
  Box,
  Button,
  Center,
  Divider,
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
    <Center>
      <Box paddingLeft={10} paddingRight={10}>
        <Box padding={4}>
          <Center>
            <VStack spacing={6}>
              <Box width='100%'>
                <Heading textAlign='center'>AI generated art</Heading>
                <Text textAlign='center'>
                  Art generated from user-submitted text description using
                  VQGAN+CLIP algorithm
                </Text>
              </Box>
              <Divider />
              {image && (
                <Box>
                  <Image
                    src={image.artUrl}
                    height='1000px'
                    width='1000px'
                    alt={image.artDescription ?? 'art'}
                  />
                  {image.artDescription && (
                    <Text textAlign='center'>{image.artDescription}</Text>
                  )}
                </Box>
              )}
              <Divider />
              <Box width='100%'>
                <Text textAlign='center'>
                  Go to https://riple.art/vote to submit options for tomorrows
                  art or vote for your favourite option
                </Text>
              </Box>
            </VStack>
          </Center>
        </Box>
      </Box>
    </Center>
  )
}

export default Home
