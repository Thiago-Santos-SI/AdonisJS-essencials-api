'use strict'

const User = use('App/Models/User')

class UserController {
  async index ({ request}){
    const data =  await User.all();

    return data
  }

  async store ({request, response}) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

}

module.exports = UserController
