import { StatusCodes } from 'http-status-codes'
import { Resend } from 'resend'
import env from '~/config/environment'
import ApiErros from '~/utils/ApiErrors'

const resend = new Resend(env.API_SEND_MAIL)
const domain = 'onboarding@resend.dev' || env.EMAIL_SENDER

const sendMail = async (recipientEmail, subject, mailContentHtml) => {
  const result = await resend.emails.send({
    from: domain,
    to: recipientEmail,
    subject: subject,
    html: mailContentHtml
  })

  if (result.error) throw new ApiErros(StatusCodes.UNPROCESSABLE_ENTITY, result.error.message)

  return result.data
}

export const resendProvider = {
  sendMail
}
