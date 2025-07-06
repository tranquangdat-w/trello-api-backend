import { v2 as cloudinary } from 'cloudinary'
import env from '~/config/environment'
import streamifier from 'streamifier'

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

