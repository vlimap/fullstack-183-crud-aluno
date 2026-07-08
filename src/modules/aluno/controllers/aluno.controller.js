import AlunoModel from "../models/aluno.model.js";

class AlunoController {
  static cadastrar(requisicao, resposta) {
    try {
      const { matricula, nome, email } = requisicao.body;
      if (!matricula || !nome || !email) {
        return resposta.status(400).json({ mensagem: "Todos os campos são obrigatorios!" });
      }
      AlunoModel.cadastrar(matricula, nome, email);
      resposta.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao cadstrar aluno!"})
    }
  }
  static listarTodos(requisicao, resposta){
    try {
        const alunos = AlunoModel.listarTodos()
        if(alunos.length === 0){
            return resposta.status(200).json({ mensagem: "Nenhum aluno cadastrado!" });
        }
        resposta.status(200).json(alunos)
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao listar os alunos!"})
    }
  }
  static listarPorMatricula(requisicao, resposta){
    try {
        const matricula = requisicao.params.matricula
        const aluno = AlunoModel.listarPorMatricula(matricula)
        if(!aluno){
            return resposta.status(200).json({ mensagem: "Aluno não encontrado!" });
        }
        resposta.status(200).json(aluno)
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao listar os alunos!"})
    }
  }
  static editarTotal(requisicao, resposta){
    try {
        const matricula = requisicao.params.matricula
        const { nome, email } = requisicao.body
        const aluno = AlunoModel.editarTotal(matricula,nome, email)
        resposta.status(200).json(aluno)

    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao atualizar o aluno!"})
    }
  }
  static editarParcial(requisicao, resposta){
    try {
        const matricula = requisicao.params.matricula
        const { nome, email } = requisicao.body
        const aluno = AlunoModel.editarParcial(matricula,nome, email)
        resposta.status(200).json(aluno)
    } catch (error) {
        resposta.status(500).json({ mensagem: "Erro ao atualizar o aluno!"})
    }
  }
  static excluirTodos(requisicao, resposta){
    try {
      AlunoModel.excluirTodos()
      resposta.status(200).json({mensagem: "Todos os alunos foram excluidos!"})
    } catch (error) {
      resposta.status(500).json({ mensagem: "Erro ao excluir todos os alunos!"})
    }
  }
  static excluirPorMatricula(requisicao, resposta){
    try {
      // localhost:3000/listar/:params
      const matricula = requisicao.params.matricula
      AlunoModel.excluirPorMatricula()
      resposta.status(200).json({mensagem: "Aluno excluido com sucesso!"})
    } catch (error) {
      resposta.status(500).json({ mensagem: "Erro ao excluir o  aluno!"})
    }
  }
}

export default AlunoController