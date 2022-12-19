import {
  Box,
  Button,
  Center,
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
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../components/fetcher'
import { IArt, OptionArts } from '../model/Art'

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedArt, setSelectedArt] = useState<IArt | null>()
  const { data: optionArts } = useSWR<OptionArts[]>('/api/art', fetcher)
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
        <Flex direction='row' wrap='wrap' justify='center'>
          {optionArts &&
            optionArts.map((optionArt, idx) => (
              <VStack key={idx}>
                <HStack spacing={2}>
                  {optionArt.images.map((image) => (
                    <Box key={image._id} flex={'1 1 0'} padding={1}>
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
                    </Box>
                  ))}
                </HStack>
                {optionArt.description && <Text>{optionArt.description}</Text>}
              </VStack>
            ))}
        </Flex>
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
