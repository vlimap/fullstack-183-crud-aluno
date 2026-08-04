// Em um projeto real, aqui normalmente fariamos a conexao com um banco
// como MySQL, PostgreSQL, MongoDB, SQLite, entre outros.
import pg from "pg";
import dotenv from "dotenv";

// Carrega as variaveis de ambiente antes de abrir a conexao.
dotenv.config();

const { Pool } = pg;

const conexao = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
});

try {
  // O teste abaixo confirma que o banco respondeu antes da API aceitar requisicoes.
  await conexao.query(`select 1 + 1`);
  console.log("Conexao realizada com sucesso!");
} catch (error) {
  console.error({ mensagem: "Erro ao iniciar banco", erro: error.message });
}

export default conexao;

