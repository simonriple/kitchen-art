import { BlobServiceClient } from '@azure/storage-blob'

export const uploadToAzure = async (imageId: string, data: Buffer) => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    `${process.env.AZURE_STORAGE}`
  )

  console.log('connecting to container:', process.env.AZURE_STORAGE_CONTAINER)
  const containerClient = blobServiceClient.getContainerClient(
    `${process.env.AZURE_STORAGE_CONTAINER}`
  )
  // const createContainerResponse = await containerClient.create()
  console.log('Container was connected successfully')

  //Upload
  const blockBlobClient = containerClient.getBlockBlobClient(`${imageId}.jpg`)
  console.log('getBlockBlobClient ok')
  const uploadBlobResponse = await blockBlobClient.upload(data, data.length, {
    blobHTTPHeaders: {
      blobContentType: 'image/jpeg',
    },
  })
  console.log('upload ok', uploadBlobResponse)
}
