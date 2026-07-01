import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Usar aplicação como json
app.use(express.json());

const porta = process.env.PORTA;

const alunos = [];

// verificar a saude da api
app.get("/", (requisicao, resposta) => {
  try {
    resposta.status(200)
      .json({
        mensagem: "API funcionando com sucesso!",
        status: "ok",
        date: new Date().toLocaleString("pt-BR", { timeZone: "America/Recife" })
      });
  } catch (error) {
    resposta
      .status(500)
      .json({ mensagem: "Erro ao iniciar API!", erro: error.message });
  }
});

app.get("/listar", (requisicao, resposta) => {
  try {
    if (alunos.length === 0) {
      return resposta
        .status(200)
        .json({ mensagem: "Nenhum aluno cadastrado!" });
    }
    resposta.status(200).json(alunos);
  } catch (error) {
    resposta
      .status(500)
      .json({ mensagem: "Erro ao listar os alunos", erro: error });
  }
});

// Endpoint para listar aluno pelo matricula
// http://localhost:3000/listar/a92222
app.get("/listar/:matricula", (requisicao, resposta) => {
  try {
    const matricula = requisicao.params.matricula;
    // const alunos = [{},{},{}]
    const aluno_procurado = alunos.find(
      (aluno) => aluno.matricula === matricula,
    );

    // e se o aluno que eu estou procurando não existir?
    if (!aluno_procurado) {
      return resposta.status(200).json({ mensagem: "Aluno não encontrado!" });
    }

    resposta.status(200).json(aluno_procurado);
  } catch (error) {
    resposta
      .status(500)
      .json({ mensagem: "Erro ao listar o aluno", erro: error });
  }
});

// Endpoint para cadastrar um aluno
app.post("/cadastrar", (requisicao, resposta) => {
  try {
    // corpo da requisição com os dados que preciso
    const { matricula, nome, email } = requisicao.body;

    // salvando os dados que enviei ao servidor pela req
    const dados = { matricula, nome, email };

    // Vericando se todos os campos foram preenchidos, caso não retorna erro 400
    if (!matricula || !nome || !email) {
      return resposta
        .status(400)
        .json({ mensagem: "Todos os campos são obrigatorios!" });
    }

    // Salvando os dados em array(memoria) via push
    alunos.push(dados);

    // resposta informando que o aluno foi cadastrado
    // codigo http para created
    resposta.status(201).json({ mensagem: "Cadastro realizado com sucesso!" });
  } catch (error) {
    resposta
      .status(500)
      .json({ mensagem: "Erro ao cadastrar usuario!", erro: error });
  }
});

app.put("/editar/:matricula", (requisicao, resposta) => {
  try {
    const matricula = requisicao.params.matricula;
    const aluno = alunos.find((aluno) => aluno.matricula === matricula);
    if (!aluno) {
      return resposta.status(400).json({ mensagem: "Aluno não encontrado!" });
    }
    // enviando para o servidor novos dados para editar o aluno
    const { novoNome, novoEmail } = requisicao.body;
    if (!novoNome || !novoEmail) {
      return resposta
        .status(400)
        .json({ mensagem: "Todos os campos para edição são obrigatorios!" });
    }

    aluno.nome = novoNome;
    aluno.email = novoEmail;

    resposta.status(200).json({ mensagem: "Aluno atualizado com sucesso!" });
  } catch (error) {
    resposta
      .status(500)
      .json({ mensagem: "Erro ao editar o aluno!", erro: error });
  }
});

app.patch("/editar/:matricula", (requisicao, resposta) => {
  try {
    const matricula = requisicao.params.matricula;
    const aluno = alunos.find((aluno) => aluno.matricula === matricula);
    if (!aluno) {
      return resposta.status(400).json({ mensagem: "Aluno não encontrado!" });
    }
    const { novoNome, novoEmail } = requisicao.body;

    aluno.nome = novoNome || aluno.nome;

    aluno.email = novoEmail || aluno.email;

    resposta.status(200).json({ mensagem: "Aluno atualizado com sucesso!" });
  } catch (error) {
    resposta
      .status(500)
      .json({ mensagem: "Erro ao editar o aluno!", erro: error });
  }
});

app.delete("/excluir/todos", (requisicao, resposta) => {
  try {
    alunos.length = 0;
    resposta.status(200).json({ mensagem: "Todos os alunos foram excluidos!" });
  } catch (error) {
    resposta
      .status(500)
      .json({ mensagem: "Erro ao excluir os alunos!", erro: error });
  }
});

app.delete("/excluir/:matricula", (requisicao, resposta) => {
  try {
    const matricula = requisicao.params.matricula;
    const alunoIndex = alunos.findIndex(
      (aluno) => aluno.matricula === matricula,
    );
    if (alunoIndex === -1) {
      return resposta.status(400).json({ mensagem: "Aluno não encontrado!" });
    }
    alunos.splice(alunoIndex, 1);
    resposta.status(200).json({ mensagem: "Aluno excluido com sucesso!" });
  } catch (error) {
    resposta
      .status(500)
      .json({ mensagem: "Erro ao excluir os alunos!", erro: error });
  }
});

app.listen(porta, () => {
  console.log(`O servidor está em execução!`);
});
