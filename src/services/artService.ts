import { BlobServiceClient } from "@azure/storage-blob";
import { IArt } from "../model/Art";
import { IOption } from "../model/Option";
const { v1: uuidv1} = require('uuid');
interface ArtGeneratorResponse {
    image_id: string
    promt: string
}

const uploadToAzure = async (imageId: string, data: Buffer) => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(
        `${process.env.AZURE_STORAGE}`
      );

    const containerName = 'images'
    console.log('creating container')
    const containerClient = blobServiceClient.getContainerClient(containerName)
    // const createContainerResponse = await containerClient.create()
    console.log('Container was created successfully')

    //Upload
    const blockBlobClient = containerClient.getBlockBlobClient(`${imageId}.jpg`)
    console.log('getBlockBlobClient ok')
    const uploadBlobResponse = blockBlobClient.upload(data, data.length,{
        blobHTTPHeaders: {
            blobContentType:'image/jpeg'
        }})
    console.log('upload ok', uploadBlobResponse)

}

export const generateArt = async (option:IOption) => {
    const artUrlResponse: ArtGeneratorResponse = await fetch(`${process.env.ART_GENERATOR}`,{ 
        method: 'post', 
        body: JSON.stringify({
            prompt: option.optionText, 
            high_resolution: false, 
            algo_version:1
        }),
        headers: {'Content-Type': 'application/json'}
    }).then(res => res.json())
    console.log(artUrlResponse)
   
    let i = 1;
    let imageBuffer:Buffer|undefined
    while(i<20){
        try{
            console.log('try:',i, 'for fetching image')
            setTimeout(async () => 
                imageBuffer = await fetch(`${process.env.ART_STORAGE}/${artUrlResponse.image_id}.jpg`)
                .then(res => res.arrayBuffer())
                .then(ab => Buffer.from(ab))
            ,5000)

        }catch{
            console.log('no image')
            i = i+1
        }
    }
    if(imageBuffer){
        console.log('got image')
        await uploadToAzure(artUrlResponse.image_id, imageBuffer)
    }else{
        console.log('no image')
    }

    const art:Partial<IArt> = {
        optionId: option._id,
    }
    return art
}