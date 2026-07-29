import conexao from "../../../config/database.js";

class AdministradorModel {
    /**
     * Cadastra o administrador com a senha ja transformada em hash.
     *
     * O id nao e recebido porque o PostgreSQL o gera automaticamente.
     * O RETURNING lista apenas campos seguros para impedir que o hash
     * da senha seja devolvido pela API.
     */
    static async cadastrar(nome, email, hashSenha) {
        const dados = [nome, email, hashSenha];
        const query = `
            insert into admins(nome, email, senha)
            values ($1, $2, $3)
            returning id, nome, email, ativo, criado_em
        `;
        const resultado = await conexao.query(query, dados);
        return resultado.rows[0];
    }

    /**
     * O PostgreSQL devolve COUNT(*) como texto.
     * Por isso convertemos somente a propriedade count para Number.
     */
    static async contarAdmins() {
        const query = `select count(*) from admins`;
        const resultado = await conexao.query(query);
        return Number(resultado.rows[0].count);
    }

    /**
     * Esta consulta e usada no login e precisa trazer o hash da senha
     * para que o bcrypt possa compara-lo com a senha informada.
     * O hash nunca deve ser enviado na resposta HTTP.
     */
    static async buscarPorEmail(email) {
        const dados = [email];
        const query = `
            select id, nome, email, senha, ativo, criado_em
            from admins
            where email = $1
        `;
        const resultado = await conexao.query(query, dados);
        return resultado.rows[0];
    }

    /**
     * Consulta especifica para o perfil.
     * Diferente da consulta de login, ela nao seleciona a senha.
     */
    static async buscarPerfilPorId(id) {
        const dados = [id];
        const query = `
            select id, nome, email, ativo, criado_em
            from admins
            where id = $1
        `;
        const resultado = await conexao.query(query, dados);
        return resultado.rows[0];
    }
}

export default AdministradorModel;
