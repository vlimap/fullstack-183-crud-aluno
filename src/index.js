// Importa o Express, que e a biblioteca usada para criar o servidor da API.
import express from "express";

// Importa o dotenv, que permite ler variaveis de ambiente do arquivo .env.
import dotenv from "dotenv";

// Importa as rotas do modulo de alunos.
// Essas rotas ficam separadas para deixar o index.js mais limpo.
import router from "./modules/aluno/routes/aluno.route.js";

// Carrega as variaveis do arquivo .env para dentro de process.env.
// Exemplo: se no .env existir PORTA=3000, poderemos acessar process.env.PORTA.
dotenv.config();

// Cria a aplicacao Express.
// A variavel app representa o servidor que vai receber as requisicoes.
const app = express();

// Configura o Express para entender JSON no corpo das requisicoes.
// Sem essa linha, requisicao.body poderia vir undefined em rotas POST, PUT e PATCH.
app.use(express.json());

// Registra as rotas do modulo aluno na aplicacao.
// Como nao foi usado prefixo, as rotas ficam diretamente em:
// /listar, /cadastrar, /editar/total/:matricula, etc.
app.use(router);

// Busca a porta definida no arquivo .env.
// Se PORTA=3000, a API vai rodar em http://localhost:3000.
const porta = process.env.PORTA;

// Rota inicial da API.
// Ela serve para testar rapidamente se o servidor esta funcionando.
app.get("/", (requisicao, resposta) => {
  try {
    // Status 200 significa que a requisicao foi bem-sucedida.
    resposta.status(200).json({
      mensagem: "API funcionando com sucesso!",
      status: "ok",
      date: new Date().toLocaleString("pt-BR", { timeZone: "America/Recife" })
    });
  } catch (error) {
    // Status 500 indica erro inesperado no servidor.
    resposta
      .status(500)
      .json({ mensagem: "Erro ao iniciar API!", erro: error.message });
  }
});

// Inicia o servidor na porta configurada.
// A funcao dentro do listen roda quando o servidor sobe com sucesso.
app.listen(porta, () => {
  console.log(`O servidor esta em execucao na porta ${porta}!`);
});
