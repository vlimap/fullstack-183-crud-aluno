// Este arquivo simula um banco de dados usando um array em memoria.
//
// Em um projeto real, aqui normalmente fariamos a conexao com um banco
// como MySQL, PostgreSQL, MongoDB, SQLite, entre outros.
//
// Como este projeto e didatico, vamos guardar os alunos neste array.
// Importante: quando o servidor for reiniciado, os dados serao apagados.
const alunos = [];

// Exporta o array para que outros arquivos possam cadastrar, listar,
// editar e excluir alunos.
export default alunos;
