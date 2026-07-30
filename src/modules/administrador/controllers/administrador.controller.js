import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdministradorModel from "../models/administrador.model.js";

class AdministradorController {
    /**
     * Cadastro inicial do administrador
     *
     * O sistema permite somente um administrador. Antes de salvar,
     * validamos os dados e transformamos a senha em um hash irreversivel.
     * Assim, a senha original nunca e armazenada no banco.
     */
    static async cadastrar(requisicao, resposta) {
        try {
            const { nome, email, senha } = requisicao.body;

            if (!nome || !email || !senha) {
                return resposta.status(400).json({
                    mensagem: "Todos os campos sao obrigatorios!"
                });
            }

            const totalAdmin = await AdministradorModel.verificaAdminsAtivos();
            if (totalAdmin > 0 ) {
                return resposta.status(409).json({
                    mensagem: "Existe um administrador cadastrado e ativo no sistema!"
                });
            }
            
            if (senha.length < 8) {
                return resposta.status(400).json({
                    mensagem: "A senha deve ter no minimo 8 caracteres!"
                });
            }

            const regexSenha = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,32}$/;
            if (!regexSenha.test(senha)) {
                return resposta.status(400).json({
                    mensagem: "Senha invalida! Use letra maiuscula, minuscula, numero e caractere especial."
                });
            }

            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
            if (!regexEmail.test(email)) {
                return resposta.status(400).json({
                    mensagem: "E-mail invalido. Forneca um e-mail valido!"
                });
            }

            /**
             * O numero 10 representa o custo do hash. Quanto maior,
             * mais trabalhoso fica testar senhas por forca bruta.
             */
            const hashSenha = await bcrypt.hash(senha, 10);
            const administrador = await AdministradorModel.cadastrar(
                nome,
                email,
                hashSenha
            );

            return resposta.status(201).json({
                mensagem: "Usuario administrador criado com sucesso!",
                administrador
            });
        } catch (error) {
            return resposta.status(500).json({
                mensagem: "Erro ao cadastrar administrador!",
                erro: error.message
            });
        }
    }

    /**
     * Login e criacao do JWT
     *
     * A senha enviada nao e descriptografada nem comparada diretamente.
     * bcrypt.compare calcula o hash e verifica se ele corresponde ao
     * hash armazenado no banco.
     */
    static async login(requisicao, resposta) {
        try {
            const { email, senha } = requisicao.body;

            if (!email || !senha) {
                return resposta.status(400).json({
                    mensagem: "Forneca o e-mail e a senha para login!"
                });
            }

            const administrador = await AdministradorModel.buscarPorEmail(email);

            if (!administrador) {
                return resposta.status(401).json({
                    mensagem: "E-mail ou senha incorretos!"
                });
            }

            if (administrador.ativo === false) {
                return resposta.status(403).json({
                    mensagem: "Administrador inativo!"
                });
            }

            const senhaCorreta = await bcrypt.compare(senha, administrador.senha);
            if (!senhaCorreta) {
                return resposta.status(401).json({
                    mensagem: "E-mail ou senha incorretos!"
                });
            }

            /**
             * O payload deve conter apenas informacoes necessarias.
             * Nunca colocamos senha ou dados sensiveis dentro do JWT,
             * pois seu conteudo pode ser lido pelo cliente.
             */
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

            return resposta.status(200).json({
                mensagem: "Usuario autenticado com sucesso!",
                token
            });
        } catch (error) {
            return resposta.status(500).json({
                mensagem: "Erro interno ao efetuar login!",
                erro: error.message
            });
        }
    }

    /**
     * Perfil protegido
     *
     * O middleware valida o token antes deste metodo e coloca o payload
     * em requisicao.administrador. Usamos o id do token em vez de aceitar
     * um e-mail pela URL, impedindo que um usuario escolha outro perfil.
     */
    static async perfil(requisicao, resposta) {
        try {
            const idDoToken = requisicao.usuario.id;
            const administrador = await AdministradorModel.buscarPerfilPorId(idDoToken);

            if (!administrador) {
                return resposta.status(404).json({
                    mensagem: "Usuario nao encontrado!"
                });
            }

            return resposta.status(200).json(administrador);
        } catch (error) {
            return resposta.status(500).json({
                mensagem: "Erro ao buscar perfil do usuario!",
                erro: error.message
            });
        }
    }
}

export default AdministradorController;
