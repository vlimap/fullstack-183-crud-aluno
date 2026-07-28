import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

class AutenticacaoMiddleware {
    static autenticar(requisicao, resposta, proximo) {
        const authead = requisicao.headers['authorization']
        const token = authead && authead.split(' ')[1]

        if (!token) {
            return resposta.status(401).json({ mensagem: "Acesso não autorizado!" })
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
            if (err) {
                return resposta.status(403).json({ mensagem: "Acesso não autorizado!" })
            }
            requisicao.usuario = usuario
            proximo()
        })
    }
}

export default AutenticacaoMiddleware