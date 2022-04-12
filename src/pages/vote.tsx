import {
  Box,
  Button,
  Center,
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
import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../components/fetcher'
import { IOption } from '../model/Option'
import vote from './api/vote'

const Vote: NextPage = () => {
  const [inputValue, setInputValue] = useState('')
  const { data: options, mutate } = useSWR<IOption[]>('/api/options', fetcher)
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
      .then((json) => console.log(json))
    mutate()
  }

  return (
    <Center>
      <VStack>
        <Box>
          <Heading fontSize='md'>Add an option for tommorrows art</Heading>
          <Textarea
            resize='none'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button width='100%' onClick={() => postOption()}>
            Send
          </Button>
        </Box>
        <Box>
          <Heading fontSize='md'>Options for tommorrow:</Heading>
          <VStack divider={<StackDivider />}>
            {options &&
              options.map((option, id) => (
                <Box key={id}>
                  <HStack>
                    <Text>
                      {option.optionText} - {option.votes}
                    </Text>
                    <Button onClick={() => vote(option._id)}>Vote</Button>
                  </HStack>
                </Box>
              ))}
          </VStack>
        </Box>
      </VStack>
    </Center>
  )
}

export default Vote
