// Importa a conexão do banco pg
import conexao from "../../../config/database.js";

// O Model e a camada responsavel por lidar diretamente com os dados.
//
// Neste projeto, o model mexe no array alunos:
// - adiciona aluno
// - lista aluno
// - edita aluno
// - exclui aluno
//
// Os metodos sao static porque nao precisamos criar objetos com new AlunoModel().
// Chamamos direto assim: AlunoModel.cadastrar(...).
class AlunoModel {
  // Cadastra um novo aluno no array.
  static async cadastrar(matricula, nome, email) {
    const dados = [matricula, nome, email]
    const query = `insert into aluno(matricula, nome, email) values ($1, $2, $3) RETURNING *`
    const resultado = await conexao.query(query, dados)
    return resultado.rows
  }

  // Retorna todos os alunos cadastrados.
  static async listarTodos() {
    const query = `select * from aluno`
    const resultado = await conexao.query(query)
    return resultado.rows;
  }

  // Busca um aluno pela matricula.
  static async listarPorMatricula(matricula) {
    const dados = [matricula]
    const query = `select * from aluno where matricula = $1`
    const resultado = await conexao.query(query, dados)
    return resultado.rows
  }

  // Edita todos os dados editaveis de um aluno.
  // Nesta API, usamos PUT quando nome e email precisam ser enviados.
  static async editarTotal(matricula, nome, email) {
    // Primeiro procuramos o aluno pela matricula.
    const aluno = await AlunoModel.listarPorMatricula(matricula);

    // Se o aluno nao existir, retornamos null para o controller tratar.
    if (aluno.length === 0) {
      return null;
    }

    const dados = [matricula, nome, email]
    const query = `update aluno 
        set nome = $2, email = $3
        where matricula = $1 returning *;`
    const resultado = await conexao.query(query, dados)
    return resultado.rows
  }

  // Edita apenas os campos enviados.
  // Nesta API, usamos PATCH quando o usuario pode enviar somente nome ou somente email.
  static async editarParcial(matricula, nome, email) {
    const aluno = await AlunoModel.listarPorMatricula(matricula);
    if (aluno.length === 0) {
      return null;
    }
    const dados = [matricula, nome, email]
    const query = `update aluno 
        set nome = coalesce($2, nome), email = coalesce($3, email)
        where matricula = $1 returning *;`
    const resultado = await conexao.query(query, dados)
    return resultado.rows
  }

  // Exclui um aluno pela matricula.
  static async excluirPorMatricula(matricula) {
    const aluno = await AlunoModel.listarPorMatricula(matricula);
    if (aluno.length === 0) {
      return null;
    }
    const dados = [matricula]
    const query = `delete from aluno where matricula = $1 returning *`
    const resultado = await conexao.query(query, dados)
    return resultado.rows
  }

  // Exclui todos os alunos do array.
  static async excluirTodos() {
    const query =`delete from aluno returning *`
    const resultado = await conexao.query(query)
    return resultado.rows
  }
}

export default AlunoModel;
