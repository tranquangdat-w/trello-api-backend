/* eslint-disable no-console */
import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiErros from '~/utils/ApiErrors'

const LIMIT_COMMON_FILE_SIZE = 10485760 // 10 mb

const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']

// Nếu mà sử dụng cb trong multer thì nó sẽ dừng luôn.
const upload = multer({
  fileFilter: (re, file, cb) => {
    // Phải cho nó đi qua thì nó mới bắt lỗi được ở upadloadAvatar
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
      cb(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid file type, support jpg, jpeg or png.'))
    }

    cb(null, true)
  },
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE
  }
}).single('avatar')

const uploadAvatar = async (req, res, next) => {
  upload(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY,
          'File too large, support less than 10 mb'))
      }
    } else if (error) {
      next(error)
    }

    // Everything is fine
    next()
  })
}

export const multerUploadFileMiddleWare = {
  uploadAvatar
}
