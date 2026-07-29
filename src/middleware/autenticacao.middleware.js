import jwt from "jsonwebtoken";

class AutenticacaoMiddleware {
    /**
     * Middleware de autenticacao JWT
     *
     * Um middleware e uma funcao executada entre a chegada da requisicao
     * e o controller. Ele decide se a requisicao pode continuar.
     *
     * O cliente deve enviar o token neste formato:
     * Authorization: Bearer eyJhbGciOiJIUzI1Ni...
     *
     * Se o token for valido, jwt.verify devolve o payload que foi criado
     * durante o login. Esse payload e salvo em requisicao.administrador
     * para que os proximos middlewares e controllers possam utiliza-lo.
     */
    static autenticar(requisicao, resposta, proximo) {
        const autorizacao = requisicao.headers.authorization;

        /**
         * Primeiro verificamos se o cabecalho foi enviado.
         * O codigo 401 informa que a requisicao nao possui uma
         * autenticacao valida.
         */
        if (!autorizacao) {
            return resposta.status(401).json({
                mensagem: "Token de autenticacao nao fornecido!"
            });
        }

        /**
         * O cabecalho e dividido pelo espaco. No formato "Bearer TOKEN",
         * a posicao 0 contem "Bearer" e a posicao 1 contem o JWT.
         * Por isso usamos [1] para obter somente o token.
         */
        const token = autorizacao.split(" ")[1];

        if (!token) {
            return resposta.status(401).json({
                mensagem: "Token mal formatado. Use: Bearer TOKEN"
            });
        }

        /**
         * O callback recebe:
         * - erro: preenchido quando o token e invalido ou expirou;
         * - usuario: o payload decodificado quando o token e valido.
         *
         * A funcao proximo nao vem do jwt.verify. Ela e o terceiro
         * parametro do middleware Express, declarado no metodo autenticar.
         */
        jwt.verify(token, process.env.JWT_SECRET, (erro, usuario) => {
            if (erro) {
                return resposta.status(403).json({
                    mensagem: "Acesso nao autorizado!"
                });
            }

            requisicao.usuario = usuario;
            requisicao.administrador = usuario;

            return proximo();
        });
    }
}

export default AutenticacaoMiddleware;
