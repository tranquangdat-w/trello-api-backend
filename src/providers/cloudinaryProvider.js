import { v2 as cloudinary } from 'cloudinary'
import env from '~/config/environment'

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

const uploadImage = async (imageBuffer, folder) => {
  return new Promise((resolve) => {
    cloudinary.uploader
      .upload_chunked_stream({ folder: folder }, (error, uploadResult) => {
        if (error) {
          throw new Error('Failed to upload image with message: ')
        }

        resolve(uploadResult)
      })
      .end(imageBuffer)
  })
}

export const cloudinaryProvider = {
  uploadImage
}
