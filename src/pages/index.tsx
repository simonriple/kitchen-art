import {
  Box,
  Button,
  Center,
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
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../components/fetcher'
import { IArt } from '../model/Art'

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedArt, setSelectedArt] = useState<IArt | null>()
  const { data: images } = useSWR<IArt[]>('/api/art', fetcher)
  return (
    <Center>
      <Box paddingLeft={10} paddingRight={10}>
        <Box padding={4}>
          <Center>
            <VStack>
              <Heading textAlign='center'>AI generated art</Heading>
              <Text textAlign='center'>
                Art generated from user-submitted text description using DALL-E
                2 algorithm
              </Text>
              <Link href={'/vote'} passHref>
                <Button>Vote for tomorrows art</Button>
              </Link>
            </VStack>
          </Center>
        </Box>
        <SimpleGrid columns={[1, 2, 4]} spacing={10}>
          {images &&
            images.map((image) => (
              <VStack key={image._id}>
                <Image
                  src={image.artUrl}
                  height='516px'
                  width='516px'
                  alt={image.artDescription ?? 'art'}
                  onClick={() => {
                    setSelectedArt(image)
                    onOpen()
                  }}
                />
                {image.artDescription && <Text>{image.artDescription}</Text>}
              </VStack>
            ))}
        </SimpleGrid>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            setSelectedArt(undefined)
            onClose()
          }}
          isCentered
        >
          <ModalOverlay />
          <ModalContent
            onClick={() => {
              setSelectedArt(undefined)
              onClose()
            }}
          >
            {selectedArt && selectedArt.artUrl && (
              <Image
                src={selectedArt?.artUrl}
                height='516px'
                width='516px'
                alt={selectedArt?.artDescription ?? 'art'}
              />
            )}
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  )
}

export default Home
