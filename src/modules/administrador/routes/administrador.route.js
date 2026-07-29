import express from 'express'
import AdministradorController from '../controllers/administrador.controller.js'
import AutenticacaoMiddleware from '../../../middleware/autenticacao.middleware.js'

const routerAdmin = express.Router()
// rotas publicas ou privadas? 
routerAdmin.post("/cadastrar", AdministradorController.cadastrar)
routerAdmin.post("/login", AdministradorController.login)

// rota privada
routerAdmin.get("/perfil/:email?", AutenticacaoMiddleware.autenticar, AdministradorController.perfil)

export default routerAdmin