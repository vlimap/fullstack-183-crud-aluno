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
    return resultado.rows[0]
  }

  // Retorna todos os alunos cadastrados.
  static async listarTodos() {
    const query = `select * from aluno`
    const resultado = await conexao.query(query)
    return resultado;
  }

  // Busca um aluno pela matricula.
  static async listarPorMatricula(matricula) {
    const dados = [matricula]
    const query = `select * from aluno where matricula = $1`
    const resultado = await conexao.query(query, dados)
    return resultado
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
    return resultado.rows[0]
  }

  // Edita apenas os campos enviados.
  // Nesta API, usamos PATCH quando o usuario pode enviar somente nome ou somente email.
  static editarParcial(matricula, nome, email) {
    const aluno = AlunoModel.listarPorMatricula(matricula);

    if (!aluno) {
      return null;
    }

    // Se nome foi enviado, atualiza o nome.
    // Se nao foi enviado, mantem o nome antigo.
    aluno.nome = nome || aluno.nome;

    // Se email foi enviado, atualiza o email.
    // Se nao foi enviado, mantem o email antigo.
    aluno.email = email || aluno.email;

    return aluno;
  }

  // Exclui um aluno pela matricula.
  static excluirPorMatricula(matricula) {
    // findIndex retorna a posicao do aluno no array.
    // Se nao encontrar, retorna -1.
    const index = alunos.findIndex((aluno) => aluno.matricula === matricula);

    if (index === -1) {
      return null;
    }

    // splice remove itens do array.
    // Aqui removemos 1 item na posicao encontrada.
    const alunoRemovido = alunos.splice(index, 1);

    // splice retorna um array com os itens removidos.
    // Como removemos apenas um aluno, retornamos a posicao 0.
    return alunoRemovido[0];
  }

  // Exclui todos os alunos do array.
  static excluirTodos() {
    // Definir length como 0 limpa o array original.
    alunos.length = 0;
  }
}

export default AlunoModel;
