// Importa o model, que e a camada responsavel por manipular os dados.
import AlunoModel from "../models/aluno.model.js";

// O Controller e a camada responsavel por receber a requisicao,
// chamar o model e devolver uma resposta HTTP.
//
// Em outras palavras:
// - a rota define o caminho da API
// - o controller decide o que fazer quando esse caminho e acessado
// - o model mexe nos dados

class AlunoController {
  // Controller da rota POST /cadastrar.
  static cadastrar(requisicao, resposta) {
    try {
      // Pega os dados enviados no corpo da requisicao.
      // Exemplo de body:
      // { "matricula": "a92222", "nome": "Maria", "email": "maria@email.com" }
      const { matricula, nome, email } = requisicao.body;

      // Valida se todos os campos obrigatorios foram enviados.
      if (!matricula || !nome || !email) {
        return resposta
          .status(400)
          .json({ mensagem: "Todos os campos sao obrigatorios!" });
      }

      // Verifica se ja existe um aluno com a mesma matricula.
      // Isso evita cadastrar duas vezes a mesma matricula.
      const alunoJaExiste = AlunoModel.listarPorMatricula(matricula);

      if (alunoJaExiste) {
        return resposta
          .status(400)
          .json({ mensagem: "Ja existe um aluno com essa matricula!" });
      }

      // Chama o model para salvar o aluno.
      const aluno = AlunoModel.cadastrar(matricula, nome, email);

      // Status 201 significa que um recurso foi criado com sucesso.
      return resposta.status(201).json({
        mensagem: "Cadastro realizado com sucesso!",
        aluno
      });
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao cadastrar aluno!", erro: error.message });
    }
  }

  // Controller da rota GET /listar.
  static listarTodos(requisicao, resposta) {
    try {
      const alunos = AlunoModel.listarTodos();

      // Se o array estiver vazio, avisamos que nao ha alunos cadastrados.
      if (alunos.length === 0) {
        return resposta
          .status(200)
          .json({ mensagem: "Nenhum aluno cadastrado!" });
      }

      return resposta.status(200).json(alunos);
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao listar os alunos!", erro: error.message });
    }
  }

  // Controller da rota GET /listar/:matricula.
  static listarPorMatricula(requisicao, resposta) {
    try {
      // req.params contem os parametros que vem na URL.
      // Exemplo: em /listar/a92222, matricula recebe "a92222".
      const { matricula } = requisicao.params;

      const aluno = AlunoModel.listarPorMatricula(matricula);

      if (!aluno) {
        return resposta
          .status(404)
          .json({ mensagem: "Aluno nao encontrado!" });
      }

      return resposta.status(200).json(aluno);
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao listar o aluno!", erro: error.message });
    }
  }

  // Controller da rota PUT /editar/total/:matricula.
  // PUT normalmente e usado para atualizar o recurso de forma completa.
  static editarTotal(requisicao, resposta) {
    try {
      const { matricula } = requisicao.params;
      const { nome, email } = requisicao.body;

      // Como e edicao total, exigimos nome e email.
      if (!nome || !email) {
        return resposta
          .status(400)
          .json({ mensagem: "Nome e email sao obrigatorios para edicao total!" });
      }

      const aluno = AlunoModel.editarTotal(matricula, nome, email);

      if (!aluno) {
        return resposta
          .status(404)
          .json({ mensagem: "Aluno nao encontrado!" });
      }

      return resposta.status(200).json({
        mensagem: "Aluno atualizado com sucesso!",
        aluno
      });
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao atualizar o aluno!", erro: error.message });
    }
  }

  // Controller da rota PATCH /editar/parcial/:matricula.
  // PATCH normalmente e usado para atualizar apenas parte do recurso.
  static editarParcial(requisicao, resposta) {
    try {
      const { matricula } = requisicao.params;
      const { nome, email } = requisicao.body;

      // Na edicao parcial, pelo menos um campo precisa ser enviado.
      if (!nome && !email) {
        return resposta
          .status(400)
          .json({ mensagem: "Informe nome ou email para atualizar!" });
      }

      const aluno = AlunoModel.editarParcial(matricula, nome, email);

      if (!aluno) {
        return resposta
          .status(404)
          .json({ mensagem: "Aluno nao encontrado!" });
      }

      return resposta.status(200).json({
        mensagem: "Aluno atualizado com sucesso!",
        aluno
      });
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao atualizar o aluno!", erro: error.message });
    }
  }

  // Controller da rota DELETE /excluir/todos.
  static excluirTodos(requisicao, resposta) {
    try {
      AlunoModel.excluirTodos();

      return resposta
        .status(200)
        .json({ mensagem: "Todos os alunos foram excluidos!" });
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao excluir todos os alunos!", erro: error.message });
    }
  }

  // Controller da rota DELETE /excluir/:matricula.
  static excluirPorMatricula(requisicao, resposta) {
    try {
      const { matricula } = requisicao.params;

      const aluno = AlunoModel.excluirPorMatricula(matricula);

      if (!aluno) {
        return resposta
          .status(404)
          .json({ mensagem: "Aluno nao encontrado!" });
      }

      return resposta.status(200).json({
        mensagem: "Aluno excluido com sucesso!",
        aluno
      });
    } catch (error) {
      return resposta
        .status(500)
        .json({ mensagem: "Erro ao excluir o aluno!", erro: error.message });
    }
  }
}

export default AlunoController;
