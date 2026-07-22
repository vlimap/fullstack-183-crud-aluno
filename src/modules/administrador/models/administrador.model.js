import conexao from "../../../config/database.js"

class AdministradorModel{
    static async cadastrar(id, nome, email, senha){
        const dados = [id, nome, email, senha]
        const query = `insert into admins(id, nome, email, senha) 
                        values ($1, $2, $3, $4) returning *`
        const resultado = await conexao.query(query, dados)
        return resultado.rows
    }
    static async contarAdmins(){
        const query = `select count(*) from admins`
        const resultado = await conexao.query(query)
        return Number(resultado.rows)
    }
    static async buscarPorEmail(email){
        const dados = [email]
        const query = `select email from admins
                        where email = $1`
        const resultado = await conexao.query(query, dados)
        return resultado.rows
    }

}

export default AdministradorModel;