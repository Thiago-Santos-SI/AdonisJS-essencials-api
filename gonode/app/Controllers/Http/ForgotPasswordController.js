'use strict'

const crypto = require('crypto')
const moment = require('moment')
const User = use('App/Models/User')
const Mail = use('Mail')

class ForgotPasswordController {
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()

      await user.save()

      await Mail.send(
        ['emails.forgot_password'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}`},
        postMessage => {
          postMessage
            .to(user.email)
            .from('thiago@gmail.com', 'Thiago | santos')
            .subject('Recuperação de senha')
        }
      )

    }catch (e){
      return response.status(e.status)
        .send({error: {message: 'Algo não deu certo, esse e-mail existe?'}})
    }

  }
  async update ({ request, response }) {
    try {
      const { token, password } = request.all()

      const user = await User.findByOrFail('token', token)

      const tokenExpired = moment()
        .subtract('2','days')
        .isAfter(user.token_created_at)

      if (tokenExpired){
        return response
          .status(401)
          .send({error:{message: "solicitação expirada"}})
      }

      user.token = null
      user.token_created_at = null
      user.password = password

      await user.save()

    }catch (e) {
      return response.status(e.status)
        .send({error: {message: 'Algo não deu errado ao resetar sua senha'}})
    }
  }
}

module.exports = ForgotPasswordController
