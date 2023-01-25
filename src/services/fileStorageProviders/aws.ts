import AWS from 'aws-sdk'

// AWS.config.getCredentials(function (err) {
//   if (err) console.log(err.stack)
//   // credentials not loaded
//   else {
//     console.log('Connected to AWS s3 bucket')
//   }
// })

export const uploadToAWS = async (externalArtId: string, image: Buffer) => {
  const s3 = new AWS.S3({
    credentials: {
      accessKeyId: `${process.env.aws_access_key_id}`,
      secretAccessKey: `${process.env.aws_secret_access_key}`,
    },
  })

  s3.config.getCredentials((err, credentials) => console.log(err, credentials))

  return await s3
    .upload({
      Bucket: `${process.env.AWS_S3_BUCKET_NAME}`,
      Key: `${externalArtId}.jpg`,
      Body: image,
      ContentType: 'image/jpeg',
    })
    .promise()
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
}
