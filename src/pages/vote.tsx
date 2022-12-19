import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  StackDivider,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../components/fetcher'
import { useVoteRestricter } from '../components/useVoteRestricter'
import { OptionArts } from '../model/Art'
import { IOption } from '../model/Option'

const Vote: NextPage = () => {
  const [inputValue, setInputValue] = useState('')
  const { canVote: canFavourite, setLastVoteDate: setLastFavouriteDate } =
    useVoteRestricter('LastFavoriteDate')
  const { canVote, setLastVoteDate } = useVoteRestricter('LastVoteDate')
  const { data: options, mutate } = useSWR<IOption[]>('/api/options', fetcher)
  const { data: optionArts } = useSWR<OptionArts>('/api/art/today', fetcher, {
    refreshInterval: 3600000,
  })
  const disableFavourite = useMemo(() => !canFavourite(), [canFavourite])
  const disableVoting = useMemo(() => !canVote(), [canVote])
  const postOption = async () => {
    if (inputValue === '') return
    await fetch('/api/options', {
      method: 'post',
      body: JSON.stringify({ optionText: inputValue }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
    setInputValue('')
    mutate()
  }

  const vote = async (id: string) => {
    console.log('voting for', id)
    await fetch('/api/vote', {
      method: 'post',
      body: JSON.stringify({ optionId: id }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((json) => {
        setLastVoteDate()
        console.log(json)
      })
    mutate()
  }

  const favourite = async (imageId: string) => {
    await fetch('/api/favourite', {
      method: 'post',
      body: JSON.stringify({ imageId: imageId }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((json) => {
        setLastFavouriteDate()
        console.log(json)
      })
  }

  return (
    <Center>
      <Container maxW='sm'>
        <VStack spacing={4}>
          <Heading>Riple.art</Heading>

          <Divider />
          <Heading fontSize='md'>Wich is your favourite today?</Heading>
          <Text textAlign='center'>
            Check out todays arts and make up your mind
          </Text>
          <HStack>
            {optionArts?.images.map((images, idx) => (
              <Button
                key={idx}
                width='100%'
                onClick={() => favourite(images._id)}
                disabled={disableFavourite}
              >
                {idx === 0 ? 'Left' : 'Right'}
              </Button>
            ))}
          </HStack>
          <Divider />
          <Heading fontSize='md'>Tomorrows art</Heading>
          <Text textAlign='center'>What do you want to see a picture of?</Text>
          <Textarea
            borderColor='gray.400'
            resize='none'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button width='100%' onClick={() => postOption()}>
            Send
          </Button>

          <Divider />
          <Heading fontSize='md' textAlign='center'>
            Suggestions for tommorrow:
          </Heading>
          <Text textAlign='center'>
            Vote for the suggestion you want the AI to generate tommorrow. You
            get one vote every day.
          </Text>
          <VStack>
            {options &&
              options.map((option, id) => (
                <Box
                  key={id}
                  border='1px solid'
                  width='100%'
                  borderRadius={10}
                  bg={'gray.100'}
                  padding={2}
                >
                  <HStack justifyContent='space-between'>
                    <HStack>
                      <Heading fontSize='md' margin={1}>
                        {option.votes}
                      </Heading>
                      <Text>{option.optionText}</Text>
                    </HStack>
                    <IconButton
                      onClick={() => vote(option._id)}
                      disabled={disableVoting}
                      icon={<AddIcon />}
                      aria-label='vote'
                    />
                  </HStack>
                </Box>
              ))}
          </VStack>
        </VStack>
      </Container>
    </Center>
  )
}

export default Vote
