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
import { IOption } from '../model/Option'

const Vote: NextPage = () => {
  const [inputValue, setInputValue] = useState('')
  const { canVote, setLastVoteDate } = useVoteRestricter()
  const { data: options, mutate } = useSWR<IOption[]>('/api/options', fetcher)

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

  return (
    <Center>
      <Container maxW='sm'>
        <VStack spacing={4}>
          <Heading>Riple.art</Heading>
          <Text textAlign='center'>
            riple.art generates a piece of art every day from user-submitted
            text using DALL-E 2 algorithm. Add your suggestion or vote for the
            suggestion you want the AI to generate. You have one vote every day
          </Text>

          <Heading fontSize='md'>Add a suggestion for tommorrows art</Heading>
          <Textarea
            borderColor='gray.400'
            resize='none'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button width='100%' onClick={() => postOption()}>
            Send
          </Button>

          <Box>
            <Heading fontSize='md' textAlign='center'>
              Suggestions for tommorrow:
            </Heading>
            <VStack divider={<Divider />}>
              {options &&
                options.map((option, id) => (
                  <Box key={id}>
                    <HStack>
                      <Text>
                        {option.optionText} - {option.votes}
                      </Text>
                      <Button
                        onClick={() => vote(option._id)}
                        disabled={disableVoting}
                      >
                        Vote
                      </Button>
                    </HStack>
                  </Box>
                ))}
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Center>
  )
}

export default Vote
