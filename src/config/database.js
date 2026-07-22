// Em um projeto real, aqui normalmente fariamos a conexao com um banco
// como MySQL, PostgreSQL, MongoDB, SQLite, entre outros.
import pg from 'pg'
import dotenv from "dotenv"
dotenv.config()

const { Pool } = pg

const conexao = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
})

try {
  await conexao.query(`select 1+1`)
  console.log("Conexão realizada com sucesso!")
} catch (error) {
  console.error({mensagem: "Erro ao iniciar banco", erro: error.message})
}

export default conexao;

