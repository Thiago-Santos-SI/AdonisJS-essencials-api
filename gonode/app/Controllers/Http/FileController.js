'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const File = use('App/Models/File')
const Helpers = use('Helpers')
const Database = use('Database')

/**
 * Resourceful controller for interacting with files
 */
class FileController {

  async index ({ params, response }) {
    const users = await Database.from('files').where({ id: params.id }).file

    return await response.download(Helpers.tmpPath(`uploads/${file.file}`))

  }

  async show ({ params, response }) {
    const file = await File.findByOrFail('id', params.id)

    return await response.download(Helpers.tmpPath(`uploads/${file.file}`))
  }


  async store ({ request, response }) {
    try {
      if (!request.file('file')) return


      const upload = request.file('file', { size: '2mb' })

      const fileName = `${Date.now()}.${upload.subtype}`

      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName
      })

      if (!upload.moved()){
        throw upload.error()
      }

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype
      })

      return file
    } catch (e) {
      return response.status(e.status).send({ error: { message: 'Erro no upload de arquivo'}})
    }
  }
}

module.exports = FileController
