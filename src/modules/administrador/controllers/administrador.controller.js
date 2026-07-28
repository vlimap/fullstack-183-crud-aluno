import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdministradorModel from "../models/administrador.model.js";

class AdministradorController{
    static async cadastrar(requisicao, resposta){
        try {
            const { nome, email, senha } = requisicao.body
            if( !nome || !email ||  !senha){
                return resposta.status(400).json({mensagem: "Todos os campos são obrigatorios!"})
            }
            
            const totalAdmin = await AdministradorModel.contarAdmins()
            if(totalAdmin > 0){
                return resposta.status(409).json({mensagem: "Administrador já cadastrado!"})
            }
            if(senha.length < 8){
                return resposta.status(403).json({mensagem: "A senha deve ter no minimo 8 caracteres!"})
            }
            const regexSenha = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,32}$/
            if(!regexSenha.test(senha)){
                return resposta.status(403).json({mensagem: "Senha invalida! Sua senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número, 1 caractere especial (ex: @, #, $, %)"})
            }
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
            if(!regexEmail.test(email)){
                return resposta.status(403).json({mensagem: "E-mail invalido. Por favor, forneça um e-mail valido!"})
            }
            const salt = bcrypt.genSaltSync(10);
            const hashSenha = bcrypt.hashSync(senha, salt);
            //sdfdgndjgkjsdbgjsgbsdghdsjs
            await AdministradorModel.cadastrar(nome, email, hashSenha)
            return resposta.status(201).json({mensagem: "Usuario administrador criado com sucesso!"})
        } catch (error) {
            resposta.status(500).json({mensagem: "Erro ao cadastrar administrador!", erro: error.message})
        }
    }
    static async login(requisicao, resposta){
        try {
            const { email, senha } = requisicao.body
            if(!email || !senha){
                return resposta.status(403).json({mensagem: "Forneça o e-mail e senha para login!"})
            }
            const administrador = await AdministradorModel.buscarPorEmail(email)
            if(administrador.length === 0){
                return resposta.status(400).json({mensagem:"Usuario não encontrado!"})
            }
            if(administrador.ativo === false){
                return resposta.status(403).json({mensagem: "Administrador inativo!"})
            }
            const verificarSenha = bcrypt.compareSync(senha, administrador.senha);
            if(!verificarSenha){
                return resposta.status(403).json({mensagem: "E-mail ou senha incorreta!"})
            }
            const token = jwt.sign(
                {
                    id: administrador.id,
                    nome: administrador.nome,
                    email: administrador.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_TEMPO_EXPIRACAO
                }
            );
            resposta.status(200).json({mensagem: "Usuario autenticado com sucesso!", token})

        } catch (error) {
            resposta.status(500).json({mensagem: "Erro interno ao efetuar login!", erro: error.message})
        }
    }
    static async perfil(requicisao, resposta){
        try {
            const administrador = await AdministradorModel.buscarPorEmail(requisicao.administrador.email)
            if(administrador.length === 0){
                return resposta.status(409).json({mensagem: "Usuario precisa fazer login!"})
            }
            resposta.status(200).json(administrador)
        } catch (error) {
            resposta.status(500).json({mensagem: "Erro ao buscar perfil do usuario!", erro: error.message})
        }
    }
}

export default AdministradorController