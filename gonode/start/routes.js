'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('users', 'UserController.index')
Route.post('users', 'UserController.store')
Route.post('sessions', 'SessionController.store')

Route.post('passwords', 'ForgotPasswordController.store')
Route.put('passwords', 'ForgotPasswordController.update')

Route.get('/files/:id', 'FileController.show')
Route.get('/files:id', 'FileController.index')

Route.group(() => {
  Route.post('/files', 'FileController.store')

}).middleware(['auth'])

  Route.resource('projects', 'ProjectController').apiOnly()
