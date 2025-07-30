import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiErros from '~/utils/ApiErrors'
import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES } from '~/utils/constrants'

// Nếu mà sử dụng cb trong multer thì nó sẽ dừng luôn.
const upload = multer({
  fileFilter: (_res, file, cb) => {
    // Phải cho nó đi qua thì nó mới bắt lỗi được ở upadloadAvatar, khong next() o day
    if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
      cb(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, 'Invalid file type, support jpg, jpeg or png.'))
    }

    // Cho no di qua
    cb(null, true)
  },
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE
  }
})

const uploadSingleFile = upload.single('avatar')

const uploadAvatar = async (req, res, next) => {
  uploadSingleFile(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        next(new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY,
          'File too large, support less than 10 mb'))
      }
    } else if (error) {
      // Loi khac
      next(error)
    }

    // Everything is fine
    next()
  })
}

export const multerUploadFileMiddleWare = {
  uploadAvatar
}

