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
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import useSWR from 'swr'
import { fetcher } from '../components/fetcher'
import { IArt, OptionArts } from '../model/Art'

const Home: NextPage = () => {
  const { data: optionArts } = useSWR<OptionArts>('/api/art/today', fetcher, {
    refreshInterval: 60000,
  })
  return (
    <Box
      paddingLeft={10}
      paddingRight={10}
      paddingTop={4}
      paddingBottom={4}
      maxHeight='100vh'
      display='flex'
      flexDirection='column'
      alignItems='center'
      // alignContent='space-between'
      justifyContent='space-between'
      // backgroundColor={
      //   images?.[0]?.averageColor ? `${images?.[0]?.averageColor}e6` : 'inherit'
      // }
    >
      <Stack>
        <Heading textAlign='center'>{optionArts?.description}</Heading>
        <HStack>
          {optionArts?.images?.map((image, idx) => (
            <Stack key={idx}>
              <Box flex={'1 1 0'} padding={6}>
                <Image
                  src={image.artUrl}
                  height='900px'
                  width='900px'
                  // layout='responsive'
                  alt={image.artDescription ?? 'art'}
                />
                <Text textAlign='center'>{image.favourites}</Text>
              </Box>
            </Stack>
          ))}
        </HStack>
      </Stack>
      <Box>
        <Link href='/vote' passHref>
          <Button textAlign='center'>
            Vote for your favourite at riple.art/vote
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

export default Home
