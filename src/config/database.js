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

console.log(await conexao.query('SELECT 1+1'))

export default conexao;

