import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carrega as variaveis de ambiente para que o segredo do JWT possa ser lido.
dotenv.config();

class AutenticacaoMiddleware {
    // Valida se a requisicao possui um token Bearer valido.
    // Quando o token e valido, o payload fica disponivel em requisicao.usuario.
    static autenticar(requisicao, resposta, proximo) {
        const autorizacao = requisicao.headers["authorization"];
        const token = autorizacao && autorizacao.split(" ")[1];

        if (!token) {
            return resposta.status(401).json({ mensagem: "Acesso nao autorizado!" });
        }
        jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
            if (erro) {
                return resposta.status(403).json({ mensagem: "Acesso nao autorizado!" });
            }
            requisicao.usuario = usuario;
            requisicao.administrador = usuario;
            proximo();
        });
    }
}

export default AutenticacaoMiddleware;