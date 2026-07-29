import express from "express";
import AdministradorController from "../controllers/administrador.controller.js";
import AutenticacaoMiddleware from "../../../middleware/autenticacao.middleware.js";

const routerAdmin = express.Router();

/**
 * Rotas publicas
 *
 * O cadastro inicial e o login precisam funcionar sem token.
 * No cadastro, o controller impede a criacao de mais de um administrador.
 */
routerAdmin.post("/cadastrar", AdministradorController.cadastrar);
routerAdmin.post("/login", AdministradorController.login);

/**
 * Rota privada
 *
 * A execucao acontece da esquerda para a direita:
 * 1. o middleware valida o JWT;
 * 2. se estiver valido, chama proximo();
 * 3. o controller devolve o perfil do administrador autenticado.
 */
routerAdmin.get(
    "/perfil",
    AutenticacaoMiddleware.autenticar,
    AdministradorController.perfil
);

export default routerAdmin;
