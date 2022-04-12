import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import type { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../../components/fetcher'
import { IOption } from '../../model/Option'

interface AdminProps {
  authenticated: boolean
}
const Admin: NextPage<AdminProps> = (props) => {
  const [adminSecret, setAdminSecret] = useState<string | undefined>()
  const { data: options, mutate } = useSWR<IOption[]>('/api/options', fetcher)

  const deleteOption = async (optionId: string) => {
    await fetch('/api/options', {
      method: 'DELETE',
      body: JSON.stringify({ optionId: optionId }),
      headers: { 'Content-Type': 'application/json' },
    })
    mutate()
  }
  const generateArt = () => {
    console.log('generating art')
    fetch('/api/art', {
      method: 'post',
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
  }
  return (
    <Center>
      <VStack>
        <Text>Hello admin</Text>
        <Button onClick={() => generateArt()}>Generate art</Button>
        <Box>
          <Heading fontSize='md'>Options</Heading>
          {options &&
            options.map((option, id) => (
              <Box key={id}>
                <HStack>
                  <Text>
                    {option.optionText}-{option.votes}
                  </Text>
                  <Button onClick={() => deleteOption(option._id)}>
                    Delete
                  </Button>
                </HStack>
              </Box>
            ))}
        </Box>
      </VStack>
    </Center>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const adminSecret = context?.params?.adminSecret
  const secretOk = adminSecret === process.env.ADMIN_SECRET

  if (secretOk) {
    return {
      props: {
        authenticated: secretOk,
      },
    }
  }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}

export default Admin
