import { GenerateArtRequest, GetGeneratedArtRequest } from './IArtProvider'

interface Request {
  prompt: {
    batch_size: number
    caption: string
  }
  task_type: string
}

type TaskStatus = 'pending' | 'succeeded'

interface Generation {
  id: string
  task_id: string
  generation: {
    image_path: string
  }
}

interface Task {
  created: number
  id: string
  status: TaskStatus
  generations?: {
    data?: Generation[]
  }
}

export const generateArtRequestDalle2: GenerateArtRequest = async (
  optionText: string
) =>
  await fetch(`${process.env.DALLE2_ART_GENERATOR}`, {
    method: 'POST',
    body: JSON.stringify({
      prompt: {
        batch_size: 4,
        caption: optionText,
      },
      task_type: 'text2im',
    } as Request),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DALLE2_BEARER}`,
    },
  })
    .then((res) => res.json())
    .then((task: Task) => ({ externalArtId: task.id }))

export const getGeneratedArtDalle2: GetGeneratedArtRequest = async (
  externalArtId: string
) => {
  const task: Task = await fetch(
    `${process.env.DALLE2_ART_GENERATOR}/${externalArtId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DALLE2_BEARER}`,
      },
    }
  ).then((res) => res.json())
  console.log('Got task from Dalle2', task)
  if (
    task.status === 'succeeded' &&
    task.generations?.data?.[0].generation.image_path
  ) {
    console.log('Task is succeeded and has generation')
    return await fetch(task.generations?.data?.[0].generation.image_path)
      .then((res) => res.arrayBuffer())
      .then((ab) => Buffer.from(ab))
  } else {
    throw new Error('Task not finished')
  }
}
